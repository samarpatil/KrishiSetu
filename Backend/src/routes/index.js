const express = require("express");

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const supplierRoutes = require("./supplier.routes");
const notificationRoutes = require("./notification.routes");
const forecastRoutes = require("./forecast.routes");
const matchRoutes = require("./match.routes");
const dashboardRoutes = require("./dashboard.routes");
const adminRoutes = require("./admin.routes");
const auditRoutes = require("./audit.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/notifications", notificationRoutes);
router.use("/forecast", forecastRoutes);
router.use("/matches", matchRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);
router.use("/audit-logs", auditRoutes);

module.exports = router;
