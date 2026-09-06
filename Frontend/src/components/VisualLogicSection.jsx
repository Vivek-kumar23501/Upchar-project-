import React from 'react';

export default function VisualLogicSection() {
    return (
        <section id="about" className="bg-brand-cream py-24 md:py-32 border-t border-black/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Copy column */}
                    <div className="w-full lg:w-1/2">
                        <span className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-highlight mb-4 block">
                            How Vitalis Nexus works
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-6 font-bold">
                            Visual logic, built for<br className="hidden md:block" /> <em className="italic font-medium">rural reality.</em>
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-5 items-start bg-white p-6 rounded-2xl border border-brand-highlight/20 shadow-[0_4px_20px_-8px_rgba(14,59,50,0.15)]">
                                <div className="w-12 h-12 bg-brand-mint text-brand-dark rounded-full flex items-center justify-center shrink-0">
                                    <span className="material-symbols-rounded">inventory_2</span>
                                </div>
                                <div>
                                    <h4 className="font-sans font-bold text-lg text-brand-ink mb-1.5">Search by icon, not text</h4>
                                    <p className="font-sans text-text-muted leading-relaxed">Tap the category that matches what you need — maternity care, antivenom, a bed — and the map lights up the nearest place that has it, right now.</p>
                                </div>
                            </div>

                            <div className="flex gap-5 items-start p-6 rounded-2xl hover:bg-white/60 transition-colors">
                                <div className="w-12 h-12 bg-brand-dark text-white rounded-full flex items-center justify-center shrink-0">
                                    <span className="material-symbols-rounded">volume_up</span>
                                </div>
                                <div>
                                    <h4 className="font-sans font-bold text-lg text-brand-ink mb-1.5">Voice-guided at every step</h4>
                                    <p className="font-sans text-text-muted leading-relaxed">Clear voice prompts in regional languages walk you through the app, so it works just as well for someone who can't read as for someone who can.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signature element: the phone as a real wayfinding map */}
                    <div className="w-full lg:w-1/2 flex justify-center relative">
                        {/* ambient glow behind the device, ties the phone to the paper background instead of floating on it */}
                        <div className="absolute w-[360px] h-[500px] bg-brand-highlight/10 rounded-full blur-3xl -z-10"></div>

                        <div className="w-[320px] h-[650px] bg-white rounded-[3rem] border-[12px] border-brand-ink shadow-2xl relative overflow-hidden flex flex-col z-10">

                            {/* Status bar */}
                            <div className="bg-brand-dark text-white pt-12 pb-4 px-5 z-10 rounded-b-2xl">
                                <div className="flex justify-between items-center mb-5">
                                    <span className="material-symbols-rounded text-[20px]">menu</span>
                                    <span className="font-mono font-semibold tracking-wide text-xs">VITALIS NEXUS</span>
                                    <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-rounded text-[18px]">person</span>
                                    </div>
                                </div>

                                {/* Category strip */}
                                <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                                    <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
                                        <div className="w-11 h-11 bg-brand-mint text-brand-dark rounded-full flex items-center justify-center">
                                            <span className="material-symbols-rounded text-[19px]">pregnant_woman</span>
                                        </div>
                                        <span className="text-[9px] font-mono font-semibold uppercase tracking-wider">Maternity</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
                                        <div className="w-11 h-11 bg-brand-orange/25 text-brand-orange rounded-full flex items-center justify-center">
                                            <span className="material-symbols-rounded text-[19px]">medication</span>
                                        </div>
                                        <span className="text-[9px] font-mono font-medium uppercase tracking-wider opacity-80">Pharmacy</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
                                        <div className="w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center border border-white/20">
                                            <span className="material-symbols-rounded text-[19px]">emergency</span>
                                        </div>
                                        <span className="text-[9px] font-mono font-medium uppercase tracking-wider opacity-60">Trauma</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 min-w-[52px]">
                                        <div className="w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center border border-white/20">
                                            <span className="material-symbols-rounded text-[19px]">child_care</span>
                                        </div>
                                        <span className="text-[9px] font-mono font-medium uppercase tracking-wider opacity-60">Pediatric</span>
                                    </div>
                                </div>
                            </div>

                            {/* Map — dot-grid "paper" texture with a hand-drawn dashed path linking pins to the live location */}
                            <div className="flex-grow bg-brand-cream relative">
                                <div
                                    className="absolute inset-0 opacity-25"
                                    style={{ backgroundImage: 'radial-gradient(#0E3B32 1.4px, transparent 1.4px)', backgroundSize: '22px 22px' }}
                                ></div>

                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 420" fill="none">
                                    <path
                                        d="M 52 108 Q 110 180 128 270"
                                        stroke="#2F9C7C"
                                        strokeWidth="2"
                                        strokeDasharray="1 8"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M 128 270 Q 190 260 248 262"
                                        stroke="#0E3B32"
                                        strokeWidth="2"
                                        strokeDasharray="1 8"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <div className="absolute top-[24%] left-[10%] bg-white pl-1.5 pr-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-black/5">
                                    <div className="w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center shrink-0">
                                        <span className="material-symbols-rounded text-[16px]">vaccines</span>
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-sans text-[10px] text-text-muted font-semibold">City Pharmacy</span>
                                        <span className="font-mono text-[10px] font-semibold text-brand-highlight uppercase tracking-wide">In stock now</span>
                                    </div>
                                </div>

                                <div className="absolute top-[62%] right-[6%] bg-white pl-1.5 pr-3 py-1.5 rounded-full shadow-xl flex items-center gap-2 border-2 border-brand-dark">
                                    <div className="w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center shrink-0">
                                        <span className="material-symbols-rounded text-[16px]">local_hospital</span>
                                    </div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-sans text-[10px] text-text-muted font-semibold">District Hospital</span>
                                        <span className="font-mono text-[10px] font-semibold text-brand-ink">12 beds avail.</span>
                                    </div>
                                </div>

                                <div className="absolute top-[64%] left-[36%] w-12 h-12 flex items-center justify-center">
                                    <div className="absolute w-12 h-12 bg-brand-blue/20 rounded-full animate-ping"></div>
                                    <div className="w-3.5 h-3.5 bg-brand-blue rounded-full border-2 border-white shadow-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}