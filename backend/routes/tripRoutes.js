import express from "express";
import Trip from "../models/Trip.js";
import authMiddleware from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= CREATE TRIP ================= */
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("user"),
  async (req, res) => {
    try {
      const {
        destination,
        travelDate,
        returnDate,
        genderPreference,
        budget,
        seatsAvailable,
      } = req.body;

      const trip = await Trip.create({
        userId: req.userId,
        destination,
        travelDate,
        returnDate,
        genderPreference,
        budget,
        seatsAvailable,
      });

      res.json({
        success: true,
        message: "Trip created successfully",
        trip,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

/* ================= GET ALL OPEN TRIPS ================= */
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ status: "open" })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
/* ================= GET MY TRIPS ================= */
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("user"),
  async (req, res) => {
    try {
      const trips = await Trip.find({ userId: req.userId })
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        trips,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

export default router;