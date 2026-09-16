
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";

const API_BASE = "https://upchar-project.onrender.com";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/doctor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.doctor,
          role: "doctor",
        })
      );

      localStorage.setItem("role", "doctor");

      navigate("/doctor/dashboard");
    } catch (err) {
      console.error("Doctor Login Error:", err);
      setError("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden md:flex bg-emerald-700 text-white p-10 flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Activity size={25} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">Upachar</h1>
                  <p className="text-emerald-100 text-sm">
                    Rural health access platform
                  </p>
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                <Stethoscope size={34} />
              </div>

              <h2 className="text-3xl font-bold leading-tight mb-4">
                Welcome back,
                <br />
                Doctor
              </h2>

              <p className="text-emerald-100 leading-7 max-w-md">
                Access patient information, manage consultations, referrals
                and provide better healthcare through the Upachar platform.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-emerald-100">
              <ShieldCheck size={19} />
              <span>Secure healthcare professional access</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-7 sm:p-10 md:p-12">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Activity size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">Upachar</h1>
                <p className="text-xs text-gray-500">
                  Rural health access platform
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Stethoscope size={28} />
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                Doctor Login
              </h2>

              <p className="text-gray-500 mt-2">
                Sign in to access your doctor dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login as Doctor
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Are you an ASHA worker?
              </p>

              <Link
                to="/asha/login"
                className="inline-block mt-2 text-emerald-700 font-semibold hover:text-emerald-800"
              >
                Login as ASHA Worker
              </Link>
            </div>

            <div className="mt-5 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


