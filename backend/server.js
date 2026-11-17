import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/triproutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder or process cwd
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ensure database is connected before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error("DB connection error:", err.message);
    }
    next();
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Smart Travel Planner Backend is Running!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend API is Working!"
    });
});

// Start server when not running in Vercel serverless environment
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error("Failed to connect to DB on startup:", err.message);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (without DB)`);
        });
    });
}

export default app;
