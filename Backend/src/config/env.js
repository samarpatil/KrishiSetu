const dotenv = require("dotenv");
dotenv.config();

const requireEnvVariables = ["MONGO_URI", "JWT_SECRET"];

for (const variable of requireEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable:${variable}`);
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

