import React from 'react';
import { Link } from 'react-router-dom';

// Role-based login options — data array outside component
const loginRoles = [
  { label: 'Login as User', path: '/auth/login', icon: 'person', color: 'bg-[#04bf36] hover:bg-[#03a02d] shadow-[0_8px_20px_rgba(4,191,54,0.25)]' },
  { label: 'Login as Hospital', path: '/hospital/login', icon: 'local_hospital', color: 'bg-blue-600 hover:bg-blue-700 shadow-[0_8px_20px_rgba(37,99,235,0.25)]' },
  { label: 'Login as Doctor', path: '/doctor/login', icon: 'local_hospital', color: 'bg-blue-600 hover:bg-blue-700 shadow-[0_8px_20px_rgba(37,99,235,0.25)]' },
  { label: 'Login as Admin', path: '/auth/login', icon: 'admin_panel_settings', color: 'bg-slate-700 hover:bg-slate-800 shadow-[0_8px_20px_rgba(51,65,85,0.25)]' },
  { label: 'Login as ASHA', path: '/asha/login', icon: 'volunteer_activism', color: 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-[0_8px_20px_rgba(192,38,211,0.25)]' },
];

export default function AuthInitial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/50 to-emerald-100 relative overflow-hidden flex items-center justify-center font-sans">
      
      {/* Embedded CSS for Animations */}
      <style>
        {`
          @keyframes draw-ecg {
            0% { stroke-dashoffset: 1500; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -1500; }
          }
          .animate-ecg {
            stroke-dasharray: 1500;
            animation: draw-ecg 6s linear infinite;
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 5s ease-in-out infinite 2s;
          }
          .animate-float-slow {
            animation: float 6s ease-in-out infinite 1s;
          }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      {/* Background Heartbeat (ECG) Animation Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 flex items-center justify-center">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-64 md:h-full text-emerald-200" fill="none" stroke="currentColor" strokeWidth="3">
          <path className="animate-ecg" d="M0,100 L300,100 L320,60 L350,180 L380,20 L410,100 L1000,100" />
        </svg>
      </div>

      {/* Main Responsive Layout */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Text & Main Actions */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          
          {/* COMPACT Back to Home Button (Arrow Only, Top Left) */}
          <Link 
            to="/" 
            title="Back to Home"
            className="self-start lg:-ml-2 flex items-center justify-center w-10 h-10 text-slate-600 hover:text-emerald-700 transition-all duration-300 bg-white/80 hover:bg-white backdrop-blur-md rounded-full border border-teal-100 shadow-sm hover:shadow-md mb-1"
          >
            <span className="material-symbols-rounded text-[22px]">arrow_back</span>
          </Link>

          <div className="flex flex-col items-center lg:items-start space-y-3">
            
            {/* INLINE: Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center border border-teal-100 shadow-md shrink-0">
                <span className="material-symbols-rounded text-[#004d37] text-[32px] md:text-[36px]">health_metrics</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-widest drop-shadow-sm">
                UPCHAR
              </h1>
            </div>
            
            {/* Subtitle / Full Form */}
            <p className="text-emerald-700 text-[11px] md:text-sm font-bold tracking-wider uppercase max-w-md leading-relaxed mt-1">
              Unified Platform for Connected Healthcare Access & Referrals
            </p>
            <div className="h-1 w-20 bg-[#04bf36] rounded-full mt-2 hidden lg:block"></div>
          </div>

          <div className="mb-2 relative z-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 md:mb-6 leading-tight">
              Healthcare at <br className="hidden lg:block" /> your fingertips
            </h2>
            {/* Smaller description text for mobile */}
            <p className="text-slate-600 text-sm md:text-base max-w-md leading-relaxed">
              Experience the future of rural healthcare. AI diagnosis, live teleconsultation, and real-time pharmacy radar—all seamlessly integrated into one platform.
            </p>
          </div>

          {/* Role-based Login Options */}
          <div className="w-full sm:w-auto mt-2 relative z-50">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Login as
            </p>

            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              {loginRoles.map((role) => (

                <Link
                  key={role.path}
                  to={role.path}
                  className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-white font-bold text-sm hover:scale-105 transition-all duration-300 group ${role.color}`}
                >
                  <span className="material-symbols-rounded text-[18px]">{role.icon}</span>
                  {role.label}
                </Link>

              ))}
            </div>

            {/* Signup link for new users */}
            <p className="text-slate-500 text-sm mt-4">
              Naya account banana hai?{' '}
              <Link to="/auth/signup" className="text-[#04bf36] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column: Creative Bento Grid */}
        <div className="relative w-full max-w-[420px] mx-auto aspect-square flex items-center justify-center mt-12 lg:mt-0">
          
          <div className="absolute inset-0 bg-[#04bf36]/5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* 2x2 Grid Layout */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full relative z-10">
            
            {/* Card 1 */}
            <div className="animate-float group bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-xl hover:bg-white hover:border-blue-100 rounded-[1.5rem] p-4 flex flex-col justify-center transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-rounded text-white text-[20px]">psychology</span>
              </div>
              <h3 className="text-slate-800 font-bold text-base mb-1">AI Diagnosis</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-tight">Smart symptom analysis</p>
            </div>

            {/* Card 2 */}
            <div className="animate-float-delayed group bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-xl hover:bg-white hover:border-emerald-100 rounded-[1.5rem] p-4 flex flex-col justify-center transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-rounded text-white text-[20px]">medication</span>
              </div>
              <h3 className="text-slate-800 font-bold text-base mb-1">Pharmacy</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-tight">Find meds near you</p>
            </div>

            {/* Card 3 */}
            <div className="animate-float-slow group bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-xl hover:bg-white hover:border-purple-100 rounded-[1.5rem] p-4 flex flex-col justify-center transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-rounded text-white text-[20px]">video_camera_front</span>
              </div>
              <h3 className="text-slate-800 font-bold text-base mb-1">Live Video</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-tight">Instant teleconsultation</p>
            </div>

            {/* Card 4 */}
            <div className="animate-float group bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg hover:shadow-xl hover:bg-white hover:border-rose-100 rounded-[1.5rem] p-4 flex flex-col justify-center transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-rounded text-white text-[20px]">calendar_month</span>
              </div>
              <h3 className="text-slate-800 font-bold text-base mb-1">Visits</h3>
              <p className="text-slate-500 text-[11px] font-medium leading-tight">Book & manage visits</p>
            </div>

          </div>

          {/* Central Circular Element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            
            <div className="relative w-32 h-32 md:w-36 md:h-36 bg-white rounded-full border-[8px] border-[#effcf4] shadow-xl flex flex-col items-center justify-center group cursor-default">
              
              {/* Rotating SVG Text */}
              <div className="absolute inset-[-12px] animate-spin-slow opacity-90 transition-opacity duration-300">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                  <text fill="#047857" fontSize="7" fontWeight="bold" letterSpacing="1.5">
                    <textPath href="#circlePath" startOffset="0%">
                      UNIFIED PLATFORM FOR CONNECTED HEALTHCARE ACCESS & REFERRALS • 
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Center Logo Area */}
              <div className="bg-teal-50 p-2.5 rounded-2xl border border-teal-100 mb-1 z-10 shadow-inner">
                <span className="material-symbols-rounded text-[#004d37] text-[28px]">health_metrics</span>
              </div>
              <span className="text-slate-800 font-bold text-xs tracking-widest z-10 mt-1">UPCHAR</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}