import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/database.js";

import { setServers } from 'node:dns/promises';
// Force Node to use Google and Cloudflare public DNS servers
setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`NexHR Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();