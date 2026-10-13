const { findMatches } = require("../services/matching.service");

const ApiError = require("../utils/ApiError");

const getMatches = async (req, res) => {
  const { productName, category, quantity, quality, maxDistance } = req.query;

  if (!productName) {
    throw new ApiError(400, "Product name is required");
  }

  if (!quantity) {
    throw new ApiError(400, "Required quantity is required");
  }

  const requestedQuantity = Number(quantity);

  if (Number.isNaN(requestedQuantity) || requestedQuantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const buyerLocation = req.user.loc;

  const matches = await findMatches({
    productName,
    category,
    quantity: requestedQuantity,
    quality,
    buyerLocation,
    maxDistance: maxDistance !== undefined ? Number(maxDistance) : undefined,
  });

  res.status(200).json({
    success: true,
    count: matches.length,
    data: {
      matches,
    },
  });
};

module.exports = {
  getMatches,
};
