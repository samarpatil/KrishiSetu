const User = require("../models/User");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Order = require("../models/Order");

// ==========================================
// FARMER DASHBOARD
// ==========================================

const getFarmerDashboard = async (farmerId) => {
  const [
    totalListings,
    availableListings,
    totalOrders,
    pendingOrders,
    acceptedOrders,
    processingOrders,
    completedOrders,
    sales,
  ] = await Promise.all([
    Product.countDocuments({
      seller: farmerId,
    }),

    Product.countDocuments({
      seller: farmerId,
      status: "available",
    }),

    Order.countDocuments({
      seller: farmerId,
    }),

    Order.countDocuments({
      seller: farmerId,
      status: "pending",
    }),

    Order.countDocuments({
      seller: farmerId,
      status: "accepted",
    }),

    Order.countDocuments({
      seller: farmerId,
      status: "processing",
    }),

    Order.countDocuments({
      seller: farmerId,
      status: "completed",
    }),

    Order.aggregate([
      {
        $match: {
          seller: farmerId,
          status: "completed",
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
    ]),
  ]);

  return {
    listings: {
      total: totalListings,
      available: availableListings,
    },

    orders: {
      total: totalOrders,
      pending: pendingOrders,
      accepted: acceptedOrders,
      processing: processingOrders,
      completed: completedOrders,
    },

    sales: sales.length > 0 ? sales[0].total : 0,
  };
};

// ==========================================
// CONSUMER DASHBOARD
// ==========================================

const getBuyerDashboard = async (buyerId) => {
  const [
    totalOrders,
    pendingOrders,
    acceptedOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    spending,
  ] = await Promise.all([
    Order.countDocuments({
      buyer: buyerId,
    }),

    Order.countDocuments({
      buyer: buyerId,
      status: "pending",
    }),

    Order.countDocuments({
      buyer: buyerId,
      status: "accepted",
    }),

    Order.countDocuments({
      buyer: buyerId,
      status: "processing",
    }),

    Order.countDocuments({
      buyer: buyerId,
      status: "completed",
    }),

    Order.countDocuments({
      buyer: buyerId,
      status: "cancelled",
    }),

    Order.aggregate([
      {
        $match: {
          buyer: buyerId,
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
    ]),
  ]);

  return {
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      accepted: acceptedOrders,
      processing: processingOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
    },

    spending: spending.length > 0 ? spending[0].total : 0,
  };
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

const getAdminDashboard = async () => {
  const [
    totalUsers,
    farmers,
    buyers,
    totalProducts,
    totalSuppliers,
    totalOrders,
    completedOrders,
    cancelledOrders,
    revenue,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "farmer",
    }),

    User.countDocuments({
      role: "buyer",
    }),

    Product.countDocuments(),

    Supplier.countDocuments(),

    Order.countDocuments(),

    Order.countDocuments({
      status: "completed",
    }),

    Order.countDocuments({
      status: "cancelled",
    }),

    Order.aggregate([
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
    ]),
  ]);

  return {
    users: {
      total: totalUsers,
      farmers,
      buyers,
    },

    products: totalProducts,

    suppliers: totalSuppliers,

    orders: {
      total: totalOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
    },

    revenue: revenue.length > 0 ? revenue[0].total : 0,
  };
};

module.exports = {
  getFarmerDashboard,
  getBuyerDashboard,
  getAdminDashboard,
};
