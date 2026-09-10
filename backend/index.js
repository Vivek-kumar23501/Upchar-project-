import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose.connect(process.env.DB)

import express from "express"
import cors from "cors"
import { urlencoded } from "body-parser"
import { signup, verifyOTP, login, updateProfile } from './controller/Auth.controller.js';
import { saveChat, getMyChats, getMySessions, getAllSessionsByUser, getChatHistoryBySession } from "./controller/Chat.controller.js"
import { bookAppointment, getMyAppointments, getAllAppointments } from "./controller/Appointment.controller.js"
import { addHospital, getAllHospitals,loginHospital } from "./controller/Hospital.controller.js"
import verifyToken from "./middleware/auth.middleware.js"
import isAdmin from "./middleware/Admin.middleware.js"
import { addDoctor, getAllDoctors, deleteDoctor,loginDoctor } from "./controller/Doctor.controller.js";
import { addAsha, getAllAsha, deleteAsha ,loginAsha} from "./controller/Asha.controller.js";




const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.post('/signup', signup)
app.post('/login', login)
app.post('/verify-otp', verifyOTP)
app.put('/update/:id', updateProfile);

// Example protected route
app.get('/dashboard-data', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected data",
    user: req.user
  });
})

app.get("/verify-token", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

app.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user   // { id, fullname, email, mobile, role }
  });
});

app.post('/chat/save', verifyToken, saveChat)
app.get('/chat/history', verifyToken, getMyChats)
app.get('/chat/sessions', verifyToken, getMySessions)
app.get('/chat/all-sessions-by-user', verifyToken, getAllSessionsByUser)
app.get("/chat/history/:sessionId", verifyToken, getChatHistoryBySession);

// Appointment booking — called when the user clicks "Confirm Appointment"
// on the frontend after the form auto-fills from localStorage.
app.post('/appointments/book', verifyToken, bookAppointment)
app.get('/appointments/mine', verifyToken, getMyAppointments)
app.get("/appointments/all", verifyToken, getAllAppointments);

// ---> Admin routes <---
app.post('/admin/add-hospital', verifyToken, isAdmin, addHospital)
app.get('/admin/hospitals', verifyToken, isAdmin, getAllHospitals)


app.post('/hospital/login', loginHospital)

app.post("/doctor/add",addDoctor);
app.get("/doctor/all", getAllDoctors);
app.delete("/doctor/:id", deleteDoctor);
app.post("/doctor/login", loginDoctor);

app.post("/asha/add", addAsha);
app.get("/asha/all", getAllAsha);
app.delete("/asha/:id", deleteAsha);
app.post("/asha/login", loginAsha);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})