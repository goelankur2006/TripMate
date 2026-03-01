import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    // Who created the trip
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Destination (e.g., Shimla)
    destination: {
      type: String,
      required: true,
      trim: true,
    },

    // Travel date
    travelDate: {
      type: Date,
      required: true,
    },

    // Optional return date
    returnDate: {
      type: Date,
    },

    // Gender preference for companion (important for safety)
    genderPreference: {
      type: String,
      enum: ["any", "male", "female"],
      default: "any",
    },

    // Budget range
    budget: {
      type: Number,
    },

    // How many people can join
    seatsAvailable: {
      type: Number,
      default: 1,
    },

    // Trip status
    status: {
      type: String,
      enum: ["open", "matched", "completed", "cancelled"],
      default: "open",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Trip", tripSchema);