import React from 'react';

export default function FeaturesGrid() {
    return (
        <section id="features" className="bg-brand-cream relative z-30 pt-20 pb-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <h2 className="font-serif text-4xl md:text-5xl text-brand-dark mb-6 font-bold">Everything you need, visible at a glance.</h2>
                    <p className="font-sans text-lg text-text-muted leading-relaxed">We replaced complicated text with intuitive pictures, maps, and colors. Find the right care instantly, regardless of language barriers, designed specifically for rural accessibility.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[380px]">

                    <div className="relative rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer bg-gray-900">
                        <img src="/images/bot.png" alt="AI Interface" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/30 text-white">
                                <span className="material-symbols-rounded text-[28px]">psychology_alt</span>
                            </div>
                            <h3 className="font-serif text-2xl text-white mb-2 font-bold">Visual AI Diagnosis</h3>
                            <p className="font-sans text-gray-300 text-sm leading-relaxed">Tap the part of the body that hurts on our visual map. Our AI asks simple, picture-based questions.</p>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer bg-gray-900">
                        <img src="/images/teli.png" alt="Telehealth" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3b8a] via-[#0e3b8a]/70 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/30 text-white">
                                <span className="material-symbols-rounded text-[28px]">video_camera_front</span>
                            </div>
                            <h3 className="font-serif text-2xl text-white mb-2 font-bold">Teleconsultation</h3>
                            <p className="font-sans text-blue-100 text-sm leading-relaxed">Speak face-to-face with certified specialists directly from your village through high-quality video.</p>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer bg-gray-900">
                        <img src="/images/asha.png" alt="ASHA Worker" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="w-14 h-14 bg-brand-highlight/90 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 shadow-lg text-white">
                                <span className="material-symbols-rounded text-[28px]">diversity_3</span>
                            </div>
                            <h3 className="font-serif text-2xl text-white mb-2 font-bold">ASHA Integration</h3>
                            <p className="font-sans text-gray-300 text-sm leading-relaxed">Not comfortable with digital tools? Let your local ASHA worker log symptoms and arrange care for you.</p>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer bg-gray-900">
                        <img src="/images/medical.png" alt="Hospital Map" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 mix-blend-luminosity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/30 text-white">
                                <span className="material-symbols-rounded text-[28px]">share_location</span>
                            </div>
                            <h3 className="font-serif text-2xl text-white mb-2 font-bold">Local Radius Radar</h3>
                            <p className="font-sans text-brand-mint text-sm leading-relaxed">Instantly locate nearby hospitals, clinics, and check real-time bed availability before you travel.</p>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer bg-gray-900">
                        <img src="/images/medi.png" alt="Pharmacy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8c3d1a] via-[#8c3d1a]/70 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/30 text-white">
                                <span className="material-symbols-rounded text-[28px]">medication</span>
                            </div>
                            <h3 className="font-serif text-2xl text-white mb-2 font-bold">Medicine Check</h3>
                            <p className="font-sans text-orange-100 text-sm leading-relaxed">See which local pharmacies have your required medications in stock right now, saving wasted trips.</p>
                        </div>
                    </div>

                    <div className="relative rounded-[2rem] overflow-hidden group shadow-lg cursor-pointer bg-gray-900">
                        <img src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=800&auto=format&fit=crop" alt="Mobile Phone" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 mix-blend-luminosity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/30 text-white">
                                <span className="material-symbols-rounded text-[28px]">wifi_off</span>
                            </div>
                            <h3 className="font-serif text-2xl text-white mb-2 font-bold">Offline SMS Mode</h3>
                            <p className="font-sans text-gray-300 text-sm leading-relaxed">Internet unreliable? Access basic symptom checks and vital hospital locations purely via SMS.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}