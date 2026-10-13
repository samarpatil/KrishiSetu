const Supplier = require("../models/Supplier");

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (
    lat1 === undefined ||
    lng1 === undefined ||
    lat2 === undefined ||
    lng2 === undefined
  ) {
    return null;
  }

  const toRadians = (degree) => (degree * Math.PI) / 180;

  const earthRadius = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const getQualityScore = (required, available) => {
  if (!required) return 1;

  const qualityRank = {
    A: 3,
    B: 2,
    C: 1,
  };

  return qualityRank[available] >= qualityRank[required] ? 1 : 0;
};

const findMatches = async ({
  productName,
  category,
  quantity,
  quality,
  buyerLocation,
  maxDistance,
}) => {
  const suppliers = await Supplier.find({
    status: "active",
  }).populate("owner", "name email role");

  const matches = [];

  for (const supplier of suppliers) {
    for (const product of supplier.products) {
      const productMatches =
        product.name.toLowerCase() === productName.toLowerCase();

      if (!productMatches) {
        continue;
      }

      if (
        category &&
        product.category.toLowerCase() !== category.toLowerCase()
      ) {
        continue;
      }

      if (product.quantity < quantity) {
        continue;
      }

      const qualityScore = getQualityScore(
        quality,
        product.quality
      );

      if (quality && qualityScore === 0) {
        continue;
      }

      const distance = calculateDistance(
        buyerLocation?.lat,
        buyerLocation?.lng,
        supplier.location?.lat,
        supplier.location?.lng
      );

      if (
        maxDistance !== undefined &&
        distance !== null &&
        distance > maxDistance
      ) {
        continue;
      }

      // Lower price gets a better score.
      const priceScore =
        1 / (1 + product.pricePerUnit);

      // Closer suppliers get a better score.
      let distanceScore = 0.5;

      if (distance !== null) {
        distanceScore = 1 / (1 + distance);
      }

      const finalScore =
        qualityScore * 0.25 +
        priceScore * 0.35 +
        distanceScore * 0.40;

      matches.push({
        supplier: {
          id: supplier._id,
          name: supplier.name,
          organization: supplier.organization,
          type: supplier.type,
          owner: supplier.owner,
          location: supplier.location,
          verified: supplier.verified,
        },

        product: {
          name: product.name,
          category: product.category,
          quantityAvailable: product.quantity,
          unit: product.unit,
          pricePerUnit: product.pricePerUnit,
          quality: product.quality,
        },

        distanceKm:
          distance !== null
            ? Number(distance.toFixed(2))
            : null,

        score: Number(finalScore.toFixed(4)),
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  return matches;
};

module.exports = {
  calculateDistance,
  findMatches,
};