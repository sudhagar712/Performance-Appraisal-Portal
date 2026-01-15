import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

app.use(express.json());
app.use(cookieParser());

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

