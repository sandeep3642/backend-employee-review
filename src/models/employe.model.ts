import { Schema, model } from "mongoose";
const ROLE = {
  MANAGER_ROLE: 1,
  EMPLOYEE_ROLE: 2,
};
const EmployeSchema = new Schema(
  {
    employeeName: { type: String, required: true, default: null },
    email: {
      type: String,
      required: true,
      default: null,
      index: true,
      unique: true,
    },
    role: {
      type: Number,
      enum: [ROLE.MANAGER_ROLE, ROLE.EMPLOYEE_ROLE],
      default: ROLE.EMPLOYEE_ROLE,
    },
    userType: {
      type: String,
      enum: ["manager", "employee"],
      default: "employee",
    },
    password: { type: String, required: false, default: null },
    employeeId: { type: String, required: true, default: null },
    joiningDate: { type: String, required: false, default: null },
  },

  { timestamps: true, versionKey: false }
);
export default model("employes", EmployeSchema);
