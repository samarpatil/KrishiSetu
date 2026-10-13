const express = require("express");

const AuditLog = require("../models/AuditLog");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 20, 1),
      50
    );

    const [logs, total] =
      await Promise.all([
        AuditLog.find()
          .populate(
            "user",
            "name email role"
          )
          .sort({ createdAt: -1 })
          .skip(
            (pageNumber - 1) * limitNumber
          )
          .limit(limitNumber),

        AuditLog.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(
            total / limitNumber
          ),
        },
      },
    });
  })
);

module.exports = router;