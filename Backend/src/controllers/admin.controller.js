const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Supplier = require("../models/Supplier");
const ApiError = require("../utils/ApiError");

const getUsers = async (req, res) => {
  const { role, search, page = 1, limit = 10 } = req.query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 50);

  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),

    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    data: {
      users,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    },
  });
};

const getPlatformStats = async (req, res) => {
  const [users, farmers, buyers, products, suppliers, orders] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "buyer" }),
      Product.countDocuments(),
      Supplier.countDocuments(),
      Order.countDocuments(),
    ]);

  const revenue = await Order.aggregate([
    {
      $match: {
        status: {
          $ne: "cancelled",
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
      farmers,
      buyers,
      products,
      suppliers,
      orders,
      totalOrderValue: revenue.length > 0 ? revenue[0].total : 0,
    },
  });
};

const getPendingSuppliers = async (req, res) => {
  const suppliers = await Supplier.find({
    verified: false,
    status: "active",
  })
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: suppliers.length,
    data: {
      suppliers,
    },
  });
};

const verifySupplier = async (req, res) => {
  const { id } = req.params;

  const supplier = await Supplier.findById(id);

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  supplier.verified = true;

  await supplier.save();

  res.status(200).json({
    success: true,
    message: "Supplier verified successfully",
    data: {
      supplier,
    },
  });
};

module.exports = {
  getUsers,
  getPlatformStats,
  getPendingSuppliers,
  verifySupplier,
};
