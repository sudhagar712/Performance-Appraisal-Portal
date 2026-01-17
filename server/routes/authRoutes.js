import express from "express"
import { loginApi, meApi, registerApi, logoutApi, updateProfileApi } from "../controllers/authControllers.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
const router = express.Router()

router.post("/register", registerApi);
router.post("/login", loginApi);
router.post("/logout", logoutApi);
router.get("/me", protect, meApi);
router.put("/profile", protect, upload.single("profileImage"), updateProfileApi);



export default router