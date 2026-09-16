
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Snackbar from './Snackbar';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    // Email signup page se receive hoga
    const [email, setEmail] = useState(
        location.state?.email || ''
    );

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: ''
    });

    const handleOtpChange = (e) => {
        const value = e.target.value;

        // Only numbers and maximum 4 digits
        if (/^\d{0,4}$/.test(value)) {
            setOtp(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setSnackbar({
                show: true,
                message: 'Email is required.',
                type: 'error'
            });
            return;
        }

        if (otp.length !== 4) {
            setSnackbar({
                show: true,
                message: 'Please enter the 4-digit OTP.',
                type: 'error'
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch(
                'https://upchar-project.onrender.com/verify-otp',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        otp: Number(otp)
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'OTP verification failed.'
                );
            }

            setSnackbar({
                show: true,
                message:
                    result.message ||
                    'Email verified successfully.',
                type: 'success'
            });

            // Redirect to login after verification
            setTimeout(() => {
                navigate('/auth/login');
            }, 1200);

        } catch (error) {
            console.error('OTP Verification Error:', error);

            setSnackbar({
                show: true,
                message:
                    error.message ||
                    'Something went wrong.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-mint/20 via-white to-brand-blue/10 px-4">

            <Snackbar
                snackbar={snackbar}
                setSnackbar={setSnackbar}
            />

            <div className="w-full max-w-md">

                <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/auth/signup')}
                        className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors mb-8"
                    >
                        <span className="material-symbols-rounded text-[20px]">
                            arrow_back
                        </span>

                        Back
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-5">

                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-brand-highlight/10 text-brand-highlight">
                            <span className="material-symbols-rounded text-[34px]">
                                mark_email_read
                            </span>
                        </div>

                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">

                        <h1 className="text-2xl font-serif font-bold text-brand-dark">
                            Verify Your Email
                        </h1>

                        <p className="mt-2 text-sm text-text-muted leading-relaxed">
                            We have sent a 4-digit OTP to
                        </p>

                        <p className="mt-1 text-sm font-bold text-brand-dark break-all">
                            {email || 'your email'}
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >

                        {/* Email */}
                        <div>

                            <label className="block mb-2 text-sm font-bold text-brand-dark">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight transition-all"
                            />

                        </div>

                        {/* OTP */}
                        <div>

                            <label className="block mb-2 text-sm font-bold text-brand-dark">
                                Enter OTP
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="••••"
                                maxLength={4}
                                required
                                className="w-full px-4 py-4 text-center text-2xl tracking-[0.7em] font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight transition-all"
                            />

                            <p className="mt-2 text-xs text-text-muted text-center">
                                Enter the 4-digit OTP sent to your email.
                            </p>

                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                otp.length !== 4
                            }
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-dark text-white rounded-xl font-bold shadow-lg hover:bg-brand-highlight transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? 'Verifying...'
                                : 'Verify Email'}

                            {!isSubmitting && (
                                <span className="material-symbols-rounded text-[20px]">
                                    verified
                                </span>
                            )}
                        </button>

                    </form>

                    {/* Login */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">

                        <p className="text-sm text-text-muted">
                            Already verified?{' '}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/auth/login')
                                }
                                className="font-bold text-brand-blue hover:underline"
                            >
                                Login
                            </button>
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
}

