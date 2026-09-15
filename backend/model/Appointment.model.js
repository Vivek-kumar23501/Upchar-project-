import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    age: {
      type: Number,
    },
    hospitalId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "auth",
  required: [true, "Please select a hospital"],
},
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    address: {
      type: String,
      trim: true,
    },
    disease: {
      type: String,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "unknown", ""],
      default: "unknown",
    },
    confidence: {
      type: String,
      enum: ["high", "medium", "low", ""],
      default: "",
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    symptomScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    vectorScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    matchedSymptoms: {
      type: [String],
      default: [],
    },
    reason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    preferredDate: {
      type: String,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "forward", "referred", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

AppointmentSchema.index({ userId: 1, preferredDate: 1 });

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;