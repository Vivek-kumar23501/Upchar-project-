
import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  UserRound,
  Clock3,
  ArrowUpRight,
  MessageCircle,
  Pill,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const demoPatients = [
  {
    id: 1,
    name: "Sita Devi",
    age: 42,
    gender: "Female",
    village: "Rampur",
    risk: "High",
    condition: "Hypertension",
    phone: "9876543210",
    lastVisit: "08 Sep 2026",
  },
  {
    id: 2,
    name: "Ramesh Kumar",
    age: 55,
    gender: "Male",
    village: "Chanpatia",
    risk: "Medium",
    condition: "Diabetes",
    phone: "9876543211",
    lastVisit: "07 Sep 2026",
  },
  {
    id: 3,
    name: "Sunita Devi",
    age: 29,
    gender: "Female",
    village: "Bairiya",
    risk: "Low",
    condition: "General Checkup",
    phone: "9876543212",
    lastVisit: "06 Sep 2026",
  },
  {
    id: 4,
    name: "Mohan Paswan",
    age: 63,
    gender: "Male",
    village: "Lauriya",
    risk: "High",
    condition: "Chest Pain",
    phone: "9876543213",
    lastVisit: "05 Sep 2026",
  },
  {
    id: 5,
    name: "Kavita Kumari",
    age: 31,
    gender: "Female",
    village: "Majhaulia",
    risk: "Medium",
    condition: "Pregnancy Follow-up",
    phone: "9876543214",
    lastVisit: "04 Sep 2026",
  },
];

const demoVisits = [
  {
    id: 1,
    patient: "Sita Devi",
    village: "Rampur",
    time: "09:30 AM",
    purpose: "BP Follow-up",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Ramesh Kumar",
    village: "Chanpatia",
    time: "11:00 AM",
    purpose: "Diabetes Check",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Sunita Devi",
    village: "Bairiya",
    time: "02:30 PM",
    purpose: "General Checkup",
    status: "Completed",
  },
  {
    id: 4,
    patient: "Kavita Kumari",
    village: "Majhaulia",
    time: "04:00 PM",
    purpose: "Pregnancy Follow-up",
    status: "Pending",
  },
];

const demoReferrals = [
  {
    id: 1,
    patient: "Mohan Paswan",
    reason: "Chest Pain",
    facility: "District Hospital",
    priority: "Emergency",
    status: "Urgent",
  },
  {
    id: 2,
    patient: "Sita Devi",
    reason: "High BP",
    facility: "PHC Chanpatia",
    priority: "High",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Kavita Kumari",
    reason: "Pregnancy Follow-up",
    facility: "CHC Chanpatia",
    priority: "Medium",
    status: "Scheduled",
  },
];

