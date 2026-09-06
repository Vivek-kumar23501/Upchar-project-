import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDE_DURATION = 3000;

const slides = [
    {
        eyebrow: 'Primary care, reimagined',
        headline: 'You deserve a doctor who listens.',
        body: "No more late-night symptom searches or rushed diagnoses. Vitalis doctors go beyond symptoms to treat the root cause of your illness and deliver long-term healing.",
        photo: {
            src: '/images/doctor-1.jpg',
            fallback: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1200&auto=format&fit=crop',
        },
        testimonial: {
            name: 'Heal Patric',
            quote: 'Rewriting healthcare for the patients who need it most.',
        },
        badge: { icon: 'call', label: '24/7', text: 'Our experts are available' },
    },
    {
        eyebrow: 'Care without the commute',
        headline: 'Your village, on the map at last.',
        body: "ASHA workers use Vitalis to find the nearest open bed, medicine stock, or specialist in seconds — no more guessing which clinic to send a patient to.",
        photo: {
            src: '/images/asha-worker-1.jpg',
            fallback: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop',
        },
        testimonial: {
            name: 'Meena, ASHA worker',
            quote: 'I stopped guessing which clinic to send families to.',
        },
        badge: { icon: 'location_on', label: '4,200+', text: 'Facilities mapped nearby' },
    },
    {
        eyebrow: 'Medicine, tracked live',
        headline: 'Never chase an empty pharmacy shelf again.',
        body: "Real-time stock signals from local pharmacies mean patients are guided straight to the shelf that actually has what they need — the first time.",
        photo: {
            src: '/images/pharmacist-1.jpg',
            fallback: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1200&auto=format&fit=crop',
        },
        testimonial: {
            name: 'City Pharmacy',
            quote: 'Foot traffic finds us the moment stock is updated.',
        },
        badge: { icon: 'inventory_2', label: 'Live', text: 'Stock updated in real time' },
    },
];

export default function HeroCarouselCard() {
    const [current, setCurrent] = useState(0);
    const total = slides.length;

    // Auto-advance forever — no pause on hover, keeps sliding continuously.
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % total);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [total]);

    const goTo = (index) => setCurrent(index);

    return (
        <section className="relative w-full bg-brand-cream overflow-hidden mt-[20px] md:mt-0 py-20 md:py-28">
            <div className="absolute -top-40 -right-40 w-[560px] h-[560px] bg-brand-mint/40 rounded-full blur-3xl -z-0"></div>

            {/* Sliding track — width = 100% * number of slides, shifted per-slide */}
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        width: `${total * 100}%`,
                        transform: `translateX(-${current * (100 / total)}%)`,
                    }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="shrink-0" style={{ width: `${100 / total}%` }}>
                            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

                                    {/* Text column */}
                                    <div className="w-full lg:w-1/2 min-h-[340px] flex flex-col justify-center">
                                        <span className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-highlight mb-4 block">
                                            {slide.eyebrow}
                                        </span>
                                        <h1 className="font-display text-4xl md:text-5xl text-brand-ink leading-[1.12] mb-6 font-semibold">
                                            {slide.headline}
                                        </h1>
                                        <p className="font-sans text-base md:text-lg text-text-muted mb-7 max-w-lg leading-relaxed">
                                            {slide.body}
                                        </p>

                                        <a href="#brochure" className="inline-flex items-center gap-1.5 font-sans font-semibold text-brand-highlight mb-8 hover:gap-2.5 transition-all">
                                            Download brochure
                                            <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
                                        </a>

                                        <div className="flex flex-wrap gap-4">
                                            <Link
                                                to="/contact"
                                                className="bg-brand-dark text-white px-7 py-3.5 rounded-full font-sans font-semibold text-sm hover:bg-brand-ink transition-colors shadow-lg"
                                            >
                                                Contact now
                                            </Link>
                                            <Link
                                                to="/schedule"
                                                className="border-2 border-brand-dark/20 text-brand-ink px-7 py-3.5 rounded-full font-sans font-semibold text-sm hover:border-brand-dark hover:bg-white transition-colors"
                                            >
                                                Schedule call
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Photo + floating cards — square/rectangle frame instead of the organic blob */}
                                    <div className="w-full lg:w-1/2 flex justify-center relative">
                                        <div className="relative w-[480px] h-[420px] md:w-[440px] md:h-[480px]">
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-mint via-brand-highlight/40 to-brand-blue/30 overflow-hidden shadow-2xl">
                                                <img
                                                    src={slide.photo.src}
                                                    onError={(e) => { e.target.src = slide.photo.fallback; }}
                                                    alt=""
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="absolute -top-4 -right-2 md:right-2 w-[190px] bg-white rounded-2xl shadow-xl p-4 border border-black/5">
                                                <div className="flex gap-0.5 text-brand-orange mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className="material-symbols-rounded text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    ))}
                                                </div>
                                                <p className="font-sans text-[11px] font-bold text-brand-ink mb-1">{slide.testimonial.name}</p>
                                                <p className="font-sans text-[11px] text-text-muted leading-snug">{slide.testimonial.quote}</p>
                                            </div>

                                            <div className="absolute top-[38%] -left-6 md:-left-10 bg-brand-mint rounded-2xl shadow-xl p-4 w-[150px] border border-white/40">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="material-symbols-rounded text-brand-dark text-[18px]">{slide.badge.icon}</span>
                                                    <span className="font-display text-lg font-bold text-brand-dark">{slide.badge.label}</span>
                                                </div>
                                                <p className="font-sans text-[11px] text-brand-dark/70 leading-snug">{slide.badge.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots — outside the sliding track so they don't move with it */}
            <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex items-center gap-2 mt-12">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            aria-label={`Show slide ${index + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === current ? 'w-7 bg-brand-highlight' : 'w-1.5 bg-brand-ink/15 hover:bg-brand-ink/30'}`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
}