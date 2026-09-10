import Asha from "../model/Asha.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @route POST /asha/add
export const addAsha = async (req, res) => {
  try {
    const {
      ashaName,
      ashaId,
      phone,
      email,
      password,
      village,
      block,
      district,
      state,
      experience,
      qualification,
    } = req.body;

    const hospitalId =
      req.hospital?.id ||
      req.body?.hospitalId ||
      req.query?.hospitalId ||
      req.headers["hospital-id"];

    if (
      !ashaName ||
      !ashaId ||
      !phone ||
      !password ||
      !village ||
      !block ||
      !district ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "Sabhi zaroori fields fill karna hai.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimum 6 characters ka hona chahiye.",
      });
    }

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital ID required hai.",
      });
    }

    const existingAsha = await Asha.findOne({
      $or: [
        { ashaId },
        ...(email ? [{ email }] : []),
      ],
    });

    if (existingAsha) {
      return res.status(409).json({
        success: false,
        message:
          "Is ASHA ID ya email se worker pehle se registered hai.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const asha = await Asha.create({
      ashaName,
      ashaId,
      phone,
      email,
      password: hashedPassword,
      village,
      block,
      district,
      state,
      experience,
      qualification,
      hospital: hospitalId,
    });

    const ashaResponse = asha.toObject();

    delete ashaResponse.password;

    return res.status(201).json({
      success: true,
      message: "ASHA worker successfully add ho gaya.",
      asha: ashaResponse,
    });
  } catch (error) {
    console.error("Add ASHA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error, ASHA add nahi ho paya.",
    });
  }
};

// @route GET /asha/all
export const getAllAsha = async (req, res) => {
  try {
    const hospitalId =
      req.hospital?.id ||
      req.body?.hospitalId ||
      req.query?.hospitalId ||
      req.headers["hospital-id"];

    console.log("Get ASHA Hospital ID:", hospitalId);

    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Hospital ID required hai.",
      });
    }

    const ashaWorkers = await Asha.find({
      hospital: hospitalId,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      ashaWorkers,
    });
  } catch (error) {
    console.error("Get ASHA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// @route DELETE /asha/:id
export const deleteAsha = async (req, res) => {
  try {
    const { id } = req.params;

    const asha = await Asha.findByIdAndDelete(id);

    if (!asha) {
      return res.status(404).json({
        success: false,
        message: "ASHA worker nahi mila.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "ASHA worker remove ho gaya.",
    });
  } catch (error) {
    console.error("Delete ASHA Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};




export const loginAsha = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Check required fields
    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "ASHA ID/email aur password required hai.",
      });
    }

    const value = loginId.trim();

    // Find ASHA by ASHA ID or email
    const asha = await Asha.findOne({
      $or: [
        { ashaId: value },
        { email: value.toLowerCase() },
      ],
    });

    if (!asha) {
      return res.status(401).json({
        success: false,
        message: "Invalid ASHA ID/email or password.",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      asha.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid ASHA ID/email or password.",
      });
    }

    // Check ASHA status
    if (asha.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "ASHA account is not active.",
      });
    }

    // Generate JWT directly here
    const token = jwt.sign(
      {
        id: asha._id,
        role: "asha",
        hospitalId: asha.hospital,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Remove password from response
    const ashaResponse = asha.toObject();
    delete ashaResponse.password;

    return res.status(200).json({
      success: true,
      message: "ASHA login successful.",
      token,
      asha: ashaResponse,
    });
  } catch (error) {
    console.error("ASHA Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error, ASHA login nahi ho paya.",
    });
  }
};

