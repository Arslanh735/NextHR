import "dotenv/config";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/database.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("Admin credentials are missing in .env");
    }

    await connectDB();

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
    });

    if (existingAdmin) {
      console.log("Admin account already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    await User.create({
      fullName: "System Administrator",
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Initial Admin created successfully!");

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();