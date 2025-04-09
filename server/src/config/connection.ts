import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/techquiz";

console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default mongoose.connection;
