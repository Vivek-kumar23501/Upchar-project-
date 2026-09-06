import React from "react";
import { NavLink } from "react-router-dom";

export default function PatientSidebar({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsAiOpen,
    handleLogout
}) {

    // Close sidebar on mobile after navigation
    const handleMobileClose = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <nav
                className={`
                    fixed md:flex flex-col
                    h-[100dvh] w-64
                    left-0 top-0
                    bg-[#fbf2ed]
                    border-r border-[#bec9c2]/30
                    z-50
                    py-6 px-4
                    shadow-[4px_0_24px_rgba(0,0,0,0.02)]
                    transition-transform duration-300
                    ${isMobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }
                `}
            >

                {/* Logo (Pinned to top) */}
                <NavLink
                    to="/dashboard"
                    onClick={handleMobileClose}
                    className="shrink-0 mb-8 mt-2 flex items-center gap-2 px-2 cursor-pointer group no-underline text-[#004d37] transition-transform hover:scale-105"
                >

                    <span className="material-symbols-rounded text-[32px] font-bold">
                        health_metrics
                    </span>


                    <span className="font-serif font-bold text-2xl tracking-widest uppercase mt-0.5">
                        UPCHAR
                    </span>
                </NavLink>


                {/* Navigation (Scrollable Middle Section) */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 pb-4 scrollbar-hide">

                    {/* Dashboard */}
                    <NavLink
                        to="/dashboard"
                        end
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-left no-underline
                            ${isActive
                                ? "text-[#004d37] font-bold bg-[#00674b]/10 border-l-4 border-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                            dashboard
                        </span>
                        Dashboard
                    </NavLink>

                    {/* AI Diagnosis */}
                    <NavLink
                        to="/ai-diagnosis"
                        onClick={() => {
                            setIsAiOpen?.(true);
                            setIsMobileMenuOpen(false);
                        }}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-left no-underline
                            ${isActive
                                ? "text-[#004d37] font-bold bg-[#00674b]/10 border-l-4 border-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                            psychology
                        </span>
                        AI Diagnosis
                    </NavLink>


                    {/* Health Records */}
                    <NavLink
                        to="/dashboard/health-records"
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-left no-underline
                            ${isActive
                                ? "text-[#004d37] font-bold bg-[#00674b]/10 border-l-4 border-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                            medical_information
                        </span>
                        Health Records
                    </NavLink>

                    {/* TeleConsultation */}
                    <NavLink
                        to="/dashboard/teleconsultation"
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-left no-underline
                            ${isActive
                                ? "text-[#004d37] font-bold bg-[#00674b]/10 border-l-4 border-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                            video_camera_front
                        </span>
                        TeleConsultation
                    </NavLink>

                    {/* Doctors Near Me */}
                    <NavLink
                        to="/dashboard/doctors-near-me"
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-left no-underline
                            ${isActive
                                ? "text-[#004d37] font-bold bg-[#00674b]/10 border-l-4 border-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                            pin_drop
                        </span>
                        Doctors Near Me
                    </NavLink>

                    {/* Appointments */}
                    <NavLink
                        to="/dashboard/appointments"
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all text-left no-underline
                            ${isActive
                                ? "text-[#004d37] font-bold bg-[#00674b]/10 border-l-4 border-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                            calendar_month
                        </span>
                        Appointments
                    </NavLink>

                </div>

                {/* Bottom Section (Pinned to bottom) */}
                <div className="shrink-0 mt-2 space-y-3 pt-4 border-t border-[#bec9c2]/30">

                    {/* Emergency */}
                    <NavLink
                        to="/emergency"
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center justify-center gap-2
                            py-3 px-4 rounded-xl
                            transition-colors shadow-sm
                            text-sm md:text-base no-underline
                            ${isActive
                                ? "bg-[#ba1a1a] text-white font-bold"
                                : "bg-[#ffdad6] text-[#93000a] font-bold hover:bg-[#ba1a1a]/10"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[18px] md:text-[20px]">
                            emergency
                        </span>
                        Emergency
                    </NavLink>

                    {/* Settings */}
                    <NavLink
                        to="/settings"
                        onClick={handleMobileClose}
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-2
                            rounded-lg transition-colors
                            text-sm font-medium text-left no-underline
                            ${isActive
                                ? "bg-[#efe6e2] text-[#004d37]"
                                : "text-[#3f4944] hover:bg-[#efe6e2]"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[18px] md:text-[20px]">
                            settings
                        </span>
                        Settings
                    </NavLink>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#3f4944] hover:bg-[#efe6e2] transition-colors text-sm font-medium text-left"
                    >
                        <span className="material-symbols-rounded text-[18px] md:text-[20px]">
                            logout
                        </span>
                        Logout
                    </button>

                </div>
            </nav>
        </>
    );
}