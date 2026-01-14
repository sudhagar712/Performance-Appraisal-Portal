import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// testing sample 
app.get("/", (req, res) => {
  res.send("hello backend is working ");
});


// port 
const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`server is connected on Port ${PORT}`);
});
