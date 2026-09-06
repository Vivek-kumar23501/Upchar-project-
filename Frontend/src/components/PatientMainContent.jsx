import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicationTracker from './MedicationTracker';

export default function PatientMainContent({
    user,
    profileImage,
    setIsAiOpen,
    setIsProfileOpen
}) {
    const navigate = useNavigate();

    // --- ADD SEARCH STATE & HANDLER ---
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (
        <div className="relative overflow-x-hidden flex flex-col min-h-screen">

            {/* =========================
                Header
            ========================= */}
            <header className="flex justify-between items-center px-4 md:px-10 h-16 md:h-20 bg-[#fff8f5]/80 backdrop-blur-md z-30 sticky top-0 border-b border-[#bec9c2]/20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="hidden md:flex items-center gap-2 bg-[#f4ece8] px-4 py-2.5 rounded-full w-full max-w-md focus-within:ring-2 focus-within:ring-[#004d37]/20 transition-all"
                >
                    <span className="material-symbols-rounded text-gray-400 text-[20px]">
                        search
                    </span>

                    <input
                        type="text"
                        value={searchQuery} // Bind state to input
                        onChange={(e) => setSearchQuery(e.target.value)} // Update state on type
                        placeholder="Search records, doctors..."
                        className="bg-transparent border-none outline-none w-full text-sm text-[#1e1b18] placeholder-gray-500"
                    />

                    {/* Optional: Clear Button when typing */}
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-gray-400 hover:text-gray-600 flex items-center"
                        >
                            <span className="material-symbols-rounded text-[18px]">close</span>
                        </button>
                    )}
                </form>

                {/* Right Header */}
                <div className="flex items-center gap-3 md:gap-5 ml-2">

                    {/* Notifications */}
                    <button
                        type="button"
                        className="p-1.5 rounded-full hover:bg-[#efe6e2] text-[#3f4944] relative transition-colors"
                    >
                        <span className="material-symbols-rounded text-[22px]">
                            notifications
                        </span>

                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ba1a1a] rounded-full ring-2 ring-[#fff8f5]" />
                    </button>

                    {/* Profile Image Clickable Area */}
                    <div
                        onClick={() => setIsProfileOpen(true)}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-[#efe6e2] overflow-hidden bg-[#fbf2ed] shadow-sm shrink-0 flex items-center justify-center cursor-pointer hover:border-[#004d37] transition-all"
                    >
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-[#004d37] font-bold text-sm md:text-base uppercase">
                                {user?.fullname?.charAt(0) || 'U'}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* =========================
                Main
            ========================= */}
            <main className="p-4 md:p-10 max-w-[1400px] w-full mx-auto flex-1 flex flex-col gap-8 md:gap-12 relative z-10">

                {/* Welcome */}
                <section className="mt-1 md:mt-2">

                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#004d37] mb-2 md:mb-3 tracking-tight">
                        Good Morning,{' '}
                        {user?.firstName ||
                            user?.fullname ||
                            'Patient'}
                        .
                    </h2>

                    <p className="text-sm md:text-lg text-[#3f4944] leading-relaxed max-w-2xl opacity-90 mb-4 md:mb-6">
                        Here's an overview of your health dashboard and quick actions for today.
                    </p>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 md:gap-3">

                        <button
                            type="button"
                            className="flex items-center gap-1.5 md:gap-2 bg-white border border-[#bec9c2]/50 hover:border-[#004d37] text-[#004d37] px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-rounded text-[16px] md:text-[18px]">
                                calendar_add_on
                            </span>
                            Book Appt
                        </button>

                        <button
                            type="button"
                            className="flex items-center gap-1.5 md:gap-2 bg-white border border-[#bec9c2]/50 hover:border-[#00668a] text-[#00668a] px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-rounded text-[16px] md:text-[18px]">
                                vaccines
                            </span>
                            Order Meds
                        </button>

                        <button
                            type="button"
                            className="flex items-center gap-1.5 md:gap-2 bg-white border border-[#bec9c2]/50 hover:border-[#d35400] text-[#d35400] px-3 py-1.5 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-rounded text-[16px] md:text-[18px]">
                                science
                            </span>
                            Lab Test
                        </button>

                    </div>
                </section>

                {/* =========================
                    Bento Grid
                ========================= */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(200px,auto)] md:auto-rows-[minmax(300px,auto)]">

                    {/* AI Diagnosis */}
                    <button
                        type="button"
                        onClick={() => setIsAiOpen(true)}
                        className="md:col-span-8 lg:col-span-7 rounded-3xl md:rounded-[2rem] overflow-hidden relative group shadow-[0_4px_24px_rgba(0,0,0,0.04)] block transition-transform duration-300 hover:-translate-y-1 text-left w-full min-h-[220px]"
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

                            <div className="bg-white/20 backdrop-blur-md w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 border border-white/30 shadow-sm">
                                <span className="material-symbols-rounded text-white text-[20px] md:text-[24px]">
                                    psychology
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                AI Diagnostic Engine
                            </h3>

                            <p className="text-xs md:text-[15px] opacity-90 max-w-md leading-snug md:leading-relaxed">
                                Describe your symptoms naturally. Get instant, accurate preliminary assessments.
                            </p>

                            <div className="mt-4 flex items-center gap-1.5 text-[#a0f3cf] font-bold text-xs md:text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                                Start Assessment

                                <span className="material-symbols-rounded text-[16px]">
                                    arrow_forward
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Teleconsultation */}
                    <a
                        href="#"
                        className="md:col-span-4 lg:col-span-5 rounded-3xl md:rounded-[2rem] overflow-hidden relative group shadow-[0_4px_24px_rgba(0,0,0,0.04)] block transition-transform duration-300 hover:-translate-y-1 min-h-[200px]"
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

                            <div className="bg-white/20 backdrop-blur-md w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 border border-white/30 shadow-sm">
                                <span className="material-symbols-rounded text-white text-[20px] md:text-[24px]">
                                    videocam
                                </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold mb-1.5">
                                Teleconsultation
                            </h3>

                            <p className="text-xs md:text-[15px] opacity-90 leading-snug">
                                Speak face-to-face with certified specialists from home.
                            </p>
                        </div>
                    </a>

                    {/* Connect to ASHA */}
                    <a
                        href="#"
                        className="md:col-span-6 lg:col-span-4 rounded-3xl md:rounded-[2rem] overflow-hidden relative group shadow-[0_4px_24px_rgba(0,0,0,0.04)] block transition-transform duration-300 hover:-translate-y-1 bg-[#f5ece7] min-h-[200px]"
                    >
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply">
                            <img
                                className="w-full h-full object-cover"
                                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop"
                                alt="Community Health"
                            />
                        </div>

                        <div className="relative z-10 h-full flex flex-col p-5 md:p-8 justify-between">

                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#004d37] mb-2">
                                    Connect to ASHA
                                </h3>

                                <p className="text-xs md:text-[15px] text-[#3f4944] leading-snug">
                                    Let your local health partner arrange care for you.
                                </p>
                            </div>

                            <div className="mt-6 flex items-center justify-between">

                                <div className="flex -space-x-2.5 md:-space-x-3">

                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#fff8f5] overflow-hidden bg-[#00674b]/20">
                                        <img
                                            className="w-full h-full object-cover"
                                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop"
                                            alt="ASHA"
                                        />
                                    </div>

                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#fff8f5] flex items-center justify-center text-[#004d37] text-[10px] md:text-xs font-bold bg-[#a0f3cf]">
                                        +3
                                    </div>

                                </div>

                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#004d37] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                                        diversity_3
                                    </span>
                                </div>

                            </div>
                        </div>
                    </a>

                    {/* Local Radius Radar */}
                    <a
                        href="#"
                        className="md:col-span-6 lg:col-span-4 rounded-3xl md:rounded-[2rem] overflow-hidden relative group shadow-[0_4px_24px_rgba(0,0,0,0.04)] block transition-transform duration-300 hover:-translate-y-1 bg-[#e8f5e9] min-h-[200px]"
                    >
                        <div className="absolute right-0 bottom-0 w-2/3 h-full z-0 opacity-50 mix-blend-multiply">
                            <img
                                className="w-full h-full object-cover object-left"
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"
                                alt="Map"
                            />
                        </div>

                        <div className="relative z-10 h-full flex flex-col p-5 md:p-8 justify-between w-[75%] md:w-[70%]">

                            <div>
                                <div className="bg-[#004d37]/10 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 text-[#004d37]">
                                    <span className="material-symbols-rounded text-[20px] md:text-[24px]">
                                        radar
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-[#004d37] mb-1.5">
                                    Local Radius Radar
                                </h3>

                                <p className="text-xs md:text-sm text-[#3f4944] leading-snug">
                                    Locate nearby hospitals and real-time bed availability.
                                </p>
                            </div>

                        </div>
                    </a>

                    {/* Medicine Check */}
                    <a
                        href="#"
                        className="md:col-span-12 lg:col-span-4 rounded-3xl md:rounded-[2rem] overflow-hidden relative group shadow-[0_4px_24px_rgba(0,0,0,0.04)] block transition-transform duration-300 hover:-translate-y-1 bg-[#fff3e0] min-h-[200px]"
                    >
                        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
                            <img
                                className="w-full h-full object-cover object-bottom"
                                src="https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop"
                                alt="Pharmacy"
                            />
                        </div>

                        <div className="relative z-10 h-full flex flex-col p-5 md:p-8">

                            <div className="flex items-center gap-2.5 mb-3">

                                <div className="bg-[#d35400] w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-sm">
                                    <span className="material-symbols-rounded text-[18px] md:text-[20px]">
                                        medication
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-xl font-bold text-[#d35400]">
                                    Medicine Check
                                </h3>

                            </div>

                            <p className="text-xs md:text-[15px] text-[#935000] font-medium leading-snug">
                                Check local pharmacies for your required medications in stock.
                            </p>

                            <div className="mt-auto pt-4 w-full">
                                <div className="bg-white/80 backdrop-blur-md rounded-lg md:rounded-xl p-2 md:p-3 flex items-center gap-2 border border-white">

                                    <span className="material-symbols-rounded text-[#6f7a73] text-[18px] md:text-[20px]">
                                        search
                                    </span>

                                    <span className="text-xs md:text-sm text-[#6f7a73] font-medium">
                                        Search medicine...
                                    </span>

                                </div>
                            </div>

                        </div>
                    </a>

                </section>

                {/* =========================
                    Care Pathway
                ========================= */}
                <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm relative overflow-hidden">

                    <div className="absolute inset-0 bg-gradient-to-r from-[#e8f5e9]/50 to-transparent opacity-50" />

                    <div className="relative z-10">

                        <h3 className="text-xl md:text-2xl font-bold text-[#004d37] mb-6 md:mb-10 text-center md:text-left">
                            Your Care Pathway
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 relative">

                            <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] h-1 bg-[#e9e1dc] z-0 rounded-full" />

                            {/* Step 1 */}
                            <div className="flex-1 relative z-10 flex flex-col items-center text-center">

                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-[#004d37] text-white flex items-center justify-center ring-4 md:ring-8 ring-white shadow-md mb-3 md:mb-5">
                                    <span className="material-symbols-rounded text-[24px] md:text-[32px]">
                                        psychology
                                    </span>
                                </div>

                                <h4 className="font-bold text-[#1e1b18] text-base md:text-lg">
                                    1. AI Diagnosis
                                </h4>

                                <p className="text-xs md:text-sm text-[#3f4944] mt-1 md:mt-2 max-w-[250px] md:max-w-xs">
                                    Describe symptoms to our AI engine to receive a preliminary assessment.
                                </p>

                            </div>

                            {/* Step 2 */}
                            <div className="flex-1 relative z-10 flex flex-col items-center text-center mt-6 lg:mt-0">

                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white border-4 border-[#00668a] text-[#00668a] flex items-center justify-center ring-4 md:ring-8 ring-white shadow-md mb-3 md:mb-5">
                                    <span className="material-symbols-rounded text-[24px] md:text-[32px]">
                                        videocam
                                    </span>
                                </div>

                                <h4 className="font-bold text-[#1e1b18] text-base md:text-lg">
                                    2. Teleconsultation
                                </h4>

                                <p className="text-xs md:text-sm text-[#3f4944] mt-1 md:mt-2 max-w-[250px] md:max-w-xs">
                                    If required, connect with an expert doctor instantly via video.
                                </p>

                            </div>

                            {/* Step 3 */}
                            <div className="flex-1 relative z-10 flex flex-col items-center text-center mt-6 lg:mt-0">

                                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white border-4 border-[#d35400] text-[#d35400] flex items-center justify-center ring-4 md:ring-8 ring-white shadow-md mb-3 md:mb-5">
                                    <span className="material-symbols-rounded text-[24px] md:text-[32px]">
                                        local_hospital
                                    </span>
                                </div>

                                <h4 className="font-bold text-[#1e1b18] text-base md:text-lg">
                                    3. Clinical Visit
                                </h4>

                                <p className="text-xs md:text-sm text-[#3f4944] mt-1 md:mt-2 max-w-[250px] md:max-w-xs">
                                    For severe cases, we will book an appointment at your local hospital.
                                </p>

                            </div>

                        </div>
                    </div>
                </section>

                {/* Medication Tracker */}
                <MedicationTracker />

                {/* =========================
                    Insights + Community
                ========================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                    {/* Insights */}
                    <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm overflow-hidden">

                        <div className="flex justify-between items-center mb-4 md:mb-6">

                            <h3 className="text-xl md:text-2xl font-bold text-[#004d37]">
                                Personalized Insights
                            </h3>

                            <button
                                type="button"
                                className="text-[#00668a] font-bold text-xs md:text-sm hover:underline"
                            >
                                View All
                            </button>

                        </div>

                        <div className="flex overflow-x-auto lg:flex-col gap-3 md:gap-4 pb-2 lg:pb-0 scrollbar-hide">

                            <div className="min-w-[240px] md:min-w-0 bg-[#fbf2ed] p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] border border-[#bec9c2]/30 flex flex-col gap-1.5 md:gap-2">

                                <div className="flex items-center gap-2 md:gap-3 text-[#00668a]">
                                    <span className="material-symbols-rounded text-[18px] md:text-[24px]">
                                        water_drop
                                    </span>

                                    <span className="font-bold text-xs md:text-sm uppercase tracking-wider">
                                        Hydration Goal
                                    </span>
                                </div>

                                <p className="text-xs md:text-[15px] text-[#1e1b18] font-medium leading-relaxed">
                                    You're 2 glasses away from your daily goal. Keep it up!
                                </p>

                            </div>

                            <div className="min-w-[240px] md:min-w-0 bg-[#fbf2ed] p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] border border-[#bec9c2]/30 flex flex-col gap-1.5 md:gap-2">

                                <div className="flex items-center gap-2 md:gap-3 text-[#004d37]">

                                    <span className="material-symbols-rounded text-[18px] md:text-[24px]">
                                        monitor_heart
                                    </span>

                                    <span className="font-bold text-xs md:text-sm uppercase tracking-wider">
                                        Recent Assessment
                                    </span>

                                </div>

                                <p className="text-xs md:text-[15px] text-[#1e1b18] font-medium leading-relaxed">
                                    Your blood pressure is trending in a healthy range this week.
                                </p>

                            </div>

                        </div>
                    </section>

                    {/* Community */}
                    <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm">

                        <div className="flex justify-between items-center mb-4 md:mb-6">

                            <h3 className="text-xl md:text-2xl font-bold text-[#004d37]">
                                Community
                            </h3>

                        </div>

                        <div className="flex flex-col gap-3 md:gap-4">

                            {/* Nutrition */}
                            <a
                                href="#"
                                className="flex items-center gap-3 md:gap-5 p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] border border-[#bec9c2]/30 hover:shadow-md transition-all group"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#00674b]/10 overflow-hidden shrink-0">

                                    <img
                                        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=200&auto=format&fit=crop"
                                        alt="Food"
                                        className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform"
                                    />

                                </div>

                                <div>

                                    <span className="text-[9px] md:text-[10px] font-bold text-[#00668a] uppercase tracking-widest">
                                        Nutrition
                                    </span>

                                    <h4 className="font-bold text-[#1e1b18] text-sm md:text-base mt-0.5 md:mt-1">
                                        5 Heart-Healthy Recipes
                                    </h4>

                                </div>
                            </a>

                            {/* Forum */}
                            <a
                                href="#"
                                className="flex items-center gap-3 md:gap-5 p-3 md:p-4 rounded-2xl md:rounded-[1.5rem] border border-[#bec9c2]/30 hover:shadow-md transition-all group"
                            >

                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#c3e7ff] flex items-center justify-center shrink-0">

                                    <span className="material-symbols-rounded text-[24px] md:text-[32px] text-[#00668a] group-hover:scale-110 transition-transform">
                                        forum
                                    </span>

                                </div>

                                <div>

                                    <span className="text-[9px] md:text-[10px] font-bold text-[#004d37] uppercase tracking-widest">
                                        Local Forum
                                    </span>

                                    <h4 className="font-bold text-[#1e1b18] text-sm md:text-base mt-0.5 md:mt-1">
                                        Allergy Q&amp;A
                                    </h4>

                                </div>

                            </a>

                        </div>
                    </section>

                </div>

            </main>

            {/* =========================
                Footer
            ========================= */}
            <footer className="bg-white border-t border-[#bec9c2]/30 py-6 md:py-8 px-4 md:px-10 mt-auto w-full">

                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-[#3f4944]">

                    <div className="flex items-center gap-2">

                        <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[#004d37] text-white flex items-center justify-center text-[10px] md:text-xs font-bold">
                            V
                        </div>

                        <span className="font-semibold text-[#1e1b18]">
                            © 2026 Vitalis Nexus.
                        </span>

                    </div>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-medium">

                        <a
                            href="#"
                            className="hover:text-[#004d37] transition-colors"
                        >
                            Privacy
                        </a>

                        <a
                            href="#"
                            className="hover:text-[#004d37] transition-colors"
                        >
                            Terms
                        </a>

                        <a
                            href="#"
                            className="hover:text-[#004d37] transition-colors"
                        >
                            Support
                        </a>

                    </div>

                </div>
            </footer>

        </div>
    );
}
