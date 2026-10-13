const express = require("express");

const { getMatches } = require("../controllers/match.controller");

const protect = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", protect, asyncHandler(getMatches));

module.exports = router;
