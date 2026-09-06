import React from 'react';

export default function ImpactStats() {
    return (
        <section className="bg-gray-950 py-24 relative overflow-hidden border-t border-gray-800">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,108,95,0.2)]">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-brand-mint/20 transition-colors duration-500">
                            <span className="material-symbols-rounded text-brand-mint text-3xl group-hover:scale-110 transition-transform">translate</span>
                        </div>
                        <h4 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-brand-mint transition-all">12+</h4>
                        <p className="font-sans text-gray-400 text-sm font-medium uppercase tracking-widest mt-2 group-hover:text-gray-300">Regional Languages</p>
                    </div>

                    <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,108,95,0.2)]">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-brand-mint/20 transition-colors duration-500">
                            <span className="material-symbols-rounded text-brand-mint text-3xl group-hover:scale-110 transition-transform">add_location</span>
                        </div>
                        <h4 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-brand-mint transition-all">50km</h4>
                        <p className="font-sans text-gray-400 text-sm font-medium uppercase tracking-widest mt-2 group-hover:text-gray-300">Real-Time Radar</p>
                    </div>

                    <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,108,95,0.2)]">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-brand-mint/20 transition-colors duration-500">
                            <span className="material-symbols-rounded text-brand-mint text-3xl group-hover:scale-110 transition-transform">volunteer_activism</span>
                        </div>
                        <h4 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-brand-mint transition-all">10k+</h4>
                        <p className="font-sans text-gray-400 text-sm font-medium uppercase tracking-widest mt-2 group-hover:text-gray-300">ASHA Supported</p>
                    </div>

                    <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,108,95,0.2)]">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-brand-mint/20 transition-colors duration-500">
                            <span className="material-symbols-rounded text-brand-mint text-3xl group-hover:scale-110 transition-transform">speed</span>
                        </div>
                        <h4 className="font-serif text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-brand-mint transition-all">&lt; 3s</h4>
                        <p className="font-sans text-gray-400 text-sm font-medium uppercase tracking-widest mt-2 group-hover:text-gray-300">Avg. Match Time</p>
                    </div>

                </div>
            </div>
        </section>
    );
}