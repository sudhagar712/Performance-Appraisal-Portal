import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js";
import appraisalRoutes from "./routes/appraisalRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// cors configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


app.get("/", (req,res)=> {
    res.send("backend is running ")
})

app.use("/api/auth", authRoutes);
app.use("/api/appraisals", appraisalRoutes);
app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT || 8000

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, ()=> {
            console.log(`Server is running on Port ${PORT}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

