const express = require("express");

const {
  getUsers,
  getPlatformStats,
  getPendingSuppliers,
  verifySupplier,
} = require("../controllers/admin.controller");

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get(
  "/users",
  asyncHandler(getUsers)
);

router.get(
  "/stats",
  asyncHandler(getPlatformStats)
);

router.get(
  "/suppliers/pending",
  asyncHandler(getPendingSuppliers)
);

router.patch(
  "/suppliers/:id/verify",
  asyncHandler(verifySupplier)
);

module.exports = router;