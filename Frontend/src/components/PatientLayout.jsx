import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";

// path → readable label + optional icon name (material-symbols-rounded)
const ROUTE_META = {
    "/dashboard": { label: "Dashboard", icon: "dashboard" },
    "/ai-diagnosis": { label: "AI Diagnosis", icon: "psychology" },
    "/assessments": { label: "Assessments", icon: "analytics" },
    "/health-records": { label: "Health Records", icon: "medical_information" },
    "/teleconsultation": { label: "TeleConsultation", icon: "medical_information" },
    "/emergency": { label: "Emergency", icon: "emergency" },
    "/settings": { label: "Settings", icon: "settings" },
};

function getRouteMeta(pathname) {
    return (
        ROUTE_META[pathname] || {
            label: pathname
                .replace("/", "")
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

    const handleLogout = () => {
        localStorage.removeItem("token");
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

            {/* Mobile: sidebar kholne ka hamburger button */}
            <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center"
            >
                <span className="material-symbols-rounded text-[22px] text-[#004d37]">
                    menu
                </span>
            </button>

            {/* Content area — desktop pe sidebar (w-64) ke liye left margin */}
            <main className="md:ml-64 min-h-screen">
                {/* Route indicator / breadcrumb bar */}
                <div className="flex items-center gap-2 px-6 md:px-8 pt-5 pb-1 text-sm">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1.5 text-[#3f4944] hover:text-[#004d37] font-medium no-underline"
                    >
                        <span className="material-symbols-rounded text-[16px]">
                            home
                        </span>
                        Dashboard
                    </Link>

                    {location.pathname !== "/dashboard" && (
                        <>
                            <span className="material-symbols-rounded text-[16px] text-[#bec9c2]">
                                chevron_right
                            </span>
                            <span className="flex items-center gap-1.5 text-[#004d37] font-bold">
                                <span className="material-symbols-rounded text-[16px]">
                                    {icon}
                                </span>
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