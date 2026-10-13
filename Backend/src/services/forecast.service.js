const DemandRecord = require("../models/DemandRecord");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getForecast = async (productName, days = 30) => {
  if (typeof productName !== "string" || !productName.trim()) {
    throw new Error("Product name is required");
  }

  days = Number(days);

  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error("Days must be an integer between 1 and 365");
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const records = await DemandRecord.find({
    productName: {
      $regex: `^${escapeRegex(productName.trim())}$`,
      $options: "i",
    },
    recordedAt: { $gte: startDate },
    status: { $ne: "cancelled" },
  }).sort({ recordedAt: 1 });

  if (records.length === 0) {
    return {
      productName: productName.trim(),
      days,
      recordCount: 0,
      totalDemand: 0,
      averageDemand: 0,
      estimatedNextDemand: 0,
      message: "No active historical demand records found",
    };
  }

  const totalDemand = records.reduce((sum, record) => sum + record.quantity, 0);

  const averageDemand = totalDemand / records.length;

  return {
    productName: productName.trim(),
    days,
    recordCount: records.length,
    totalDemand,
    averageDemand: Number(averageDemand.toFixed(2)),
    estimatedNextDemand: Math.round(averageDemand),
  };
};

module.exports = { getForecast };
