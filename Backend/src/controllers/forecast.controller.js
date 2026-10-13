const { getForecast } = require("../services/forecast.service");

const ApiError = require("../utils/ApiError");

const forecast = async (req, res) => {
  const { productName, days = 30 } = req.query;

  if (!productName) {
    throw new ApiError(400, "productName is required");
  }

  const result = await getForecast(productName, Number(days));

  res.status(200).json({
    success: true,
    data: result,
  });
};

module.exports = {
  forecast,
};
