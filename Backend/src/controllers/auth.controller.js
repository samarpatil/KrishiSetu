const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

const register = async (req, res) => {
  const { name, org, role, email, password, loc } = req.body;

  if (!name || !role || !email || !password) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    org,
    role,
    email,
    passwordHash,
    loc,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        org: user.org,
        role: user.role,
        email: user.email,
        loc: user.loc,
      },
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        org: user.org,
        role: user.role,
        email: user.email,
        loc: user.loc,
      },
      token,
    },
  });
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

const farmerTest = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Farmer access granted",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
};

module.exports = {
  register,
  login,
  getMe,
  farmerTest
};
