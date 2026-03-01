import dotenv from "dotenv";
import express from 'express';
import connectDB from './config/mongodb.js';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import tripRoutes from "./routes/tripRoutes.js"
import requestRoutes from "./routes/requestRoutes.js";
import ChatRoutes from "./routes/ChatRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB FIRST
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", ChatRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});