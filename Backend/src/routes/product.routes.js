const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const asyncHandler = require("../utils/asyncHandler");
const { validatePagination } = require("../middleware/validate");

const router = express.Router();

router.get("/", validatePagination, asyncHandler(getAllProducts));

router.get("/:id", asyncHandler(getProductById));

router.post("/", protect, allowRoles("farmer"), asyncHandler(createProduct));

router.patch(
  "/:id",
  protect,
  allowRoles("farmer"),
  asyncHandler(updateProduct),
);

router.delete(
  "/:id",
  protect,
  allowRoles("farmer"),
  asyncHandler(deleteProduct),
);

module.exports = router;
