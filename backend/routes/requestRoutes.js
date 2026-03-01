import express from "express";
import TripRequest from "../models/TripRequest.js";
import Trip from "../models/Trip.js";
import authMiddleware from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= SEND JOIN REQUEST ================= */
/* Any logged-in user can send request */

router.post(
  "/send/:tripId",
  authMiddleware,
  roleMiddleware("user"),
  async (req, res) => {
    try {
      const { tripId } = req.params;

      // Check if trip exists
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          message: "Trip not found",
        });
      }

      // Prevent owner from sending request to own trip
      if (trip.userId.toString() === req.userId) {
        return res.status(400).json({
          success: false,
          message: "You cannot request your own trip",
        });
      }

      // Prevent duplicate request
      const existingRequest = await TripRequest.findOne({
        tripId,
        senderId: req.userId,
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: "Request already sent",
        });
      }

      const request = await TripRequest.create({
        tripId,
        senderId: req.userId,
      });

      res.json({
        success: true,
        message: "Request sent successfully",
        request,
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

/* ================= ACCEPT REQUEST ================= */
/* Only trip owner can accept */

router.put(
  "/accept/:requestId",
  authMiddleware,
  roleMiddleware("user"),
  async (req, res) => {
    try {
      const { requestId } = req.params;

      const request = await TripRequest.findById(requestId).populate("tripId");

      if (!request) {
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
      }

      // Only trip owner can accept
      if (request.tripId.userId.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: "Only trip owner can accept request",
        });
      }

      request.status = "accepted";
      await request.save();

      res.json({
        success: true,
        message: "Request accepted",
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

/* ================= GET INCOMING REQUESTS ================= */
router.get(
  "/incoming",
  authMiddleware,
  roleMiddleware("user"),
  async (req, res) => {
    try {
      const requests = await TripRequest.find()
        .populate({
          path: "tripId",
          match: { userId: req.userId },
        })
        .populate("senderId", "name email")
        .sort({ createdAt: -1 });

      const filteredRequests = requests.filter(r => r.tripId !== null);

      res.json({
        success: true,
        requests: filteredRequests,
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

/* ================= GET SENT REQUESTS ================= */
router.get(
  "/sent",
  authMiddleware,
  roleMiddleware("user"),
  async (req, res) => {
    try {
      const requests = await TripRequest.find({
        senderId: req.userId,
      })
        .populate("tripId")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        requests,
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