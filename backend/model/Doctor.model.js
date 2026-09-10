import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true, // e.g. "MBBS, MD (Cardiology)"
    },
    specialization: {
      type: String,
      required: true,
      trim: true, // e.g. "Cardiologist", "General Physician"
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Medical Council registration number
    },
    experience: {
      type: Number,
      required: true,
      min: 0, // years of experience
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
  type: String,
  required: true,
  minlength: 6,
  trim: true,
},
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    consultationFee: {
      type: Number,
      min: 0,
    },
    availableDays: {
      type: [String], // e.g. ["Monday", "Wednesday", "Friday"]
      default: [],
    },
    availableTime: {
      type: String, // e.g. "10:00 AM - 4:00 PM"
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on-leave"],
      default: "active",
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);