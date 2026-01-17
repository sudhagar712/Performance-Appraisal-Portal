import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.js";
import {
  createDraft,
  saveDraft,
  submitSelf,
  employeeList,
  managerList,
  getById,
  managerReview,
} from "../controllers/appraisalControllers.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("employee"), createDraft);
router.put("/:id", protect, authorizeRoles("employee"), saveDraft);
router.post("/:id/submit", protect, authorizeRoles("employee"), submitSelf);
router.get("/employee", protect, authorizeRoles("employee"), employeeList);

router.get("/", protect, authorizeRoles("manager"), managerList);
router.get("/:id", protect, getById);
router.post("/:id/review", protect, authorizeRoles("manager"), managerReview);

export default router;
