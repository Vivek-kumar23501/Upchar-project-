
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Users,
  Hospital,
  PlusCircle,
  Menu,
  X,
  Loader2,
} from "lucide-react";

// Sidebar navigation items
const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "userStats", label: "User Statistics", icon: Users },
  { id: "manageHospital", label: "Manage Hospital", icon: Hospital },
];

// Dummy stats data
const userStatsData = [
  { label: "Total Users", value: 1240 },
  { label: "Active Today", value: 312 },
  { label: "New This Week", value: 87 },
  { label: "Hospitals Registered", value: 15 },
];

// Hospital types
const hospitalTypes = [
  "Village Health Center",
  "PHC",
  "Block Level Hospital",
  "District Level Hospital",
  "Medical College Hospital",
];

// Backend base URL
const API_BASE_URL = "http://localhost:8080";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    hospitalName: "",
    registrationNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    hospitalType: "",
    address: {
      city: "",
      state: "",
    },
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hospitals list state
  const [hospitals, setHospitals] = useState([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [hospitalsError, setHospitalsError] = useState("");

  // Fetch hospitals jab Manage Hospital section open ho
  useEffect(() => {
    if (activeSection === "manageHospital") {
      fetchHospitals();
    }
  }, [activeSection]);

  const fetchHospitals = async () => {
    setIsLoadingHospitals(true);
    setHospitalsError("");

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/hospitals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHospitals(response.data.hospitals || []);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Hospitals fetch nahi ho paye.";

      setHospitalsError(message);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  // Handle normal fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    // Hospital type validation
    if (!formData.hospitalType) {
      setErrorMsg("Please select hospital type.");
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(
        "Password aur Confirm Password match nahi kar raha."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMsg(
        "Login session nahi mila. Dobara login karo."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${API_BASE_URL}/admin/add-hospital`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg(
        response.data.message ||
          "Hospital successfully add ho gaya!"
      );

      // Reset form
      setFormData({
        hospitalName: "",
        registrationNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        hospitalType: "",
        address: {
          city: "",
          state: "",
        },
      });

      // Naya hospital add hone ke baad list refresh karo
      fetchHospitals();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Kuch galat ho gaya, hospital add nahi ho paya.";

      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">
          <h1 className="text-xl font-bold">
            Admin Panel
          </h1>

          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-6 py-3 text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white flex items-center justify-between px-4 py-3 z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>

        <h1 className="font-semibold">
          Admin Panel
        </h1>

        <div />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 mt-14 md:mt-0">

        {/* Overview section */}
        {activeSection === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Dashboard Overview
            </h2>

            <p className="text-slate-500">
              Sidebar se User Statistics ya Manage Hospital
              section select karo.
            </p>
          </div>
        )}

        {/* User Statistics section */}
        {activeSection === "userStats" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              User Statistics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userStatsData.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl shadow p-5 border border-gray-200"
                >
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <p className="text-3xl font-bold text-slate-800 mt-2">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage Hospital section */}
        {activeSection === "manageHospital" && (
          <div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PlusCircle size={22} />
              Add Hospital
            </h2>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow p-6 border border-gray-200 max-w-2xl"
            >

              {/* Error message */}
              {errorMsg && (
                <p className="text-red-600 text-sm mb-4">
                  {errorMsg}
                </p>
              )}

              {/* Success message */}
              {successMsg && (
                <p className="text-green-600 text-sm mb-4">
                  {successMsg}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Hospital Name */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Hospital Name
                  </label>

                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Registration Number
                  </label>

                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* Hospital Type */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Hospital Type
                  </label>

                  <select
                    name="hospitalType"
                    value={formData.hospitalType}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  >
                    <option value="" disabled>
                      Select Hospital Type
                    </option>

                    {hospitalTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isSubmitting
                  ? "Adding..."
                  : "Add Hospital"}
              </button>

            </form>

            {/* Hospitals list */}
            <div className="mt-8">

              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Registered Hospitals
              </h3>

              <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">

                {/* Loading */}
                {isLoadingHospitals && (
                  <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    Loading hospitals...
                  </div>
                )}

                {/* Error */}
                {hospitalsError && (
                  <p className="text-red-600 text-sm p-4">
                    {hospitalsError}
                  </p>
                )}

                {/* Empty */}
                {!isLoadingHospitals &&
                  !hospitalsError &&
                  hospitals.length === 0 && (
                    <p className="text-slate-500 text-sm p-4">
                      Abhi tak koi hospital add nahi hua hai.
                    </p>
                  )}

                {/* Hospitals table */}
                {!isLoadingHospitals &&
                  !hospitalsError &&
                  hospitals.length > 0 && (
                    <table className="w-full text-sm">

                      <thead className="bg-slate-100 text-slate-600 text-left">
                        <tr>
                          <th className="px-4 py-3">
                            Hospital Name
                          </th>

                          <th className="px-4 py-3">
                            Registration No.
                          </th>

                          <th className="px-4 py-3">
                            Email
                          </th>

                          <th className="px-4 py-3">
                            Phone
                          </th>

                          <th className="px-4 py-3">
                            Type
                          </th>

                          <th className="px-4 py-3">
                            City
                          </th>

                          <th className="px-4 py-3">
                            State
                          </th>

                          <th className="px-4 py-3">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {hospitals.map((hospital) => (
                          <tr
                            key={hospital._id}
                            className="border-t border-gray-100"
                          >
                            <td className="px-4 py-3 text-slate-800">
                              {hospital.hospitalName}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {hospital.registrationNumber}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {hospital.email}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {hospital.phone}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {hospital.hospitalType}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {hospital.address?.city}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {hospital.address?.state}
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  hospital.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : hospital.status === "Blocked"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {hospital.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  )}

              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}