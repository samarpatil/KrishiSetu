const express = require("express");

const {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Buyer creates order
router.post("/", allowRoles("buyer"), asyncHandler(createOrder));

// Buyer gets own orders
router.get("/my", allowRoles("buyer"), asyncHandler(getMyOrders));

// Farmer gets received orders
router.get("/received", allowRoles("farmer"), asyncHandler(getReceivedOrders));

// Buyer / Farmer / Admin gets specific order
router.get("/:id", asyncHandler(getOrderById));

// Buyer / Farmer / Admin updates order status
router.patch("/:id/status", asyncHandler(updateOrderStatus));

module.exports = router;
