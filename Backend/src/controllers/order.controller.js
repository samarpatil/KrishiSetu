const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const {
  notifyOrderCreated,
  notifyOrderAccepted,
  notifyOrderCompleted,
} = require("../services/notification.service");

const {
  createDemandRecord,
  updateDemandRecordStatus,
} = require("../services/demand.service");
const { createAuditLog } = require("../services/audit.service");

const ORDER_STATUSES = [
  "pending",
  "accepted",
  "processing",
  "completed",
  "cancelled",
];

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const parsePagination = (query) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new ApiError(400, "Page and limit must be positive integers");
  }

  return {
    pageNumber: page,
    limitNumber: Math.min(limit, 50),
  };
};

const runSideEffect = async (label, callback) => {
  try {
    await callback();
  } catch (error) {
    console.error(`${label} failed:`, error.message);
  }
};

const writeAudit = (data) =>
  runSideEffect("Audit log", () => createAuditLog(data));

// CREATE ORDER
const createOrder = async (req, res) => {
  const { product: productId, quantity, deliveryAddress, notes } = req.body;

  if (!isValidId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw new ApiError(400, "Quantity must be a positive number");
  }

  if (
    !deliveryAddress ||
    typeof deliveryAddress.address !== "string" ||
    !deliveryAddress.address.trim()
  ) {
    throw new ApiError(400, "Delivery address is required");
  }

  const session = await mongoose.startSession();

  let createdOrder;

  try {
    await session.withTransaction(async () => {
      // Find the product inside the transaction.
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new ApiError(404, "Product not found");
      }

      if (product.status !== "available") {
        throw new ApiError(400, "This product is not available");
      }

      if (String(product.seller) === String(req.user._id)) {
        throw new ApiError(400, "You cannot order your own product");
      }

      if (product.quantity < quantity) {
        throw new ApiError(400, `Only ${product.quantity} units are available`);
      }

      // Atomically deduct stock only if sufficient stock
      // remains and the listing is still available.
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
          status: "available",
          quantity: { $gte: quantity },
        },
        {
          $inc: { quantity: -quantity },
        },
        {
          new: true,
          session,
        },
      );

      if (!updatedProduct) {
        throw new ApiError(409, "Product stock changed. Please try again.");
      }

      // Mark the listing sold when no stock remains.
      if (updatedProduct.quantity === 0) {
        updatedProduct.status = "sold";
        await updatedProduct.save({ session });
      }

      const totalAmount = quantity * product.pricePerUnit;

      if (!Number.isFinite(totalAmount)) {
        throw new ApiError(400, "Unable to calculate order amount");
      }

      // Create the order in the same transaction.
      const [order] = await Order.create(
        [
          {
            product: product._id,
            buyer: req.user._id,
            seller: product.seller,
            quantity,
            unit: product.unit,
            pricePerUnit: product.pricePerUnit,
            totalAmount,
            status: "pending",
            deliveryAddress: {
              address: deliveryAddress.address.trim(),
              lat: deliveryAddress.lat,
              lng: deliveryAddress.lng,
            },
            notes: typeof notes === "string" ? notes.trim() : "",
          },
        ],
        { session },
      );

      // Record demand in the same transaction.
      await createDemandRecord(
        {
          _id: order._id,
          product,
          quantity: order.quantity,
          unit: order.unit,
          deliveryAddress: order.deliveryAddress,
        },
        { session },
      );

      createdOrder = order;
    });
  } finally {
    await session.endSession();
  }

  // Populate only after the transaction commits.
  await createdOrder.populate([
    {
      path: "product",
      select: "name category unit pricePerUnit quality",
    },
    {
      path: "buyer",
      select: "name org email role",
    },
    {
      path: "seller",
      select: "name org email role",
    },
  ]);

  // Non-critical side effects run after a successful commit.
  await runSideEffect("Order creation notification", () =>
    notifyOrderCreated(createdOrder),
  );

  await runSideEffect("Order creation audit log", () =>
    createAuditLog({
      user: req.user._id,
      action: "CREATE",
      resource: "Order",
      resourceId: createdOrder._id,
      details: `Order created for ${quantity} ${createdOrder.unit}`,
      ipAddress: req.ip,
    }),
  );

  return res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: { order: createdOrder },
  });
};

