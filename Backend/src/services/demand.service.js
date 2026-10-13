const DemandRecord = require("../models/DemandRecord");

const createDemandRecord = async (order, options = {}) => {
  const product = order?.product;

  if (!product || !order?._id) {
    return null;
  }

  const data = {
    order: order._id,
    productName: product.name,
    category: product.category,
    quantity: order.quantity,
    unit: order.unit,
    location: {
      address: order.deliveryAddress?.address || "",
      lat: order.deliveryAddress?.lat,
      lng: order.deliveryAddress?.lng,
    },
    source: "order",
    status: "active",
    recordedAt: new Date(),
  };

  const queryOptions = options.session ? { session: options.session } : {};

  // Reuse an existing record if this function is called again.
  return DemandRecord.findOneAndUpdate(
    { order: order._id },
    { $setOnInsert: data },
    {
      ...queryOptions,
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
};

const updateDemandRecordStatus = async (orderId, status, options = {}) => {
  if (!["active", "cancelled"].includes(status)) {
    throw new Error("Invalid demand record status");
  }

  const queryOptions = options.session ? { session: options.session } : {};

  return DemandRecord.findOneAndUpdate(
    { order: orderId },
    { $set: { status } },
    { ...queryOptions, new: true },
  );
};

module.exports = {
  createDemandRecord,
  updateDemandRecordStatus,
};
