import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white pt-20 pb-10">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 text-white mb-6">
                            <span className="material-symbols-rounded text-3xl font-light text-brand-mint">health_metrics</span>
                            <span className="font-sans font-bold text-xl tracking-tight mt-1">vitalis nexus</span>
                        </Link>
                        <p className="font-sans text-sm text-brand-mint/80 pr-4 leading-relaxed">Bridging the healthcare gap in rural communities through highly visual, intuitive, and robust technology.</p>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-white mb-5">Core Features</h4>
                        <ul className="space-y-3 font-sans text-sm text-brand-mint/70">
                            <li><Link to="/features/ai-checker" className="hover:text-white transition-colors">Visual AI Checker</Link></li>
                            <li><Link to="/features/radar" className="hover:text-white transition-colors">50km Radar Finder</Link></li>
                            <li><Link to="/features/medicine" className="hover:text-white transition-colors">Medicine Locator</Link></li>
                            <li><Link to="/features/teleconsult" className="hover:text-white transition-colors">Teleconsultation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-white mb-5">Communities</h4>
                        <ul className="space-y-3 font-sans text-sm text-brand-mint/70">
                            <li><Link to="/asha/login" className="hover:text-white transition-colors">ASHA Portal Login</Link></li>
                            <li><Link to="/sms-guide" className="hover:text-white transition-colors">Offline SMS Guide</Link></li>
                            <li><Link to="/settings/region" className="hover:text-white transition-colors">Regional Settings</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-sans font-bold text-white mb-5">Support</h4>
                        <ul className="space-y-3 font-sans text-sm text-brand-mint/70">
                            <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/emergency" className="hover:text-white transition-colors">Emergency Protocols</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center font-sans text-xs text-brand-mint/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2026 Vitalis Nexus Healthcare. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}