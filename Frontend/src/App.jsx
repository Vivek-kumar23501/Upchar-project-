import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AuthInitial from './pages/AuthInitial';
import AuthLoginForm from './pages/AuthLoginForm';
import AuthSignupForm from './pages/AuthSignupForm';
import PatientDashboard from './pages/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyOTP from './pages/verifyOTP';
import DoctorDashboard from './pages/DoctorDashboard';
import Chatbot from './components/Chatbot';
import Teleconsultation from './pages/Teleconsultation';
import PatientLayout from './components/PatientLayout';
import DoctorsNearMe from './pages/DoctorsNearMe';
import AppointmentsDoctor from './pages/AppointmentsDoctor';
import HealthRecords from './components/HealthRecords';
import SearchResults from './pages/SearchResults';
import HospitalLogin from './pages/HospitalLogin';
import HospitalDashboard from './pages/HospitalDashboard';

import AdminDashboard from './pages/AdminDashboard';

import AshaLogin from './pages/AshaLogin';
import DoctorLogin from './pages/DoctorLogin';

// ASHA Dashboard
import AshaDashboard from './pages/AshaDashboard';
import DoctorConsulation from './pages/DoctorConsultation';

function App() {
  return (
    <Routes>

      {/* ================= LANDING ================= */}
      <Route path="/" element={<LandingPage />} />


      {/* ================= AUTH ================= */}
      <Route path="/auth" element={<AuthInitial />} />
      <Route path="/auth/login" element={<AuthLoginForm />} />
      <Route path="/auth/signup" element={<AuthSignupForm />} />
      <Route path="/auth/verify-otp" element={<VerifyOTP />} />


      {/* ================= LOGIN ================= */}
      <Route path="/hospital/login" element={<HospitalLogin />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/asha/login" element={<AshaLogin />} />


      {/* ================= PATIENT ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />

        <Route
          path="teleconsultation"
          element={<Teleconsultation />}
        />

        <Route
          path="doctors-near-me"
          element={<DoctorsNearMe />}
        />

        <Route
          path="health-records"
          element={<HealthRecords />}
        />

        <Route
          path="appointments"
          element={<AppointmentsDoctor />}
        />

        <Route
          path="search"
          element={<SearchResults />}
        />
      </Route>


      {/* ================= AI DIAGNOSIS ================= */}
      <Route
        path="/ai-diagnosis"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Chatbot />
          </ProtectedRoute>
        }
      />


      {/* ================= DOCTOR ================= */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

     <Route
          path="/doctor/consultation"
          element={<DoctorConsulation/>}
        />

      {/* ================= ASHA ================= */}
      <Route
        path="/asha/dashboard"
        element={
          <ProtectedRoute allowedRoles={['asha']}>
            <AshaDashboard />
          </ProtectedRoute>
        }
      />


      {/* ================= ADMIN ================= */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ================= HOSPITAL ================= */}
      <Route
        path="/hospital/dashboard"
        element={
          <ProtectedRoute allowedRoles={['hospital']}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;