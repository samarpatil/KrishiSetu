const express = require("express");

const { forecast } = require("../controllers/forecast.controller");

const protect = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", protect, asyncHandler(forecast));

module.exports = router;
