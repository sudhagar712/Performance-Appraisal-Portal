import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationControllers.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.post("/:id/read", protect, markAsRead);

export default router;
