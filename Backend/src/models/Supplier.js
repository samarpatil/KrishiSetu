const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },

    organization: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: ["fpo", "farmer_group", "wholesaler"],
      default: "fpo",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Supplier owner is required"],
    },

    products: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        category: {
          type: String,
          required: true,
          trim: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 0,
        },

        unit: {
          type: String,
          enum: ["kg", "quintal", "ton", "piece"],
          required: true,
        },

        pricePerUnit: {
          type: Number,
          required: true,
          min: 0,
        },

        quality: {
          type: String,
          enum: ["A", "B", "C"],
          default: "A",
        },
      },
    ],

    location: {
      address: {
        type: String,
        trim: true,
      },

      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },

    serviceRadius: {
      type: Number,
      default: 100,
      min: 0,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;