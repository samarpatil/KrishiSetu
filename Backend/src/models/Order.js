const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0.01, "Quantity must be greater than zero"],
    },

    unit: {
      type: String,
      enum: ["kg", "quintal", "ton", "piece"],
      required: [true, "Unit is required"],
    },

    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price cannot be negative"],
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "processing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    deliveryAddress: {
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },

      lat: {
        type: Number,
      },

      lng: {
        type: Number,
      },
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;