const mongoose = require("mongoose");

const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = async (req, res) => {
  const {
    name,
    category,
    quantity,
    unit,
    pricePerUnit,
    quality,
    description,
    location,
  } = req.body;

  if (
    !name ||
    !category ||
    quantity === undefined ||
    !unit ||
    pricePerUnit === undefined
  ) {
    throw new ApiError(
      400,
      "Name, category, quantity, unit and price are required",
    );
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  if (pricePerUnit < 0) {
    throw new ApiError(400, "Price cannot be negative");
  }

  const product = await Product.create({
    name,
    category,
    quantity,
    unit,
    pricePerUnit,
    quality,
    description,
    location,
    seller: req.user._id,
    status: "available",
  });

  res.status(201).json({
    success: true,
    message: "Product listed successfully",
    data: {
      product,
    },
  });
};

// ==========================================
// GET ALL AVAILABLE PRODUCTS
// ==========================================

const getAllProducts = async (req, res) => {
  const {
    search,
    category,
    quality,
    minPrice,
    maxPrice,
    sort = "newest",
  } = req.query;

  const page = req.pagination?.page || 1;
  const limit = req.pagination?.limit || 10;
  const skip = req.pagination?.skip || 0;

  const filter = {
    status: "available",
  };

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    filter.category = {
      $regex: `^${category}$`,
      $options: "i",
    };
  }

  if (quality) {
    filter.quality = quality;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerUnit = {};

    if (minPrice !== undefined) {
      filter.pricePerUnit.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.pricePerUnit.$lte = Number(maxPrice);
    }
  }

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "price_asc") {
    sortOption = {
      pricePerUnit: 1,
    };
  }

  if (sort === "price_desc") {
    sortOption = {
      pricePerUnit: -1,
    };
  }

  if (sort === "quantity_desc") {
    sortOption = {
      quantity: -1,
    };
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("seller", "name org email role loc")
      .sort(sortOption)
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
};

// ==========================================
// GET PRODUCT BY ID
// ==========================================

const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id).populate(
    "seller",
    "name org email role loc",
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    data: {
      product,
    },
  });
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own products");
  }

  const allowedFields = [
    "name",
    "category",
    "quantity",
    "unit",
    "pricePerUnit",
    "quality",
    "description",
    "location",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  }

  if (product.quantity <= 0) {
    product.status = "sold";
  } else {
    product.status = "available";
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: {
      product,
    },
  });
};

// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own products");
  }

  product.status = "inactive";

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product removed from marketplace",
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
