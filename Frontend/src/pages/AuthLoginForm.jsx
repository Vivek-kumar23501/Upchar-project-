
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Snackbar from './Snackbar';

export default function AuthLoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim() || !formData.password) {
            setSnackbar({
                show: true,
                message: 'Please enter email and password.',
                type: 'error'
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('https://upchar-project.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password
                }),
            });

            const result = await response.json();

            console.log('Login API Response:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Login failed.');
            }

            if (result.token) {
                localStorage.setItem('token', result.token);
            }

            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            setSnackbar({
                show: true,
                message: result.message || 'Login successful.',
                type: 'success'
            });

            setTimeout(() => {
                const role = result.user?.role?.toLowerCase();

                if (role === 'user') {
                    navigate('/dashboard');
                } else if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            }, 1000);

        } catch (error) {
            console.error('Login Error:', error);

            setSnackbar({
                show: true,
                message: error.message || 'Something went wrong.',
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col bg-[#fdf6f2]">

            {/* Snackbar */}
            <Snackbar snackbar={snackbar} setSnackbar={setSnackbar} />

            {/* ── Top accent bar ── */}
            <div className="h-1 bg-gradient-to-r from-[#004d37] via-[#00a36c] to-[#004d37]" />

            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-4 pt-safe">
                <button
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="w-9 h-9 rounded-full bg-white border border-[#e9e1dc] flex items-center justify-center shadow-sm 
                        hover:bg-[#f0ebe7] transition-all active:scale-90"
                >
                    <span className="material-symbols-rounded text-[20px] text-[#3f4944]">
                        arrow_back
                    </span>
                </button>

                <Link
                    to="/"
                    className="flex items-center gap-1.5 no-underline ml-1"
                >
                    <span className="material-symbols-rounded text-[20px] text-[#004d37]">
                        health_metrics
                    </span>

                    <span className="font-serif font-bold text-lg tracking-widest text-[#004d37] uppercase">
                        UPCHAR
                    </span>
                </Link>
            </div>

            {/* ── Main card ── */}
            <div className="flex-1 flex items-start justify-center px-4 pb-8 pt-4">
                <div className="w-full max-w-md animate-fade-up">

                    {/* Icon + Heading */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 rounded-3xl bg-[#004d37]/10 flex items-center justify-center mb-4 shadow-inner-top">
                            <span className="material-symbols-rounded text-[34px] text-[#004d37]">
                                lock_open
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#004d37]">
                            Welcome Back
                        </h1>

                        <p className="mt-1.5 text-sm text-[#6f7a73]">
                            Login to access your healthcare account.
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="bg-white rounded-3xl p-6 shadow-card border border-[#e9e1dc]/50">

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Email field */}
                            <div className="relative">
                                <div
                                    className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 
                                    ${
                                        focusedField === 'email'
                                            ? 'border-[#004d37] bg-white shadow-[0_0_0_3px_rgba(0,77,55,0.1)]'
                                            : 'border-[#e9e1dc] bg-[#f7f3f0]'
                                    }`}
                                >
                                    <span
                                        className={`material-symbols-rounded text-[20px] ml-4 transition-colors duration-200 
                                        ${
                                            focusedField === 'email'
                                                ? 'text-[#004d37]'
                                                : 'text-[#9aa39e]'
                                        }`}
                                    >
                                        mail
                                    </span>

                                    <input
                                        type="email"
                                        name="email"
                                        id="login-email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Email address"
                                        required
                                        autoComplete="email"
                                        className="flex-1 bg-transparent border-none outline-none px-3 py-4 text-[15px] text-[#1e1b18] placeholder-[#9aa39e]"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="relative">
                                <div
                                    className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 
                                    ${
                                        focusedField === 'password'
                                            ? 'border-[#004d37] bg-white shadow-[0_0_0_3px_rgba(0,77,55,0.1)]'
                                            : 'border-[#e9e1dc] bg-[#f7f3f0]'
                                    }`}
                                >
                                    <span
                                        className={`material-symbols-rounded text-[20px] ml-4 transition-colors duration-200 
                                        ${
                                            focusedField === 'password'
                                                ? 'text-[#004d37]'
                                                : 'text-[#9aa39e]'
                                        }`}
                                    >
                                        lock
                                    </span>

                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="login-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Password"
                                        required
                                        autoComplete="current-password"
                                        className="flex-1 bg-transparent border-none outline-none px-3 py-4 text-[15px] text-[#1e1b18] placeholder-[#9aa39e]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="mr-4 text-[#9aa39e] hover:text-[#3f4944] transition-colors"
                                    >
                                        <span className="material-symbols-rounded text-[20px]">
                                            {showPassword
                                                ? 'visibility_off'
                                                : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Forgot password */}
                            <div className="flex justify-end -mt-2">
                                <button
                                    type="button"
                                    onClick={() => navigate('/auth/forgot-password')}
                                    className="text-xs font-bold text-[#1a65ff] hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                id="login-submit"
                                disabled={isSubmitting}
                                className="btn-primary py-4 rounded-2xl text-base mt-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            />
                                        </svg>

                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        Login

                                        <span className="material-symbols-rounded text-[20px]">
                                            arrow_forward
                                        </span>
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Signup link */}
                        <div className="mt-6 pt-5 border-t border-[#f0ebe7] text-center">
                            <p className="text-sm text-[#6f7a73]">
                                Don't have an account?{' '}

                                <button
                                    type="button"
                                    onClick={() => navigate('/auth/signup')}
                                    className="font-bold text-[#004d37] hover:underline"
                                >
                                    Create Account
                                </button>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