export default function AshaDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [patientFilter, setPatientFilter] = useState("All");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const storedUser = useMemo(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }, []);

  const ashaName = storedUser?.ashaName || "ASHA Worker";
  const ashaId = storedUser?.ashaId || "ASHA001";
  const village = storedUser?.village || "Your Village";
  const block = storedUser?.block || "Your Block";
  const district = storedUser?.district || "Your District";

  const filteredPatients = demoPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.village.toLowerCase().includes(search.toLowerCase()) ||
      patient.condition.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      patientFilter === "All" || patient.risk === patientFilter;

    return matchesSearch && matchesFilter;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/asha/login");
  };

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
    },
    {
      id: "patients",
      label: "My Patients",
      icon: Users,
    },
    {
      id: "visits",
      label: "Assigned Visits",
      icon: CalendarDays,
    },
    {
      id: "risk",
      label: "Risk Cases",
      icon: AlertTriangle,
    },
    {
      id: "referrals",
      label: "Referrals",
      icon: ClipboardList,
    },
    {
      id: "records",
      label: "Health Records",
      icon: FileText,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: UserRound,
    },
  ];

  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (risk === "Medium") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Urgent") {
      return "bg-red-50 text-red-700";
    }

    if (status === "Scheduled") {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  const pageTitle = {
    overview: "Overview",
    patients: "My Patients",
    visits: "Assigned Visits",
    risk: "Risk Cases",
    referrals: "Referrals",
    records: "Health Records",
    profile: "My Profile",
  };

  const handleMenuClick = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    setShowProfile(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div className="h-20 px-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Activity size={24} />
            </div>

            <div>
              <h1 className="font-bold text-xl text-gray-900">Upachar</h1>
              <p className="text-xs text-gray-500">
                Rural health platform
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <X size={21} />
          </button>
        </div>

        {/* ASHA PROFILE */}
        <div className="px-5 py-5">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                <HeartPulse size={22} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {ashaName}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  ASHA ID: {ashaId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
              <MapPin size={14} />
              <span className="truncate">
                {village}, {block}
              </span>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.id === "risk" && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    2
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={23} />
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {pageTitle[activeSection]}
              </h2>

              <p className="hidden sm:block text-xs text-gray-500 mt-0.5">
                Welcome back, {ashaName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative">

            {/* NOTIFICATION */}
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600"
            >
              <Bell size={20} />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-16 top-14 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">
                    Notifications
                  </h3>

                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-xl">
                    <p className="text-sm font-medium text-red-800">
                      High-risk patient
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Mohan Paswan requires urgent referral.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl">
                    <p className="text-sm font-medium text-amber-800">
                      Follow-up reminder
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Sita Devi has a BP follow-up today.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE */}
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex items-center gap-3 pl-2"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <UserRound size={20} />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {ashaName}
                </p>
                <p className="text-xs text-gray-500">ASHA Worker</p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-14 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50">
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {ashaName}
                    </p>
                    <p className="text-xs text-gray-500">{ashaId}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveSection("profile");
                    setShowProfile(false);
                  }}
                  className="w-full text-left mt-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
                >
                  View Profile
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8">

          {/* ================= OVERVIEW ================= */}
          {activeSection === "overview" && (
            <div className="space-y-6">

              {/* WELCOME */}
              <div className="bg-emerald-700 rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                  <p className="text-emerald-100 text-sm mb-2">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-bold">
                    Good morning, {ashaName}
                  </h1>

                  <p className="text-emerald-100 mt-2 text-sm sm:text-base">
                    Here is your community health overview for today.
                  </p>
                </div>

                <div className="absolute -right-10 -bottom-16 w-48 h-48 rounded-full bg-white/10" />
                <div className="absolute right-20 -top-20 w-40 h-40 rounded-full bg-white/5" />
              </div>

              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                  icon={<Users size={22} />}
                  title="Total Patients"
                  value="128"
                  subtitle="+8 this month"
                  iconClass="bg-blue-50 text-blue-700"
                />

                <StatCard
                  icon={<CalendarDays size={22} />}
                  title="Today's Visits"
                  value="12"
                  subtitle="4 completed"
                  iconClass="bg-emerald-50 text-emerald-700"
                />

                <StatCard
                  icon={<AlertTriangle size={22} />}
                  title="High-Risk Cases"
                  value="2"
                  subtitle="Requires attention"
                  iconClass="bg-red-50 text-red-700"
                />

                <StatCard
                  icon={<ClipboardList size={22} />}
                  title="Pending Referrals"
                  value="5"
                  subtitle="2 urgent"
                  iconClass="bg-amber-50 text-amber-700"
                />
              </div>

              {/* MAIN GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* TODAY VISITS */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Today's Visits
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Your assigned community visits
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveSection("visits")}
                      className="text-sm text-emerald-700 font-semibold flex items-center gap-1"
                    >
                      View all
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {demoVisits.slice(0, 4).map((visit) => (
                      <div
                        key={visit.id}
                        className="p-5 flex items-center gap-4"
                      >
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Clock3 size={21} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {visit.patient}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {visit.purpose} • {visit.village}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {visit.time}
                          </p>

                          <span
                            className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${getStatusClass(
                              visit.status
                            )}`}
                          >
                            {visit.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HIGH RISK */}
                <div className="bg-white rounded-2xl border border-gray-200">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          High-Risk Cases
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Needs immediate attention
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                        <AlertTriangle size={19} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {demoPatients
                      .filter((p) => p.risk === "High")
                      .map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => setSelectedPatient(patient)}
                          className="w-full text-left p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 transition"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {patient.name}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {patient.condition}
                              </p>
                            </div>

                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                              High
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            <MapPin size={13} />
                            {patient.village}
                          </div>
                        </button>
                      ))}
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      onClick={() => setActiveSection("risk")}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      View all risk cases
                    </button>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  <QuickAction
                    icon={<Users size={22} />}
                    title="Find Patient"
                    subtitle="Search patient records"
                    onClick={() => setActiveSection("patients")}
                  />

                  <QuickAction
                    icon={<CalendarDays size={22} />}
                    title="Today's Visits"
                    subtitle="View assigned visits"
                    onClick={() => setActiveSection("visits")}
                  />

                  <QuickAction
                    icon={<ClipboardList size={22} />}
                    title="Create Referral"
                    subtitle="Refer a patient"
                    onClick={() => setActiveSection("referrals")}
                  />

                  <QuickAction
                    icon={<MessageCircle size={22} />}
                    title="Contact Doctor"
                    subtitle="Connect with doctor"
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= PATIENTS ================= */}
          {activeSection === "patients" && (
            <div className="space-y-5">

              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Community Patients
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage and monitor patients assigned to you.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search patient..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <select
                      value={patientFilter}
                      onChange={(e) => setPatientFilter(e.target.value)}
                      className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>All</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Patient
                        </th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Location
                        </th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Condition
                        </th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Risk
                        </th>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Last Visit
                        </th>
                        <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <UserRound size={18} />
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {patient.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {patient.age} yrs • {patient.gender}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} />
                              {patient.village}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {patient.condition}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-medium ${getRiskClass(
                                patient.risk
                              )}`}
                            >
                              {patient.risk}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {patient.lastVisit}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setSelectedPatient(patient)}
                              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredPatients.length === 0 && (
                  <div className="p-10 text-center text-gray-500">
                    No patients found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= VISITS ================= */}
          {activeSection === "visits" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900">
                  Assigned Visits
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Complete your community health visits and follow-ups.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                          <CalendarDays size={21} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {visit.patient}
                          </h3>

                          <p className="text-xs text-gray-500">
                            {visit.purpose}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs ${getStatusClass(
                          visit.status
                        )}`}
                      >
                        {visit.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold text-sm mt-1">
                          {visit.time}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">Village</p>
                        <p className="font-semibold text-sm mt-1">
                          {visit.village}
                        </p>
                      </div>
                    </div>

                    {visit.status !== "Completed" && (
                      <button className="w-full mt-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold">
                        Start Visit
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= RISK CASES ================= */}
          {activeSection === "risk" && (
            <div className="space-y-5">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-red-900">
                      High & Medium Risk Patients
                    </h3>

                    <p className="text-sm text-red-700 mt-1">
                      These patients may require additional monitoring,
                      doctor consultation or referral.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {demoPatients
                  .filter((patient) => patient.risk !== "Low")
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className="bg-white border border-gray-200 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                            <UserRound size={20} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {patient.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {patient.age} yrs • {patient.gender}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full border text-xs font-medium ${getRiskClass(
                            patient.risk
                          )}`}
                        >
                          {patient.risk} Risk
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div>
                          <p className="text-xs text-gray-500">Condition</p>
                          <p className="text-sm font-medium mt-1">
                            {patient.condition}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Village</p>
                          <p className="text-sm font-medium mt-1">
                            {patient.village}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-5">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50"
                        >
                          View Patient
                        </button>

                        <button
                          onClick={() => setActiveSection("referrals")}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800"
                        >
                          Refer Patient
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= REFERRALS ================= */}
          {activeSection === "referrals" && (
            <div className="space-y-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Patient Referrals
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Track referrals and specialist care.
                  </p>
                </div>

                <button className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold flex items-center justify-center gap-2">
                  <ClipboardList size={18} />
                  New Referral
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Patient
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Reason
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Facility
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Priority
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {demoReferrals.map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 font-semibold text-sm text-gray-900">
                            {referral.patient}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {referral.reason}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {referral.facility}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs ${
                                referral.priority === "Emergency"
                                  ? "bg-red-50 text-red-700"
                                  : referral.priority === "High"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {referral.priority}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs ${getStatusClass(
                                referral.status
                              )}`}
                            >
                              {referral.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= RECORDS ================= */}
          {activeSection === "records" && (
            <div className="space-y-5">

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileText size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Health Records
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Access patient health history, reports and follow-ups.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <RecordCard
                  icon={<FileText size={22} />}
                  title="Patient Records"
                  value="128"
                />

                <RecordCard
                  icon={<Stethoscope size={22} />}
                  title="Consultations"
                  value="86"
                />

                <RecordCard
                  icon={<Pill size={22} />}
                  title="Medicine Records"
                  value="64"
                />

                <RecordCard
                  icon={<RefreshCw size={22} />}
                  title="Follow-ups"
                  value="23"
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Recent Records
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Recently updated patient records
                    </p>
                  </div>

                  <button className="text-sm font-semibold text-emerald-700">
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {demoPatients.slice(0, 4).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center">
                        <FileText size={18} />
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {patient.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {patient.condition} • {patient.lastVisit}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="text-sm font-semibold text-emerald-700"
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PROFILE ================= */}
          {activeSection === "profile" && (
            <div className="max-w-4xl space-y-5">

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <HeartPulse size={36} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {ashaName}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Accredited Social Health Activist
                    </p>

                    <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-5">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ProfileItem
                    label="ASHA Name"
                    value={ashaName}
                  />

                  <ProfileItem
                    label="ASHA ID"
                    value={ashaId}
                  />

                  <ProfileItem
                    label="Village"
                    value={village}
                  />

                  <ProfileItem
                    label="Block"
                    value={block}
                  />

                  <ProfileItem
                    label="District"
                    value={district}
                  />

                  <ProfileItem
                    label="State"
                    value={storedUser?.state || "Bihar"}
                  />

                  <ProfileItem
                    label="Phone"
                    value={storedUser?.phone || "Not available"}
                  />

                  <ProfileItem
                    label="Email"
                    value={storedUser?.email || "Not available"}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-5">
                  Work Summary
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <MiniStat label="Patients" value="128" />
                  <MiniStat label="Visits" value="12" />
                  <MiniStat label="Referrals" value="18" />
                  <MiniStat label="Follow-ups" value="23" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PATIENT MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">
                  Patient Details
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Health information
                </p>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5">

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserRound size={25} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedPatient.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {selectedPatient.age} years •{" "}
                    {selectedPatient.gender}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Condition</p>
                  <p className="text-sm font-semibold mt-1">
                    {selectedPatient.condition}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <span
                    className={`inline-flex mt-1 px-2 py-1 rounded-full border text-xs font-medium ${getRiskClass(
                      selectedPatient.risk
                    )}`}
                  >
                    {selectedPatient.risk}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Village</p>
                  <p className="text-sm font-semibold mt-1">
                    {selectedPatient.village}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-gray-500">Last Visit</p>
                  <p className="text-sm font-semibold mt-1">
                    {selectedPatient.lastVisit}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <a
                  href={`tel:${selectedPatient.phone}`}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Phone size={17} />
                  Call
                </a>

                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setActiveSection("referrals");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white flex items-center justify-center gap-2 text-sm font-semibold hover:bg-emerald-800"
                >
                  Refer Patient
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  icon,
  title,
  value,
  subtitle,
  iconClass,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        {subtitle}
      </p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-emerald-200 hover:shadow-sm transition"
    >
      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
        {icon}
      </div>

      <h4 className="font-semibold text-gray-900 mt-4">
        {title}
      </h4>

      <p className="text-xs text-gray-500 mt-1">
        {subtitle}
      </p>
    </button>
  );
}

function RecordCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
        {icon}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {title}
      </p>

      <p className="text-2xl font-bold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

function ProfileItem({
  label,
  value,
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-900 mt-1 break-words">
        {value}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="text-center p-4 rounded-xl bg-gray-50">
      <p className="text-2xl font-bold text-emerald-700">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {label}
      </p>
    </div>
  );
}

