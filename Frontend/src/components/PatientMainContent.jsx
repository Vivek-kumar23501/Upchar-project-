import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicationTracker from './MedicationTracker';

/* ─────────────────────────────────────────────
   Greeting helper
───────────────────────────────────────────── */
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return { text: "Good Morning", emoji: "🌅" };
    if (h < 17) return { text: "Good Afternoon", emoji: "☀️" };
    if (h < 21) return { text: "Good Evening", emoji: "🌆" };
    return { text: "Good Night", emoji: "🌙" };
}

/* ─────────────────────────────────────────────
   Quick Action definition
───────────────────────────────────────────── */
const QUICK_ACTIONS = [
    { icon: "calendar_add_on", label: "Book Appt",  color: "#004d37", bg: "rgba(0,77,55,0.1)" },
    { icon: "vaccines",        label: "Order Meds", color: "#00668a", bg: "rgba(0,104,138,0.1)" },
    { icon: "science",         label: "Lab Test",   color: "#d35400", bg: "rgba(211,84,0,0.1)" },
    { icon: "emergency",       label: "Emergency",  color: "#ba1a1a", bg: "rgba(186,26,26,0.1)" },
];

export default function PatientMainContent({
    user,
    profileImage,
    setIsAiOpen,
    setIsProfileOpen,
}) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const { text: greetText, emoji: greetEmoji } = getGreeting();

    useEffect(() => {
        // Trigger staggered entrance animations after first render
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="relative overflow-x-hidden flex flex-col min-h-screen">

            {/* ═══════════════════════════════════════
                DESKTOP Header (hidden on mobile —
                mobile uses the top bar in PatientLayout)
            ═══════════════════════════════════════ */}
            <header className="hidden md:flex justify-between items-center px-10 h-20
                bg-[#fff8f5]/80 backdrop-blur-md z-30 sticky top-0
                border-b border-[#bec9c2]/20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2 bg-[#f4ece8] px-4 py-2.5 rounded-full
                        w-full max-w-md focus-within:ring-2 focus-within:ring-[#004d37]/20 transition-all"
                >
                    <span className="material-symbols-rounded text-gray-400 text-[20px]">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search records, doctors..."
                        className="bg-transparent border-none outline-none w-full text-sm text-[#1e1b18] placeholder-gray-500"
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery("")}
                            className="text-gray-400 hover:text-gray-600 flex items-center">
                            <span className="material-symbols-rounded text-[18px]">close</span>
                        </button>
                    )}
                </form>

                {/* Right */}
                <div className="flex items-center gap-5 ml-2">
                    <button type="button"
                        className="p-1.5 rounded-full hover:bg-[#efe6e2] text-[#3f4944] relative transition-colors">
                        <span className="material-symbols-rounded text-[22px]">notifications</span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-[#fff8f5]" />
                    </button>

                    <div onClick={() => setIsProfileOpen(true)}
                        className="h-10 w-10 rounded-full border-2 border-[#efe6e2] overflow-hidden
                            bg-[#fbf2ed] shadow-sm shrink-0 flex items-center justify-center
                            cursor-pointer hover:border-[#004d37] transition-all">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[#004d37] font-bold text-base uppercase">
                                {user?.fullname?.charAt(0) || 'U'}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════
                MAIN
            ═══════════════════════════════════════ */}
            <main className="p-4 md:p-10 max-w-[1400px] w-full mx-auto flex-1 flex flex-col gap-6 md:gap-10 relative z-10">

                {/* ── WELCOME SECTION ── */}
                <section className={`mt-1 md:mt-2 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

                    {/* Mobile: Profile row */}
                    <div className="flex items-center justify-between mb-3 md:hidden">
                        <div
                            onClick={() => setIsProfileOpen(true)}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <div className="h-11 w-11 rounded-full border-2 border-[#efe6e2] overflow-hidden
                                bg-[#fbf2ed] shadow-sm shrink-0 flex items-center justify-center">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[#004d37] font-bold text-base uppercase">
                                        {user?.fullname?.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-[11px] text-[#6f7a73] font-medium">{greetText} {greetEmoji}</p>
                                <p className="text-[15px] font-bold text-[#1e1b18] leading-tight">
                                    {user?.firstName || user?.fullname?.split(' ')[0] || 'Patient'}
                                </p>
                            </div>
                        </div>

                        {/* Mobile search icon */}
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/search')}
                            className="w-9 h-9 rounded-full bg-[#f0ebe7] flex items-center justify-center"
                        >
                            <span className="material-symbols-rounded text-[20px] text-[#3f4944]">search</span>
                        </button>
                    </div>

                    {/* Desktop greeting */}
                    <h2 className="hidden md:block text-3xl md:text-5xl font-bold text-[#004d37] mb-2 tracking-tight">
                        {greetText},{' '}
                        {user?.firstName || user?.fullname || 'Patient'}.{' '}
                        <span>{greetEmoji}</span>
                    </h2>

                    <p className="hidden md:block text-lg text-[#3f4944] leading-relaxed max-w-2xl opacity-90 mb-6">
                        Here's an overview of your health dashboard and quick actions for today.
                    </p>

                    {/* ── Quick Action Pills (horizontal scroll on mobile) ── */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                        {QUICK_ACTIONS.map(({ icon, label, color, bg }) => (
                            <button
                                key={label}
                                type="button"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full
                                    border border-white/80 shadow-sm whitespace-nowrap
                                    font-semibold text-xs md:text-sm shrink-0
                                    transition-all duration-200 hover:shadow-md active:scale-95"
                                style={{ background: bg, color }}
                            >
                                <span className="material-symbols-rounded text-[16px]">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── Upcoming appointment card (Mobile only — no dummy data) ── */}
                <section className="md:hidden">
                    <div className="bg-gradient-to-r from-[#004d37] to-[#006c5f] rounded-2xl p-4 flex items-center gap-4 shadow-glow-green">
                        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                            <span className="material-symbols-rounded text-white text-[22px]">calendar_clock</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wider">Next Appointment</p>
                            <p className="text-white font-bold text-[14px] leading-snug mt-0.5">
                                {user?.nextAppointment || 'No upcoming appointments'}
                            </p>
                        </div>
                        <button type="button"
                            className="shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                            <span className="material-symbols-rounded text-white text-[18px]">add</span>
                        </button>
                    </div>
                </section>

                {/* ═══════════════════════════════════════
                    BENTO GRID
                ═══════════════════════════════════════ */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6
                    auto-rows-[minmax(180px,auto)] md:auto-rows-[minmax(300px,auto)]">

                    {/* AI Diagnosis — Wide card */}
                    <button
                        type="button"
                        onClick={() => setIsAiOpen(true)}
                        className="md:col-span-8 lg:col-span-7 rounded-3xl md:rounded-[2rem] overflow-hidden
                            relative group card-hover shadow-card block text-left w-full min-h-[220px]
                            animate-fade-up"
                    >
                        <div className="absolute inset-0 z-0">
                            <img
                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop"
                                alt="AI Medical"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#004d37]/95 via-[#004d37]/50 to-transparent" />
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-8 text-white">
                            <div className="glass w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                <span className="material-symbols-rounded text-white text-[22px] md:text-[26px]">psychology</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-1.5">AI Diagnostic Engine</h3>
                            <p className="text-xs md:text-[15px] opacity-90 max-w-md leading-snug md:leading-relaxed">
                                Describe your symptoms naturally. Get instant, accurate preliminary assessments.
                            </p>
                            <div className="mt-4 flex items-center gap-1.5 text-[#a0f3cf] font-bold text-xs md:text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                Start Assessment
                                <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
                            </div>
                        </div>
                    </button>

                    {/* Teleconsultation */}
                    <a
                        href="#"
                        className="md:col-span-4 lg:col-span-5 rounded-3xl md:rounded-[2rem] overflow-hidden
                            relative group card-hover shadow-card block min-h-[180px]
                            animate-fade-up delay-75"
                    >
                        <div className="absolute inset-0 z-0">
                            <img
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src="https://images.unsplash.com/photo-1612349317150-e410f624c427?q=80&w=600&auto=format&fit=crop"
                                alt="Teleconsultation"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#00668a]/90 via-[#00668a]/30 to-transparent" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-8 text-white">
                            <div className="glass w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                <span className="material-symbols-rounded text-white text-[22px]">videocam</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-1.5">Teleconsultation</h3>
                            <p className="text-xs md:text-[15px] opacity-90 leading-snug">
                                Speak face-to-face with certified specialists from home.
                            </p>
                        </div>
                    </a>

                    {/* Connect to ASHA */}
                    <a
                        href="#"
                        className="md:col-span-6 lg:col-span-4 rounded-3xl md:rounded-[2rem] overflow-hidden
                            relative group card-hover shadow-card block bg-[#f5ece7] min-h-[180px]
                            animate-fade-up delay-150"
                    >
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply">
                            <img className="w-full h-full object-cover"
                                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop"
                                alt="Community Health" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col p-5 md:p-8 justify-between">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#004d37] mb-2">Connect to ASHA</h3>
                                <p className="text-xs md:text-[15px] text-[#3f4944] leading-snug">
                                    Let your local health partner arrange care for you.
                                </p>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex -space-x-2.5">
                                    <div className="w-9 h-9 rounded-full border-2 border-[#fff8f5] overflow-hidden bg-[#00674b]/20">
                                        <img className="w-full h-full object-cover"
                                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
                                            alt="ASHA" />
                                    </div>
                                    <div className="w-9 h-9 rounded-full border-2 border-[#fff8f5] flex items-center justify-center text-[#004d37] text-[10px] font-bold bg-[#a0f3cf]">+3</div>
                                </div>
                                <div className="w-11 h-11 rounded-full bg-[#004d37] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded text-[22px]">diversity_3</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Local Radius Radar */}
                    <a
                        href="#"
                        className="md:col-span-6 lg:col-span-4 rounded-3xl md:rounded-[2rem] overflow-hidden
                            relative group card-hover shadow-card block bg-[#e8f5e9] min-h-[180px]
                            animate-fade-up delay-225"
                    >
                        <div className="absolute right-0 bottom-0 w-2/3 h-full z-0 opacity-50 mix-blend-multiply">
                            <img className="w-full h-full object-cover object-left"
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"
                                alt="Map" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col p-5 md:p-8 justify-between w-[75%] md:w-[70%]">
                            <div>
                                <div className="bg-[#004d37]/10 w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-[#004d37]">
                                    <span className="material-symbols-rounded text-[22px]">radar</span>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-[#004d37] mb-1.5">Local Radius Radar</h3>
                                <p className="text-xs md:text-sm text-[#3f4944] leading-snug">
                                    Locate nearby hospitals and real-time bed availability.
                                </p>
                            </div>
                        </div>
                    </a>

                    {/* Medicine Check */}
                    <a
                        href="#"
                        className="md:col-span-12 lg:col-span-4 rounded-3xl md:rounded-[2rem] overflow-hidden
                            relative group card-hover shadow-card block bg-[#fff3e0] min-h-[180px]
                            animate-fade-up delay-300"
                    >
                        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
                            <img className="w-full h-full object-cover object-bottom"
                                src="https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop"
                                alt="Pharmacy" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col p-5 md:p-8">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="bg-[#d35400] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm">
                                    <span className="material-symbols-rounded text-[20px]">medication</span>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-[#d35400]">Medicine Check</h3>
                            </div>
                            <p className="text-xs md:text-[15px] text-[#935000] font-medium leading-snug">
                                Check local pharmacies for your required medications in stock.
                            </p>
                            <div className="mt-auto pt-4 w-full">
                                <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center gap-2 border border-white">
                                    <span className="material-symbols-rounded text-[#6f7a73] text-[20px]">search</span>
                                    <span className="text-sm text-[#6f7a73] font-medium">Search medicine...</span>
                                </div>
                            </div>
                        </div>
                    </a>
                </section>

                {/* ═══════════════════════════════════════
                    CARE PATHWAY
                ═══════════════════════════════════════ */}
                <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem]
                    border border-[#bec9c2]/40 shadow-card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e8f5e9]/50 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <h3 className="text-xl md:text-2xl font-bold text-[#004d37] mb-6 md:mb-10 text-center md:text-left">
                            Your Care Pathway
                        </h3>
                        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 relative">
                            <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-1 bg-[#e9e1dc] z-0 rounded-full" />

                            {[
                                { step: 1, icon: "psychology",    title: "AI Diagnosis",     desc: "Describe symptoms to our AI engine to receive a preliminary assessment.", color: "bg-[#004d37] text-white" },
                                { step: 2, icon: "videocam",      title: "Teleconsultation", desc: "If required, connect with an expert doctor instantly via video.", color: "bg-white border-4 border-[#00668a] text-[#00668a]" },
                                { step: 3, icon: "local_hospital",title: "Clinical Visit",   desc: "For severe cases, we will book an appointment at your local hospital.", color: "bg-white border-4 border-[#d35400] text-[#d35400]" },
                            ].map(({ step, icon, title, desc, color }) => (
                                <div key={step} className="flex-1 relative z-10 flex flex-col items-center text-center">
                                    {/* Mobile: horizontal layout */}
                                    <div className="flex lg:flex-col items-center lg:items-center gap-4 lg:gap-0 w-full">
                                        <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full ${color} flex items-center justify-center ring-4 md:ring-8 ring-white shadow-md mb-0 lg:mb-5 shrink-0`}>
                                            <span className="material-symbols-rounded text-[24px] md:text-[32px]">{icon}</span>
                                        </div>
                                        <div className="text-left lg:text-center">
                                            <h4 className="font-bold text-[#1e1b18] text-base md:text-lg">{step}. {title}</h4>
                                            <p className="text-xs md:text-sm text-[#3f4944] mt-1 max-w-xs">{desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Medication Tracker */}
                <MedicationTracker />

                {/* ═══════════════════════════════════════
                    INSIGHTS + COMMUNITY
                ═══════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                    {/* Insights */}
                    <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-card overflow-hidden">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-[#004d37]">Personalized Insights</h3>
                            <button type="button" className="text-[#00668a] font-bold text-xs md:text-sm hover:underline">View All</button>
                        </div>
                        <div className="flex overflow-x-auto lg:flex-col gap-3 md:gap-4 pb-2 lg:pb-0 scrollbar-hide">
                            {[
                                { icon: "water_drop", label: "Hydration Goal", text: "You're 2 glasses away from your daily goal. Keep it up!", color: "#00668a" },
                                { icon: "monitor_heart", label: "Recent Assessment", text: "Your blood pressure is trending in a healthy range this week.", color: "#004d37" },
                            ].map(({ icon, label, text, color }) => (
                                <div key={label} className="min-w-[240px] md:min-w-0 bg-[#fbf2ed] p-4 md:p-6 rounded-2xl border border-[#bec9c2]/30 flex flex-col gap-2">
                                    <div className="flex items-center gap-3" style={{ color }}>
                                        <span className="material-symbols-rounded text-[22px]">{icon}</span>
                                        <span className="font-bold text-xs md:text-sm uppercase tracking-wider">{label}</span>
                                    </div>
                                    <p className="text-xs md:text-[15px] text-[#1e1b18] font-medium leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Community */}
                    <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-card">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-[#004d37]">Community</h3>
                        </div>
                        <div className="flex flex-col gap-3 md:gap-4">
                            {[
                                {
                                    imgSrc: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=200&auto=format&fit=crop",
                                    imgBg: "#00674b",
                                    tag: "Nutrition",
                                    tagColor: "#00668a",
                                    title: "5 Heart-Healthy Recipes",
                                },
                                {
                                    icon: "forum",
                                    iconBg: "#c3e7ff",
                                    iconColor: "#00668a",
                                    tag: "Local Forum",
                                    tagColor: "#004d37",
                                    title: "Allergy Q&A",
                                },
                            ].map(({ imgSrc, imgBg, icon, iconBg, iconColor, tag, tagColor, title }) => (
                                <a key={title} href="#"
                                    className="flex items-center gap-4 p-3 md:p-4 rounded-2xl border border-[#bec9c2]/30 hover:shadow-md transition-all group">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0"
                                        style={{ background: imgBg ? `${imgBg}1a` : iconBg }}>
                                        {imgSrc ? (
                                            <img src={imgSrc} alt={tag} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-rounded text-[28px] md:text-[32px] group-hover:scale-110 transition-transform" style={{ color: iconColor }}>{icon}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tagColor }}>{tag}</span>
                                        <h4 className="font-bold text-[#1e1b18] text-sm md:text-base mt-0.5">{title}</h4>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                </div>

            </main>

            {/* ═══════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════ */}
            <footer className="bg-white border-t border-[#bec9c2]/30 py-6 md:py-8 px-4 md:px-10 mt-auto w-full">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-[#3f4944]">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#004d37] text-white flex items-center justify-center text-xs font-bold">U</div>
                        <span className="font-semibold text-[#1e1b18]">© 2026 Upchar.</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-medium">
                        {["Privacy", "Terms", "Support"].map((item) => (
                            <a key={item} href="#" className="hover:text-[#004d37] transition-colors">{item}</a>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    );
}
