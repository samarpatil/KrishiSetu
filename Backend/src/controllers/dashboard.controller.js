const {
  getFarmerDashboard,
  getBuyerDashboard,
  getAdminDashboard,
} = require("../services/dashboard.service");

const ApiError = require("../utils/ApiError");

// Farmer dashboard
const farmerDashboard = async (req, res) => {
  if (req.user.role !== "farmer") {
    throw new ApiError(403, "Farmer access required");
  }

  const data = await getFarmerDashboard(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
};

// Buyer dashboard
const buyerDashboard = async (req, res) => {
  if (req.user.role !== "buyer") {
    throw new ApiError(403, "Consumer access required");
  }

  const data = await getBuyerDashboard(req.user._id);

  res.status(200).json({
    success: true,
    data,
  });
};

// Admin dashboard
const adminDashboard = async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }

  const data = await getAdminDashboard();

  res.status(200).json({
    success: true,
    data,
  });
};

module.exports = {
  farmerDashboard,
  buyerDashboard,
  adminDashboard,
};
