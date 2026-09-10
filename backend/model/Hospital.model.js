import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, match: [/^[0-9]{10}$/, "Phone number must be 10 digits"] },
    hospitalType: {
  type: String,
  enum: [
    "Village Health Center",
    "PHC",
    "Block Level Hospital",
    "District Level Hospital",
    "Medical College Hospital"
  ],
  required: true,
},
    address: {
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: ["Active", "Blocked", "Pending"],
      default: "Active",
    },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Async pre-save hook — next() ki zaroorat nahi hai
hospitalSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

hospitalSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Hospital", hospitalSchema);