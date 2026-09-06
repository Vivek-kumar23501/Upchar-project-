import User from "../model/Auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendOTP from "../utils/sendEmail.js";

// ========================= SIGNUP =========================
const signup = async (req, res) => {
    try {
        const {
            fullname,
            email,
            mobile,
            password,
            district,
            block,
            village,
            profilePic
        } = req.body;

        // Basic presence check for required location fields
        if (!district || !block || !village) {
            return res.status(400).json({
                success: false,
                message: "District, block, and village are required."
            });
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        // Check if email already exists
        const emailExist = await User.findOne({ email });

        if (emailExist) {

            // If user is already verified
            if (emailExist.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            // Update OTP + location for unverified user re-attempting signup
            emailExist.otp = otp;
            emailExist.otpExpiry = otpExpiry;
            emailExist.location = { district, block, village };
            emailExist.profilePic = profilePic || "";

            await emailExist.save();

            await sendOTP(email, otp);

            return res.status(200).json({
                success: true,
                message: "OTP resent successfully."
            });
        }

        // Check mobile
        const mobileExist = await User.findOne({ mobile });

        if (mobileExist) {
            return res.status(400).json({
                success: false,
                message: "Mobile number already in use"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Send OTP first
        await sendOTP(email, otp);

        // Save user
        await User.create({
            fullname,
            email,
            mobile,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false,
            location: {
                district,
                block,
                village
            },
            profilePic: profilePic || ""
        });

        res.status(201).json({
            success: true,
            message: "OTP sent to your email."
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ========================= VERIFY OTP =========================
const verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.otp !== Number(otp)) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ========================= LOGIN =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not registered"
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first."
      });
    }

    // Check password
    const isLogin = await bcrypt.compare(password, user.password);

    if (!isLogin) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // JWT payload
    const payload = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      location: user.location
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        location: user.location,
        profilePic: user.profilePic
      }
    });

  } catch (err) {
    console.error("Login Error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ========================= UPDATE PROFILE =========================
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullname, mobile, district, block, village, password, profilePic } = req.body;

        // 1. Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Verify Password before allowing updates
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password. Changes not saved." });
        }

        // 3. Update the user details
        user.fullname = fullname || user.fullname;
        user.mobile = mobile || user.mobile;
        
        if (district || block || village) {
            user.location = {
                district: district || user.location.district,
                block: block || user.location.block,
                village: village || user.location.village
            };
        }

        if (profilePic) {
            user.profilePic = profilePic;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                location: user.location,
                profilePic: user.profilePic
            }
        });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export { signup, verifyOTP, login, updateProfile };