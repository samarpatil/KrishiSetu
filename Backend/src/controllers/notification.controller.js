const mongoose = require("mongoose");

const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");

// Get current user's notifications
const getNotifications = async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;

  const pageNumber = Math.max(Number(page) || 1, 1);

  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const filter = {
    recipient: req.user._id,
  };

  if (unreadOnly === "true") {
    filter.read = false;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .populate("relatedOrder", "status totalAmount")
      .populate("relatedProduct", "name category")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber),

    Notification.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      notifications,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    },
  });
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    read: false,
  });

  res.status(200).json({
    success: true,
    data: {
      count,
    },
  });
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid notification ID");
  }

  const notification = await Notification.findOne({
    _id: id,
    recipient: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  notification.read = true;

  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: {
      notification,
    },
  });
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    {
      recipient: req.user._id,
      read: false,
    },
    {
      $set: {
        read: true,
      },
    },
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
