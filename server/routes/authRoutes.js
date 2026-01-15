import express from "express"
import { loginApi, meApi, registerApi, logoutApi } from "../controllers/authControllers.js";
import { protect } from "../middlewares/auth.js";
const router = express.Router()

router.post("/register", registerApi);
router.post("/login", loginApi);
router.post("/logout", logoutApi);
router.get("/me", protect, meApi);



export default router