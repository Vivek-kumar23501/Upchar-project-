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

// ---> 1. ADD THIS IMPORT <---
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<AuthInitial />} />
      <Route path="/auth/login" element={<AuthLoginForm />} />
      <Route path="/auth/signup" element={<AuthSignupForm />} />
      <Route path="/auth/verify-otp" element={<VerifyOTP />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="teleconsultation" element={<Teleconsultation />} />
        <Route path="doctors-near-me" element={<DoctorsNearMe />} />
        <Route path="health-records" element={<HealthRecords />} />
        <Route path="appointments" element={<AppointmentsDoctor />} />
        
        {/* ---> 2. ADD THIS ROUTE <--- */}
        <Route path="search" element={<SearchResults />} />
      </Route>

      <Route
        path="/ai-diagnosis"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;