import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";

// path → readable label + optional icon name (material-symbols-rounded)
const ROUTE_META = {
    "/dashboard":                      { label: "Dashboard",       icon: "home" },
    "/ai-diagnosis":                   { label: "AI Diagnosis",    icon: "psychology" },
    "/dashboard/health-records":       { label: "Health Records",  icon: "medical_information" },
    "/dashboard/teleconsultation":     { label: "TeleConsultation",icon: "video_camera_front" },
    "/dashboard/doctors-near-me":      { label: "Doctors Near Me", icon: "pin_drop" },
    "/dashboard/appointments":         { label: "Appointments",    icon: "calendar_month" },
    "/emergency":                      { label: "Emergency",       icon: "emergency" },
    "/settings":                       { label: "Settings",        icon: "settings" },
};

function getRouteMeta(pathname) {
    return (
        ROUTE_META[pathname] || {
            label: pathname
                .replace(/.*\//, "")
                .replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) || "Dashboard",
            icon: "chevron_right",
        }
    );
}

export default function PatientLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { label, icon } = getRouteMeta(location.pathname);
    const isHome = location.pathname === "/dashboard";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login");
    };

    return (
        <div className="min-h-screen bg-[#fdf6f2]">
            <PatientSidebar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                setIsAiOpen={setIsAiOpen}
                handleLogout={handleLogout}
            />

            {/* ─────────────────────────────────────────
                Main content area
                · Desktop: ml-64 (sidebar width)
                · Mobile: pb-bottom-nav so content
                  never hides behind the bottom tab bar
            ───────────────────────────────────────── */}
            <main className="md:ml-64 min-h-screen pb-bottom-nav md:pb-0">

                {/* ── Mobile Top Bar ── */}
                <div className="md:hidden sticky top-0 z-30 glass border-b border-[#bec9c2]/20
                    flex items-center justify-between px-4 h-14 pt-safe">

                    {/* Breadcrumb / Page title */}
                    <div className="flex items-center gap-2">
                        {!isHome && (
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-8 h-8 rounded-full bg-[#f0ebe7] flex items-center justify-center mr-1"
                            >
                                <span className="material-symbols-rounded text-[18px] text-[#004d37]">arrow_back</span>
                            </button>
                        )}
                        <div className="flex items-center gap-1.5">
                            {isHome && (
                                <span className="material-symbols-rounded text-[22px] text-[#004d37]">health_metrics</span>
                            )}
                            <span className="font-display font-bold text-[15px] text-[#004d37]">
                                {isHome ? "UPCHAR" : label}
                            </span>
                        </div>
                    </div>

                    {/* Right side: notification + avatar */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-[#f0ebe7] flex items-center justify-center relative"
                        >
                            <span className="material-symbols-rounded text-[20px] text-[#3f4944]">notifications</span>
                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full ring-1 ring-white" />
                        </button>
                    </div>
                </div>

                {/* ── Desktop breadcrumb bar ── */}
                <div className="hidden md:flex items-center gap-2 px-8 pt-5 pb-1 text-sm">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1.5 text-[#3f4944] hover:text-[#004d37] font-medium no-underline"
                    >
                        <span className="material-symbols-rounded text-[16px]">home</span>
                        Dashboard
                    </Link>

                    {!isHome && (
                        <>
                            <span className="material-symbols-rounded text-[16px] text-[#bec9c2]">chevron_right</span>
                            <span className="flex items-center gap-1.5 text-[#004d37] font-bold">
                                <span className="material-symbols-rounded text-[16px]">{icon}</span>
                                {label}
                            </span>
                        </>
                    )}
                </div>

                <Outlet />
            </main>
        </div>
    );
}