import React from 'react';
import { Link } from 'react-router-dom';

export default function CTASection() {
    return (
        <section className="bg-brand-cream py-32 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="bg-brand-dark rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 group">

                    <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700 delay-100"></div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[200px] h-[200px] bg-brand-mint/20 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-mint/30 transition-colors duration-700"></div>

                    <div className="relative z-10 max-w-3xl flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-brand-mint animate-pulse"></div>
                            <span className="text-white text-xs font-bold uppercase tracking-widest">Join the Provider Network</span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
                            Help us put rural <br /><span className="text-brand-mint italic pr-2">healthcare on the map.</span>
                        </h2>

                        <p className="font-sans text-gray-300 text-lg md:text-xl mb-0 max-w-xl leading-relaxed">
                            Are you a local clinic, district hospital, or pharmacy? Sync your bed availability and inventory with Vitalis Nexus to reach patients in surrounding villages seamlessly.
                        </p>
                    </div>

                    <div className="relative z-10 w-full lg:w-auto flex-shrink-0">
                        <Link
                            to="/register-facility"
                            className="group/btn relative overflow-hidden w-full lg:w-auto bg-white text-brand-dark hover:text-white hover:bg-brand-mint px-10 py-6 rounded-full font-sans font-bold text-xl transition-all duration-500 flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,108,95,0.6)]"
                        >
                            <span className="relative z-10">Register Facility</span>
                            <span className="material-symbols-rounded text-[24px] relative z-10 group-hover/btn:translate-x-2 transition-transform duration-300">east</span>
                            <div className="absolute inset-0 bg-brand-mint scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-500 ease-out z-0"></div>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}