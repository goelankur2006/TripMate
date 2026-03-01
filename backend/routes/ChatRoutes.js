import express from "express";
import Message from "../models/Message.js";
import TripRequest from "../models/TripRequest.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

/* ================= SEND MESSAGE ================= */
router.post("/send/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { content } = req.body;

    // Check if user is accepted in this trip
    const isParticipant = await TripRequest.findOne({
      tripId,
      senderId: req.userId,
      status: "accepted",
    });

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to chat in this trip",
      });
    }

    const message = await Message.create({
      tripId,
      senderId: req.userId,
      content,
    });

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

/* ================= GET MESSAGES ================= */
router.get("/:tripId", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;

    const messages = await Message.find({ tripId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;