import Appraisal from "../models/Appraisal.js";
import User from "../models/User.js";
import { calcFinalScore } from "../utils/calcScore.js";
import { createNotification } from "../controllers/notificationControllers.js";

//............................. Create Draft .............................
export const createDraft = async (req, res) => {
  const emp = await User.findById(req.user._id);

  if (!emp.managerId)
    return res
      .status(400)
      .json({ success: false, message: "Manager not assigned for employee" });

  const appraisal = await Appraisal.create({
    employeeId: emp._id,
    managerId: emp.managerId,
    cycle: req.body.cycle || "2026-Q1",
    status: "draft",
    items: [],
  });

  res.status(201).json({ success: true, appraisal });
};

//............................. Save Draft .............................
export const saveDraft = async (req, res) => {
  let appraisal;
  try {
    appraisal = await Appraisal.findById(req.params.id);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ success: false, message: "Invalid appraisal ID" });
    throw err;
  }
  if (!appraisal)
    return res.status(404).json({ success: false, message: "Not found" });
  if (String(appraisal.employeeId) !== String(req.user._id))
    return res.status(403).json({ success: false, message: "Not authorized to update this appraisal" });

  const items = req.body.items;

  const total = items.reduce((s, i) => s + Number(i.weightage || 0), 0);
  if (total !== 100)
    return res
      .status(400)
      .json({ success: false, message: "Total weightage must be 100" });

  appraisal.items = items;
  appraisal.finalScoreEmployee = calcFinalScore(items, "self");
  await appraisal.save();

  res.json({ success: true, message: "Draft saved", appraisal });
};

//............................. Submit Self .............................
export const submitSelf = async (req, res) => {
  const appraisal = await Appraisal.findOne({
    _id: req.params.id,
    employeeId: req.user._id,
  });
  if (!appraisal)
    return res.status(404).json({ success: false, message: "Not found" });

  appraisal.status = "submitted";
  await appraisal.save();

  // Get employee name for notification
  const employee = await User.findById(req.user._id);
  const employeeName = employee?.name || "Employee";

  await createNotification({
    toUserId: appraisal.managerId,
    message: `${employeeName} submitted appraisal (${appraisal.cycle})`,
    type: "SUBMITTED",
  });

  res.json({ success: true, message: "Submitted", appraisal });
};

//............................. Employee list .............................
export const employeeList = async (req, res) => {
  const list = await Appraisal.find({
    employeeId: req.user._id,
  })
    .populate("managerId", "name email")
    .sort({ updatedAt: -1 });

  res.json({ success: true, appraisals: list });
};

//............................. Manager list .............................
export const managerList = async (req, res) => {
  const list = await Appraisal.find({
    managerId: req.user._id,
    status: { $ne: "draft" },
  })
    .populate("employeeId", "name email")
    .sort({ updatedAt: -1 });

  res.json({ success: true, submissions: list });
};

//............................. View By Id .............................
export const getById = async (req, res) => {
  const appraisal = await Appraisal.findById(req.params.id).populate(
    "employeeId",
    "name email"
  );
  if (!appraisal)
    return res.status(404).json({ success: false, message: "Not found" });

  res.json({ success: true, appraisal });
};

//............................. Manager Review .............................
export const managerReview = async (req, res) => {
  const appraisal = await Appraisal.findOne({
    _id: req.params.id,
    managerId: req.user._id,
  });
  if (!appraisal)
    return res.status(404).json({ success: false, message: "Not found" });

  const items = req.body.items;
  let mismatch = false;

  for (const item of items) {
    for (const kpi of item.kpis) {
      if (!kpi.managerRating)
        return res
          .status(400)
          .json({ success: false, message: "Manager rating required" });

      if (kpi.selfRating !== kpi.managerRating) {
        mismatch = true;
        if (!kpi.feedback?.trim())
          return res.status(400).json({
            success: false,
            message: "Feedback required if rating differs",
          });
      }
    }
  }

  appraisal.items = items;
  appraisal.finalScoreEmployee = calcFinalScore(items, "self");
  appraisal.finalScoreManager = calcFinalScore(items, "manager");
  appraisal.status = mismatch ? "reviewed" : "approved";
  await appraisal.save();

  // Get manager name for notification
  const manager = await User.findById(req.user._id);
  const managerName = manager?.name || "Manager";

  await createNotification({
    toUserId: appraisal.employeeId,
    message: `${managerName} completed appraisal (${appraisal.cycle})`,
    type: "REVIEWED",
  });

  res.json({ success: true, message: "Review submitted", appraisal });
};
