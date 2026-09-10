import Doctor from "../model/Doctor.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @route POST /doctor/add
export const addDoctor = async (req, res) => {
  try {
    const {
      doctorName,
      qualification,
      specialization,
      registrationNumber,
      experience,
      email,
      password,
      phone,
      department,
      consultationFee,
      availableDays,
      availableTime,
    } = req.body;

    const hospitalId =
      req.hospital?.id ||
      req.body?.hospitalId ||
      req.query?.hospitalId ||
      req.headers["hospital-id"];

    if (
      !doctorName ||
      !qualification ||
      !specialization ||
      !registrationNumber ||
      experience === undefined ||
      !email ||
      !password ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Sabhi zaroori fields fill karna hai.",
      });
    }

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital ID required hai.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimum 6 characters ka hona chahiye.",
      });
    }

    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message:
          "Is email ya registration number se doctor pehle se registered hai.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      doctorName,
      qualification,
      specialization,
      registrationNumber,
      experience,
      email,
      password: hashedPassword,
      phone,
      department,
      consultationFee,
      availableDays,
      availableTime,
      hospital: hospitalId,
    });

    const doctorResponse = doctor.toObject();

    delete doctorResponse.password;

    return res.status(201).json({
      success: true,
      message: "Doctor successfully add ho gaya.",
      doctor: doctorResponse,
    });
  } catch (error) {
    console.error("Add Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error, doctor add nahi ho paya.",
    });
  }
};

// @route GET /doctor/all
export const getAllDoctors = async (req, res) => {
  try {
    const hospitalId =
      req.hospital?.id ||
      req.body?.hospitalId ||
      req.query?.hospitalId ||
      req.headers["hospital-id"];

    console.log("Get Doctors Hospital ID:", hospitalId);

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital ID required hai.",
      });
    }

    const doctors = await Doctor.find({
      hospital: hospitalId,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// @route DELETE /doctor/:id
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByIdAndDelete(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor nahi mila.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor remove ho gaya.",
    });
  } catch (error) {
    console.error("Delete Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};





export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email aur password required hai.",
      });
    }

    // Find doctor by email
    const doctor = await Doctor.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      doctor.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check doctor status
    if (doctor.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Doctor account is not active.",
      });
    }

    // Generate JWT directly here
    const token = jwt.sign(
      {
        id: doctor._id,
        role: "doctor",
        hospitalId: doctor.hospital,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Remove password from response
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;

    return res.status(200).json({
      success: true,
      message: "Doctor login successful.",
      token,
      doctor: doctorResponse,
    });
  } catch (error) {
    console.error("Doctor Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error, doctor login nahi ho paya.",
    });
  }
};
