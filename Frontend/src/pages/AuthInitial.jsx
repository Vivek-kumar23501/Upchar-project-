
import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthInitial() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">

            <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg min-h-[450px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300">

                {/* Close Button */}
                <div className="flex justify-between items-center mb-6">
                    <div />

                    <Link
                        to="/"
                        className="text-gray-400 hover:text-brand-dark transition-colors ml-auto bg-gray-50 rounded-full p-1"
                    >
                        <span className="material-symbols-rounded text-[24px]">
                            close
                        </span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex-grow flex flex-col justify-center mt-4">

                    <div className="text-center animate-in slide-in-from-bottom-4 duration-300">

                        {/* Icon */}
                        <div className="w-16 h-16 bg-brand-mint text-brand-dark rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-rounded text-[32px]">
                                health_metrics
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-3">
                            Welcome to Vitalis Nexus
                        </h2>

                        <p className="text-text-muted font-sans text-sm mb-10 px-4">
                            Connect with the rural healthcare network to access visual tools,
                            locators, and teleconsultations.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col gap-4">

                            {/* Login */}
                            <Link
                                to="/auth/login"
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold font-sans hover:bg-brand-highlight transition-colors shadow-lg text-center"
                            >
                                Log In
                            </Link>

                            {/* Signup */}
                            <Link
                                to="/auth/signup"
                                className="w-full bg-brand-mint text-brand-dark py-4 rounded-xl font-bold font-sans hover:bg-gray-200 transition-colors border border-gray-100 text-center"
                            >
                                Create New Account
                            </Link>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

