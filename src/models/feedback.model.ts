import { Schema, model } from "mongoose";

const feedbackSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, required: true },
    employeeId: { type: String, required: true },
    periodFrom: { type: String, required: true  },
    periodTo: { type: String, required: true },
    metrics: {
      productivity: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
    },
    feedback: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

export default model("Feedback", feedbackSchema);
