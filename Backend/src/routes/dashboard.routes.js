const express = require("express");

const {
  farmerDashboard,
  buyerDashboard,
  adminDashboard,
} = require("../controllers/dashboard.controller");

const protect = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(protect);

router.get("/farmer", asyncHandler(farmerDashboard));

router.get("/buyer", asyncHandler(buyerDashboard));

router.get("/admin", asyncHandler(adminDashboard));

module.exports = router;
