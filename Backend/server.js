const app = require("./src/app");
const connectDB = require("./src/config/db");
const { PORT } = require("./src/config/env");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`KrishiSetu server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server: ", err.message);
    process.exit(1);
  }
};

startServer();
