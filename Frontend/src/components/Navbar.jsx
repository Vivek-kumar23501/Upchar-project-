import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({
    isAuthOpen,
    setIsAuthOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen
}) {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Add shadow and bg opacity on scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { href: "/#home",         label: "Home" },
        { href: "/#features",     label: "Features" },
        { href: "/#about",        label: "About Us" },
        { href: "/#visual-care",  label: "Visual Care" },
    ];

    return (
        <>
            <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 w-full pointer-events-none">

                {/* ── Main Navbar ── */}
                <nav className={`
                    bg-white/95 backdrop-blur-xl border border-gray-200/80
                    rounded-full px-4 md:px-6 py-2
                    flex items-center justify-between
                    w-full max-w-[1200px]
                    pointer-events-auto
                    transition-all duration-300
                    ${scrolled
                        ? "shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-gray-200"
                        : "shadow-sm border-gray-200/60"
                    }
                `}>

                    {/* Logo */}
                    <Link to="/"
                        className="flex items-center gap-1.5 text-[#004d37] transition-transform hover:scale-105 no-underline">
                        <span className="material-symbols-rounded text-2xl font-light">health_metrics</span>
                        <span className="font-serif font-bold text-lg tracking-tight mt-0.5">U P C H A R</span>
                    </Link>

                    {/* Desktop center nav */}
                    <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2
                        p-1 rounded-full bg-gray-100/80 border border-gray-200/50">
                        {navLinks.map(({ href, label }) => (
                            <Link key={href} to={href}
                                className="font-sans font-bold text-xs tracking-wide px-4 py-1.5 rounded-full
                                    text-gray-500 hover:text-[#004d37] hover:bg-white hover:shadow-sm
                                    transition-all duration-300 no-underline">
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA + Mobile toggle */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link to="/auth"
                            className="hidden md:flex px-5 py-2 rounded-full font-sans font-bold text-sm
                                bg-[#004d37] text-white hover:bg-[#00674b] transition-all duration-300
                                items-center gap-1.5 shadow-sm no-underline">
                            Connect
                            <span className="material-symbols-rounded text-[16px]">arrow_forward</span>
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            id="navbar-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-1.5 rounded-full border text-[#004d37] bg-gray-50
                                border-gray-200 hover:bg-gray-200 transition-all duration-300
                                focus:outline-none flex items-center justify-center"
                            aria-label="Toggle menu"
                        >
                            <span className={`material-symbols-rounded text-xl block transition-transform duration-500 ease-out
                                ${isMobileMenuOpen ? 'rotate-180 scale-110' : 'rotate-0'}`}>
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </nav>

                {/* ── Mobile Dropdown Menu ── */}
                <div className={`
                    absolute top-[calc(100%+0.5rem)] left-4 right-4
                    max-w-[1200px] mx-auto
                    bg-white/96 backdrop-blur-2xl
                    border border-gray-200 rounded-3xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                    md:hidden flex flex-col
                    transform origin-top transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isMobileMenuOpen
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                    }
                `}>

                    {/* Nav links */}
                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 mb-3">
                        {navLinks.map(({ href, label }) => (
                            <Link key={href} to={href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-sans font-bold text-base px-3 py-2.5 rounded-xl
                                    text-gray-600 hover:text-[#004d37] hover:bg-gray-50
                                    hover:translate-x-1 transition-all duration-300 no-underline">
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <Link to="/auth"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3.5 rounded-2xl font-sans font-bold text-base
                            flex items-center justify-center gap-2 shadow-glow-green
                            bg-[#004d37] text-white hover:bg-[#00674b] transition-colors no-underline">
                        Connect to Upchar
                        <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </>
    );
}