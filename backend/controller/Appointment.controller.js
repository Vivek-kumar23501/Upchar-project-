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
      confidence,
      riskScore,
      symptomScore,
      vectorScore,
      matchedSymptoms,
      reason,
      notes,
      preferredDate,
      preferredTime,
        hospitalId, 
    } = req.body;

    if (!fullName || !phone || !preferredDate || !hospitalId) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, preferred date, and hospital are required.",
      });
    }

    const appointment = await Appointment.create({
      userId: req.user.id,
       hospitalId,
      fullName,
      email,
      phone,
      age: age ? Number(age) : undefined,
      gender,
      address,
      disease,
      severity,
      confidence,
      riskScore: riskScore !== undefined && riskScore !== null ? Number(riskScore) : null,
      symptomScore:
        symptomScore !== undefined && symptomScore !== null ? Number(symptomScore) : null,
      vectorScore:
        vectorScore !== undefined && vectorScore !== null ? Number(vectorScore) : null,
      matchedSymptoms: Array.isArray(matchedSymptoms) ? matchedSymptoms : [],
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
export const getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

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

// ============================================================
// GET /appointments/queue
// ============================================================
// Hospital dashboard's queue view — returns appointments sorted with the
// HIGHEST risk score first, so the front desk / triage staff see the most
// urgent cases at the top. Falls back to severity + earliest preferred date
// when risk score is missing (older bookings, or info-type queries that
// never went through the prediction pipeline).
export const getQueueAppointments = async (req, res) => {
  try {
    const { status } = req.query;

    // Default view hides completed appointments — they don't belong in an
    // active queue. Pass ?status=completed explicitly to see those.
    const filter = status ? { status } : { status: { $ne: "completed" } };

    // Severity has no numeric order in the schema, so give it a rank here
    // purely for sorting. Null/unknown risk scores sort to the back.
    const severityRank = { high: 3, medium: 2, low: 1, unknown: 0, "": 0 };

    const appointments = await Appointment.find(filter)
      .populate("userId", "fullname email mobile")
      .lean();

    const sorted = appointments.sort((a, b) => {
      const aScore = typeof a.riskScore === "number" ? a.riskScore : -1;
      const bScore = typeof b.riskScore === "number" ? b.riskScore : -1;

      if (aScore !== bScore) return bScore - aScore; // highest risk first

      const aSev = severityRank[a.severity] ?? 0;
      const bSev = severityRank[b.severity] ?? 0;
      if (aSev !== bSev) return bSev - aSev;

      // Tie-break: earlier preferred date first
      return new Date(a.preferredDate) - new Date(b.preferredDate);
    });

    return res.json({ success: true, appointments: sorted });
  } catch (error) {
    console.error("getQueueAppointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load the queue.",
    });
  }
};

// ============================================================
// PATCH /appointments/:id/status
// ============================================================
// Lets the hospital dashboard move a patient through the queue
// (pending -> forward -> referred -> completed).
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "forward", "referred", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    return res.json({ success: true, appointment });
  } catch (error) {
    console.error("updateAppointmentStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update appointment status.",
    });
  }
};
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Auth.find({
      role: "hospital",
      status: "approved", // adjust field name if different
    }).select("hospitalName address phone hospitalType status");

    return res.json({ success: true, hospitals });
  } catch (error) {
    console.error("getAllHospitals error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load hospitals.",
    });
  }
};