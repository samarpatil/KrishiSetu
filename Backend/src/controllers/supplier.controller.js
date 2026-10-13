const Supplier = require("../models/Supplier");
const ApiError = require("../utils/ApiError");

const createSupplier = async (req, res) => {
  const {
    name,
    organization,
    type,
    products,
    location,
    serviceRadius,
    contactPhone,
  } = req.body;

  if (!name) {
    throw new ApiError(400, "Supplier name is required");
  }

  const existingSupplier = await Supplier.findOne({
    owner: req.user._id,
  });

  if (existingSupplier) {
    throw new ApiError(
      409,
      "You already have a supplier profile"
    );
  }

  const supplier = await Supplier.create({
    name,
    organization,
    type,
    owner: req.user._id,
    products,
    location,
    serviceRadius,
    contactPhone,
  });

  res.status(201).json({
    success: true,
    message: "Supplier profile created successfully",
    data: {
      supplier,
    },
  });
};

const getAllSuppliers = async (req, res) => {
  const suppliers = await Supplier.find({
    status: "active",
  })
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: suppliers.length,
    data: {
      suppliers,
    },
  });
};

const getSupplierById = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id).populate(
    "owner",
    "name email role"
  );

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  res.status(200).json({
    success: true,
    data: {
      supplier,
    },
  });
};

const getMySupplierProfile = async (req, res) => {
  const supplier = await Supplier.findOne({
    owner: req.user._id,
  });

  if (!supplier) {
    throw new ApiError(
      404,
      "Supplier profile not found"
    );
  }

  res.status(200).json({
    success: true,
    data: {
      supplier,
    },
  });
};

const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  if (
    supplier.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(
      403,
      "You can only update your own supplier profile"
    );
  }

  const allowedFields = [
    "name",
    "organization",
    "type",
    "products",
    "location",
    "serviceRadius",
    "contactPhone",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      supplier[field] = req.body[field];
    }
  });

  await supplier.save();

  res.status(200).json({
    success: true,
    message: "Supplier profile updated successfully",
    data: {
      supplier,
    },
  });
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  getMySupplierProfile,
  updateSupplier,
};