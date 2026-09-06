import { Schema, model } from "mongoose";

const AuthSchema = new Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [
            /^[6-9]\d{9}$/,
            "Please enter a valid 10-digit Indian mobile number"
        ]
    },

    password: {
        type: String,
        required: true
    },

profilePic: {
        type: String,
        default: ""
    },

    // User Role
    role: {
      type: String,
      enum: ["user", "hospital", "admin", "asha", "doctor"],
      default: "user",
      required: true
    },

    location: {
  district: { type: String, required: true, trim: true },
  block: { type: String, required: true, trim: true },
  village: { type: String, required: true, trim: true }
},

    otp: {
        type: Number
    },

    otpExpiry: {
        type: Date
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const User = model("auth", AuthSchema);

export default User;