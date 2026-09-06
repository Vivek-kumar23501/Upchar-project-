import Appointment from "../model/Appointment.model.js";
import "../model/Auth.model.js"; // registers the "auth" model with mongoose (needed for populate)

// POST /appointments/book
// Protected by verifyToken, so req.user = { id, fullname, email, mobile }
// is already available here — called when the user clicks
// "Confirm Appointment" on the frontend.
export const bookAppointment = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      address,
      disease,
      severity,
      reason,
      notes,
      preferredDate,
      preferredTime,
    } = req.body;

    // Basic validation — mirrors the frontend's required-field check.
    if (!fullName || !phone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, and preferred date are required.",
      });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
      fullName,
      email,
      phone,
      age: age ? Number(age) : undefined,
      gender,
      address,
      disease,
      severity,
      reason,
      notes,
      preferredDate,
      preferredTime,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error("bookAppointment error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: "Could not book appointment. Please try again.",
    });
  }
};

// GET /appointments/mine
// Optional: lets the frontend show "your upcoming appointments" later.
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id }).sort({
      preferredDate: 1,
    });

    return res.json({ success: true, appointments });
  } catch (error) {
    console.error("getMyAppointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load appointments.",
    });
  }
};

// GET /appointments/all
// Returns every appointment in the system (accessible to any logged-in user
// per current requirement — no admin/role check).
export const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Optional filter by status (pending/forward/referred/completed)
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(filter)
        .sort({ preferredDate: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "fullname email mobile"),
      Appointment.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      appointments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("getAllAppointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load appointments.",
    });
  }
};