// GET BUYER ORDERS
const getMyOrders = async (req, res) => {
  const { pageNumber, limitNumber } = parsePagination(req.query);
  const { status } = req.query;

  if (status && !ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid order status filter");
  }

  const filter = { buyer: req.user._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("product", "name category unit pricePerUnit quality")
      .populate("seller", "name org email")
      .sort({ createdAt: -1, _id: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    },
  });
};

// GET FARMER'S RECEIVED ORDERS
const getReceivedOrders = async (req, res) => {
  const { pageNumber, limitNumber } = parsePagination(req.query);
  const { status } = req.query;

  if (status && !ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid order status filter");
  }

  const filter = { seller: req.user._id };
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("product", "name category unit pricePerUnit quality")
      .populate("buyer", "name org email")
      .sort({ createdAt: -1, _id: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    },
  });
};

// GET SINGLE ORDER
const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findById(id)
    .populate("product", "name category quantity unit pricePerUnit quality")
    .populate("buyer", "name org email role")
    .populate("seller", "name org email role");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const isBuyer = String(order.buyer._id) === String(req.user._id);
  const isSeller = String(order.seller._id) === String(req.user._id);
  const isAdmin = req.user.role === "admin";

  if (!isBuyer && !isSeller && !isAdmin) {
    throw new ApiError(403, "You are not allowed to view this order");
  }

  res.status(200).json({
    success: true,
    data: { order },
  });
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidId(id)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid order status");
  }

  const session = await mongoose.startSession();

  let updatedOrder;
  let previousStatus;

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(id).session(session);

      if (!order) {
        throw new ApiError(404, "Order not found");
      }

      const isBuyer = String(order.buyer) === String(req.user._id);

      const isSeller = String(order.seller) === String(req.user._id);

      const isAdmin = req.user.role === "admin";

      if (!isBuyer && !isSeller && !isAdmin) {
        throw new ApiError(403, "You are not allowed to update this order");
      }

      if (order.status === status) {
        throw new ApiError(400, `Order is already ${status}`);
      }

      // Buyers can only cancel their own pending orders.
      if (isBuyer && !isAdmin) {
        if (status !== "cancelled") {
          throw new ApiError(403, "Buyer can only cancel the order");
        }

        if (order.status !== "pending") {
          throw new ApiError(400, "Only pending orders can be cancelled");
        }
      }

      // Allowed forward transitions.
      // Admins may perform these transitions too, but cannot
      // skip stages or reverse a completed/cancelled order.
      const validTransition =
        (order.status === "pending" && status === "accepted") ||
        (order.status === "accepted" && status === "processing") ||
        (order.status === "processing" && status === "completed");

      const isCancellation =
        status === "cancelled" && order.status === "pending";

      if (!isBuyer && !validTransition && !isCancellation) {
        throw new ApiError(400, "Invalid order status transition");
      }

      // Non-admin sellers can only progress their own orders.
      if (isSeller && !isAdmin && !isBuyer) {
        if (!validTransition) {
          throw new ApiError(
            400,
            "Seller can only move the order to the next status",
          );
        }
      }

      previousStatus = order.status;

      // Restore stock and cancel demand in the same transaction.
      if (isCancellation) {
        const product = await Product.findById(order.product).session(session);

        if (product) {
          product.quantity += order.quantity;

          // A sold listing becomes available when stock returns.
          if (product.status === "sold") {
            product.status = "available";
          }

          await product.save({ session });
        }

        await updateDemandRecordStatus(order._id, "cancelled", { session });
      }

      order.status = status;
      await order.save({ session });

      updatedOrder = order;
    });
  } finally {
    await session.endSession();
  }

  // Populate the order after the transaction succeeds.
  await updatedOrder.populate([
    {
      path: "product",
      select: "name category unit pricePerUnit quality",
    },
    {
      path: "buyer",
      select: "name org email role",
    },
    {
      path: "seller",
      select: "name org email role",
    },
  ]);

  // Notifications run after the transaction commits.
  if (status === "accepted" && previousStatus !== "accepted") {
    await runSideEffect("Acceptance notification", () =>
      notifyOrderAccepted(updatedOrder),
    );
  }

  if (status === "completed" && previousStatus !== "completed") {
    await runSideEffect("Completion notification", () =>
      notifyOrderCompleted(updatedOrder),
    );
  }

  // Keep the response format consistent with your controller.
  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: { order: updatedOrder },
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  getOrderById,
  updateOrderStatus,
};
