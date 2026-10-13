const express = require("express");

const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  getMySupplierProfile,
  updateSupplier,
} = require("../controllers/supplier.controller");

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(getAllSuppliers)
);

router.get(
  "/my",
  protect,
  asyncHandler(getMySupplierProfile)
);

router.get(
  "/:id",
  asyncHandler(getSupplierById)
);

router.post(
  "/",
  protect,
  allowRoles("farmer", "admin"),
  asyncHandler(createSupplier)
);

router.patch(
  "/:id",
  protect,
  allowRoles("farmer", "admin"),
  asyncHandler(updateSupplier)
);

module.exports = router;