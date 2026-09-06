import dotenv from "dotenv"
dotenv.config()

import mongoose from "mongoose"
mongoose.connect(process.env.DB)

import express from "express"
import cors from "cors"
import { urlencoded } from "body-parser"
import { signup, verifyOTP, login, updateProfile } from './controller/Auth.controller.js';
import { saveChat, getMyChats, getMySessions, getAllSessionsByUser, getChatHistoryBySession } from "./controller/Chat.controller.js"
import { bookAppointment, getMyAppointments ,getAllAppointments} from "./controller/Appointment.controller.js"
import verifyToken from "./middleware/auth.middleware.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// 1. UPDATED CORS CONFIGURATION
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://127.0.0.1:5500",
      process.env.FRONTEND_URL // Allows your live Cloudflare Pages site to connect
    ],
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 2. ADDED HEALTH CHECK ROUTE (To keep Render awake)
app.get('/health', (req, res) => {
  res.status(200).send('API is awake and healthy');
});

app.post('/signup',signup)
app.post('/login',login)
app.post('/verify-otp',verifyOTP)
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
    user: req.user   // { id, fullname, email, mobile }
  });
});

app.post('/chat/save', verifyToken, saveChat)
app.get('/chat/history', verifyToken, getMyChats)
app.get('/chat/sessions', verifyToken, getMySessions)
app.get('/chat/all-sessions-by-user', verifyToken, getAllSessionsByUser)
app.get("/chat/history/:sessionId", verifyToken, getChatHistoryBySession);

// Appointment booking
app.post('/appointments/book', verifyToken, bookAppointment)
app.get('/appointments/mine', verifyToken, getMyAppointments)
app.get("/appointments/all", verifyToken, getAllAppointments);

// 3. UPDATED PORT LISTENER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})