import mongoose from "mongoose";

// .............................................KPI Schema.............................................
const kpiSchema = new mongoose.Schema(
  {
    kpiTitle: { type: String, required: true, trim: true },
    selfRating: { type: Number, min: 1, max: 5, default: null },
    managerRating: { type: Number, min: 1, max: 5, default: null },
    feedback: { type: String, default: "" },
  },
  { _id: false }
);

// .............................................KRA Schema.............................................
const kraSchema = new mongoose.Schema(
  {
    kraTitle: { type: String, required: true, trim: true },
    weightage: { type: Number, required: true, min: 0, max: 100 },
    kpis: { type: [kpiSchema], default: [] },
  },
  { _id: false }
);


// .............................................Appraisal Schema.............................................
const appraisalSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cycle: { type: String, default: "2026-Q1" },

    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed", "approved"],
      default: "draft",
    },

    items: { type: [kraSchema], default: [] },

    finalScoreEmployee: { type: Number, default: 0 },
    finalScoreManager: { type: Number, default: 0 },
  },
  { timestamps: true }
);



const Appraisal = mongoose.model("Appraisal", appraisalSchema);

export default Appraisal;