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

// Normalize URLs if Vercel rewrites append the file path
app.use((req, res, next) => {
    if (req.url.startsWith("/server.js")) {
        req.url = req.url.replace(/^\/server\.js/, "") || "/";
    }
    next();
});

// Ensure database is connected before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (err) {
        console.error("DB connection error:", err.message);
    }
    next();
});

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Travel Planner Backend is Running!"
    });
});

// Test API (supports both /api/test and /test)
app.get(["/api/test", "/test"], (req, res) => {
    res.json({
        success: true,
        message: "Backend API is Working!"
    });
});

// API Routes (supports both /api/<route> and /<route> for Vercel serverless rewrites)
app.use(["/api/auth", "/auth"], authRoutes);
app.use(["/api/trips", "/trips"], tripRoutes);
app.use(["/api/profile", "/profile"], profileRoutes);
app.use(["/api/admin", "/admin"], adminRoutes);
app.use(["/api/chatbot", "/chatbot"], chatbotRoutes);

// Catch-all 404 handler that always returns JSON (never returns HTML <!DOCTYPE...)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl || req.url}`
    });
});

// Global error handler that always returns JSON
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
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
