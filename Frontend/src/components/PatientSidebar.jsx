import React from "react";
import { NavLink } from "react-router-dom";


/* ─────────────────────────────────────────────
   Desktop Sidebar items
───────────────────────────────────────────── */
const SIDEBAR_NAV = [
    { to: "/dashboard",                end: true,  icon: "dashboard",           label: "Dashboard" },
    { to: "/ai-diagnosis",             end: false, icon: "psychology",          label: "AI Diagnosis" },
    { to: "/dashboard/health-records", end: false, icon: "medical_information", label: "Health Records" },
    { to: "/dashboard/teleconsultation",end:false, icon: "video_camera_front",  label: "TeleConsultation" },
    { to: "/dashboard/doctors-near-me",end: false, icon: "pin_drop",            label: "Doctors Near Me" },
    { to: "/dashboard/appointments",   end: false, icon: "calendar_month",      label: "Appointments" },
];

export default function PatientSidebar({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsAiOpen,
    handleLogout,
}) {
    const handleMobileClose = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* ══════════════════════════════════════
                MOBILE: Overlay sidebar (fallback for
                "More" or when hamburger is used)
            ══════════════════════════════════════ */}
            {/* Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={handleMobileClose}
                />
            )}

            {/* ══════════════════════════════════════
                MOBILE: Slide-up drawer (More sheet)
            ══════════════════════════════════════ */}
            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-50 md:hidden
                    rounded-t-[2rem] overflow-hidden
                    transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"}
                `}
                style={{ maxHeight: "75dvh" }}
            >
                {/* Glass sheet */}
                <div className="bg-[#fff8f5]/95 backdrop-blur-2xl border-t border-[#bec9c2]/30 pb-safe">

                    {/* Drag handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 rounded-full bg-[#bec9c2]/60" />
                    </div>

                    {/* Sheet header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-[#bec9c2]/20">
                        <span className="font-display font-bold text-base text-[#004d37]">More Options</span>
                        <button
                            type="button"
                            onClick={handleMobileClose}
                            className="w-8 h-8 rounded-full bg-[#f0ebe7] flex items-center justify-center"
                        >
                            <span className="material-symbols-rounded text-[18px] text-[#3f4944]">close</span>
                        </button>
                    </div>

                    {/* Links */}
                    <div className="px-4 py-3 flex flex-col gap-1">
                        {[
                            { to: "/dashboard/teleconsultation", icon: "video_camera_front", label: "TeleConsultation", color: "#00668a" },
                            { to: "/emergency",                  icon: "emergency",           label: "Emergency",       color: "#ba1a1a", bg: "#ffdad6" },
                            { to: "/settings",                   icon: "settings",            label: "Settings",        color: "#3f4944" },
                        ].map(({ to, icon, label, color, bg }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={handleMobileClose}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all no-underline"
                                style={({ isActive }) => ({
                                    background: isActive ? (bg || "rgba(0,77,55,0.08)") : "transparent",
                                    color: isActive ? color : "#1e1b18",
                                })}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: bg || "rgba(0,77,55,0.08)" }}
                                >
                                    <span
                                        className="material-symbols-rounded text-[22px]"
                                        style={{ color }}
                                    >{icon}</span>
                                </div>
                                <span className="font-semibold text-[15px]">{label}</span>
                                <span className="material-symbols-rounded text-[18px] text-[#bec9c2] ml-auto">chevron_right</span>
                            </NavLink>
                        ))}

                        {/* Logout */}
                        <button
                            type="button"
                            onClick={() => { handleLogout(); handleMobileClose(); }}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all w-full text-left mt-1"
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                                <span className="material-symbols-rounded text-[22px] text-red-500">logout</span>
                            </div>
                            <span className="font-semibold text-[15px] text-red-500">Logout</span>
                        </button>
                    </div>
                </div>
            </div>


            {/* ══════════════════════════════════════
                MOBILE: Fixed Bottom Tab Bar
                (Hidden on md+ → desktop uses sidebar)
            ══════════════════════════════════════ */}
            <nav className="bottom-nav md:hidden" aria-label="Bottom navigation">
                <div className="bottom-nav-inner">

                    {/* Tab 1: Home */}
                    <NavLink to="/dashboard" end
                        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
                        aria-label="Home">
                        {({ isActive }) => (
                            <>
                                <div className="nav-icon-wrap">
                                    <span className={`material-symbols-rounded nav-icon ${isActive ? "text-[#004d37]" : ""}`}>
                                        home
                                    </span>
                                </div>
                                <span className="nav-label">Home</span>
                            </>
                        )}
                    </NavLink>

                    {/* Tab 2: Records */}
                    <NavLink to="/dashboard/health-records"
                        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
                        aria-label="Records">
                        {({ isActive }) => (
                            <>
                                <div className="nav-icon-wrap">
                                    <span className={`material-symbols-rounded nav-icon ${isActive ? "text-[#004d37]" : ""}`}>
                                        medical_information
                                    </span>
                                </div>
                                <span className="nav-label">Records</span>
                            </>
                        )}
                    </NavLink>

                    {/* ── CENTER: Floating AI Button ── */}
                    <NavLink to="/ai-diagnosis"
                        onClick={() => setIsAiOpen?.(true)}
                        className={({ isActive }) => `bottom-nav-center ${isActive ? "active" : ""}`}
                        aria-label="AI Diagnosis">
                        {() => (
                            <>
                                <div className="bottom-nav-center-btn">
                                    <span className="material-symbols-rounded text-white text-[26px]"
                                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 500" }}>
                                        psychology
                                    </span>
                                </div>
                                <span className="nav-label">AI Dx</span>
                            </>
                        )}
                    </NavLink>

                    {/* Tab 3: Doctors */}
                    <NavLink to="/dashboard/doctors-near-me"
                        className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
                        aria-label="Doctors">
                        {({ isActive }) => (
                            <>
                                <div className="nav-icon-wrap">
                                    <span className={`material-symbols-rounded nav-icon ${isActive ? "text-[#004d37]" : ""}`}>
                                        pin_drop
                                    </span>
                                </div>
                                <span className="nav-label">Doctors</span>
                            </>
                        )}
                    </NavLink>

                    {/* Tab 4: More (opens drawer) */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`bottom-nav-item ${isMobileMenuOpen ? "active" : ""}`}
                        aria-label="More">
                        <div className="nav-icon-wrap">
                            <span className={`material-symbols-rounded nav-icon ${isMobileMenuOpen ? "text-[#004d37]" : ""}`}>
                                menu
                            </span>
                        </div>
                        <span className="nav-label">More</span>
                    </button>

                </div>
            </nav>


            {/* ══════════════════════════════════════
                DESKTOP: Left Sidebar
                (Exactly as original, untouched layout)
            ══════════════════════════════════════ */}
            <nav
                className="hidden md:flex fixed flex-col h-[100dvh] w-64 left-0 top-0
                    bg-[#fbf2ed] border-r border-[#bec9c2]/30 z-50 py-6 px-4
                    shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
            >
                {/* Logo */}
                <NavLink
                    to="/dashboard"
                    className="shrink-0 mb-8 mt-2 flex items-center gap-2 px-2 cursor-pointer group no-underline text-[#004d37] transition-transform hover:scale-105"
                >
                    <span className="material-symbols-rounded text-[32px] font-bold">health_metrics</span>
                    <span className="font-serif font-bold text-2xl tracking-widest uppercase mt-0.5">UPCHAR</span>
                </NavLink>

                {/* Nav items */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-1 pb-4 scrollbar-hide">
                    {SIDEBAR_NAV.map(({ to, end, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => {
                                if (to === "/ai-diagnosis") setIsAiOpen?.(true);
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
                            <span className="material-symbols-rounded text-[22px]">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </div>

                {/* Bottom section */}
                <div className="shrink-0 space-y-2 pt-4 border-t border-[#bec9c2]/30">
                    <NavLink
                        to="/emergency"
                        className={({ isActive }) => `
                            w-full flex items-center justify-center gap-2
                            py-3 px-4 rounded-xl transition-colors shadow-sm
                            text-sm no-underline font-bold
                            ${isActive
                                ? "bg-[#ba1a1a] text-white"
                                : "bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a]/10"
                            }
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px]">emergency</span>
                        Emergency
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `
                            w-full flex items-center gap-3 px-4 py-2 rounded-lg
                            transition-colors text-sm font-medium text-left no-underline
                            ${isActive ? "bg-[#efe6e2] text-[#004d37]" : "text-[#3f4944] hover:bg-[#efe6e2]"}
                        `}
                    >
                        <span className="material-symbols-rounded text-[20px]">settings</span>
                        Settings
                    </NavLink>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#3f4944] hover:bg-[#efe6e2] transition-colors text-sm font-medium text-left"
                    >
                        <span className="material-symbols-rounded text-[20px]">logout</span>
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
}