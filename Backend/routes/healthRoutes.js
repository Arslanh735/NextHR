import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexHR API is running successfully!",
    application: "NexHR",
    version: "1.0.0",
    timestamp: new Date(),
  });
});

export default router;