const express = require("express");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notification.controller");

const protect = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(protect);

router.get("/", asyncHandler(getNotifications));

router.get("/unread-count", asyncHandler(getUnreadCount));

router.patch("/read-all", asyncHandler(markAllAsRead));

router.patch("/:id/read", asyncHandler(markAsRead));

module.exports = router;
