import React, { useState } from 'react';
import AuthModal from '../components/AuthModal';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import FeaturesGrid from '../components/FeaturesGrid';
import VisualLogicSection from '../components/VisualLogicSection';
import HowItWorks from '../components/HowItWorks';
import ImpactStats from '../components/ImpactStats';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage() {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar
                isAuthOpen={isAuthOpen}
                setIsAuthOpen={setIsAuthOpen}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <main className="flex-grow">
                <HeroCarousel />
                <FeaturesGrid />
                <VisualLogicSection />
                <HowItWorks />
                <ImpactStats />
                <CTASection />
            </main>

            <Footer />

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
            />
        </div>
    );
}