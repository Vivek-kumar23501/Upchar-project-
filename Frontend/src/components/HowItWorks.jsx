import React from 'react';

export default function HowItWorks() {
    return (
        <section className="bg-gray-50 py-32 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-mint/20 rounded-full blur-[80px] animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <div className="inline-block mb-4 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                        <span className="font-sans text-xs font-bold tracking-widest text-brand-dark uppercase">The Experience</span>
                    </div>
                    <h2 className="font-serif text-5xl md:text-6xl text-brand-dark font-bold mb-6 tracking-tight">Care in three fluid steps.</h2>
                    <p className="font-sans text-xl text-text-muted">No typing required. Our visual-first journey removes friction, making healthcare universally accessible.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                    <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-1 bg-gradient-to-r from-transparent via-brand-mint to-transparent opacity-50"></div>

                    <div className="group relative z-10 flex flex-col items-center text-center mt-0 md:mt-0 transition-all duration-500 hover:-translate-y-6">
                        <div className="absolute -top-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl z-20 group-hover:scale-110 transition-transform duration-300">1</div>
                        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white group-hover:shadow-[0_20px_50px_rgba(0,108,95,0.15)] transition-all duration-500 w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-md border border-gray-100 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                                <span className="material-symbols-rounded text-[40px] text-brand-dark group-hover:text-brand-mint transition-colors">touch_app</span>
                            </div>
                            <h3 className="font-sans font-bold text-2xl text-brand-dark mb-4 relative z-10">Tap Symptoms</h3>
                            <p className="font-sans text-gray-500 leading-relaxed relative z-10">Interact with our 3D visual body map. Point exactly where it hurts to bypass language barriers entirely.</p>
                        </div>
                    </div>

                    <div className="group relative z-10 flex flex-col items-center text-center mt-0 md:mt-16 transition-all duration-500 hover:-translate-y-6">
                        <div className="absolute -top-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl z-20 group-hover:scale-110 transition-transform duration-300">2</div>
                        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white group-hover:shadow-[0_20px_50px_rgba(0,108,95,0.15)] transition-all duration-500 w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-md border border-gray-100 group-hover:-rotate-6 transition-transform duration-500 relative z-10">
                                <span className="material-symbols-rounded text-[40px] text-brand-dark group-hover:text-brand-mint transition-colors">radar</span>
                                <span className="absolute w-full h-full rounded-3xl border border-brand-mint opacity-0 group-hover:animate-ping"></span>
                            </div>
                            <h3 className="font-sans font-bold text-2xl text-brand-dark mb-4 relative z-10">Scan Local Area</h3>
                            <p className="font-sans text-gray-500 leading-relaxed relative z-10">Our AI instantly sweeps a 50km radius to find available hospital beds, local specialists, and stocked pharmacies.</p>
                        </div>
                    </div>

                    <div className="group relative z-10 flex flex-col items-center text-center mt-0 md:mt-0 transition-all duration-500 hover:-translate-y-6">
                        <div className="absolute -top-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl z-20 group-hover:scale-110 transition-transform duration-300">3</div>
                        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white group-hover:shadow-[0_20px_50px_rgba(0,108,95,0.15)] transition-all duration-500 w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-md border border-gray-100 group-hover:scale-110 transition-transform duration-500 relative z-10">
                                <span className="material-symbols-rounded text-[40px] text-brand-dark group-hover:text-brand-mint transition-colors">handshake</span>
                            </div>
                            <h3 className="font-sans font-bold text-2xl text-brand-dark mb-4 relative z-10">Connect & Cure</h3>
                            <p className="font-sans text-gray-500 leading-relaxed relative z-10">Receive visual SMS directions to the nearest facility or launch an immediate video consultation from your village.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}