const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/User");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing old development data...");

    await User.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});

    const passwordHash = await bcrypt.hash(
      "password123",
      12
    );

    const farmer = await User.create({
      name: "Demo Farmer",
      org: "Bhopal Farmers Group",
      role: "farmer",
      email: "farmer@krishisetu.com",
      passwordHash,
      loc: {
        lat: 23.2599,
        lng: 77.4126,
        address: "Bhopal, Madhya Pradesh",
      },
    });

    const buyer = await User.create({
      name: "Demo Buyer",
      org: "Bhopal Wholesale Market",
      role: "buyer",
      email: "buyer@krishisetu.com",
      passwordHash,
      loc: {
        lat: 23.2599,
        lng: 77.4126,
        address: "Bhopal, Madhya Pradesh",
      },
    });

    await User.create({
      name: "Demo Admin",
      org: "KrishiSetu",
      role: "admin",
      email: "admin@krishisetu.com",
      passwordHash,
      loc: {
        address: "Bhopal, Madhya Pradesh",
      },
    });

    await Product.create([
      {
        name: "Tomato",
        category: "Vegetable",
        quantity: 1000,
        unit: "kg",
        pricePerUnit: 28,
        quality: "A",
        description: "Fresh farm tomatoes",
        location: {
          address: "Bhopal, Madhya Pradesh",
          lat: 23.2599,
          lng: 77.4126,
        },
        seller: farmer._id,
      },
      {
        name: "Wheat",
        category: "Grain",
        quantity: 5000,
        unit: "kg",
        pricePerUnit: 25,
        quality: "A",
        description: "Fresh wheat directly from farm",
        location: {
          address: "Sehore, Madhya Pradesh",
          lat: 23.2,
          lng: 77.08,
        },
        seller: farmer._id,
      },
      {
        name: "Potato",
        category: "Vegetable",
        quantity: 2000,
        unit: "kg",
        pricePerUnit: 22,
        quality: "B",
        description: "Fresh potatoes",
        location: {
          address: "Bhopal, Madhya Pradesh",
          lat: 23.25,
          lng: 77.40,
        },
        seller: farmer._id,
      },
    ]);

    await Supplier.create({
      name: "Demo Farmer Producer Organization",
      organization: "Demo FPO",
      type: "fpo",
      owner: farmer._id,
      products: [
        {
          name: "Tomato",
          category: "Vegetable",
          quantity: 3000,
          unit: "kg",
          pricePerUnit: 27,
          quality: "A",
        },
        {
          name: "Wheat",
          category: "Grain",
          quantity: 10000,
          unit: "kg",
          pricePerUnit: 24,
          quality: "A",
        },
      ],
      location: {
        address: "Bhopal, Madhya Pradesh",
        lat: 23.2599,
        lng: 77.4126,
      },
      serviceRadius: 100,
      contactPhone: "9999999999",
      verified: true,
    });

    console.log("Seed data created successfully");

    console.log("\nDemo accounts:");
    console.log(
      "Farmer: farmer@krishisetu.com / password123"
    );
    console.log(
      "Buyer: buyer@krishisetu.com / password123"
    );
    console.log(
      "Admin: admin@krishisetu.com / password123"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Seed failed:",
      error.message
    );

    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seed();