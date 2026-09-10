import Hospital from "../model/Hospital.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const addHospital = async (req, res) => {
  try {
    const {
      hospitalName,
      registrationNumber,
      email,
      password,
      confirmPassword,
      phone,
      hospitalType,
      address,
    } = req.body;

    if (
      !hospitalName ||
      !registrationNumber ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address?.city ||
      !address?.state
    ) {
      return res.status(400).json({ success: false, message: "Sabhi fields fill karna zaroori hai." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password aur Confirm Password match nahi kar raha." });
    }

    const existingHospital = await Hospital.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingHospital) {
      return res.status(409).json({
        success: false,
        message: "Is email ya registration number se hospital pehle se registered hai.",
      });
    }

    const hospital = await Hospital.create({
      hospitalName,
      registrationNumber,
      email,
      password,
      phone,
      hospitalType,
      address: { city: address.city, state: address.state },
      addedBy: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      message: "Hospital successfully add ho gaya.",
      hospital: {
        id: hospital._id,
        hospitalName: hospital.hospitalName,
        registrationNumber: hospital.registrationNumber,
        email: hospital.email,
        phone: hospital.phone,
        hospitalType: hospital.hospitalType,
        address: hospital.address,
        status: hospital.status,
      },
    });
  } catch (error) {
    console.error("Add Hospital Error:", error);
    return res.status(500).json({ success: false, message: "Server error, hospital add nahi ho paya." });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().select("-password");
    return res.status(200).json({ success: true, hospitals });
  } catch (error) {
    console.error("Get Hospitals Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email aur password dono zaroori hai." });
    }

    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(404).json({ success: false, message: "Is email se koi hospital registered nahi hai." });
    }

    const isPasswordValid = await bcrypt.compare(password, hospital.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Email ya password galat hai." });
    }

    const token = jwt.sign(
      { id: hospital._id, role: "hospital" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      hospital: {
        id: hospital._id,
        hospitalName: hospital.hospitalName,
        registrationNumber: hospital.registrationNumber,
        email: hospital.email,
        phone: hospital.phone,
        hospitalType: hospital.hospitalType,
        address: hospital.address,
        status: hospital.status,
      },
    });
  } catch (error) {
    console.error("Login Hospital Error:", error);
    return res.status(500).json({ success: false, message: "Server error, login nahi ho paya." });
  }
};