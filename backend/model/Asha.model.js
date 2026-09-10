import mongoose from "mongoose";

const ashaSchema = new mongoose.Schema(
  {
    ashaName: {
      type: String,
      required: true,
      trim: true,
    },

    ashaId: {
      type: String,
      required: true,
      unique: true,
      trim: true, // government-issued ASHA worker ID
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    block: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      min: 0, // years of service
    },

    qualification: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
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

export default mongoose.model("Asha", ashaSchema);