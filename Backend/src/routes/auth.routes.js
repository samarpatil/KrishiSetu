const express = require("express");

const {
  register,
  login,
  getMe,
  farmerTest,
} = require("../controllers/auth.controller");
const asyncHandler = require("../utils/asyncHandler");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));
router.get(
  "/farmer-test",
  protect,
  allowRoles("farmer"),
  asyncHandler(farmerTest),
);

module.exports = router;
