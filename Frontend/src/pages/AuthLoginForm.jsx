import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Snackbar from './Snackbar';

export default function AuthLoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: ''
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
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

            // Login API
            const response = await fetch(
                'http://localhost:8080/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: formData.email.trim(),
                        password: formData.password
                    })
                }
            );

            const result = await response.json();

            console.log('Login API Response:', result);

            // API error
            if (!response.ok) {
                throw new Error(
                    result.message || 'Login failed.'
                );
            }

            // --------------------------------
            // Save JWT token
            // --------------------------------

            if (result.token) {
                localStorage.setItem(
                    'token',
                    result.token
                );
            }

            // --------------------------------
            // Save user information
            // --------------------------------

            if (result.user) {
                localStorage.setItem(
                    'user',
                    JSON.stringify(result.user)
                );
            }

            // Debug information
            console.log(
                'Logged-in user:',
                result.user
            );

            console.log(
                'User role:',
                result.user?.role
            );

            // Success message
            setSnackbar({
                show: true,
                message:
                    result.message ||
                    'Login successful.',
                type: 'success'
            });

            // --------------------------------
            // Role Based Navigation
            // --------------------------------

            setTimeout(() => {
                const role =
                    result.user?.role?.toLowerCase();

                console.log(
                    'Redirecting based on role:',
                    role
                );

                switch (role) {
                    // Patient / User
                    case 'user':
                    case 'patient':
                        navigate('/dashboard');
                        break;

                    // Doctor
                    case 'doctor':
                        navigate('/doctor-dashboard');
                        break;

                    // Admin
                    case 'admin':
                        navigate('/admin-dashboard');
                        break;

                    // ASHA
                    case 'asha':
                        navigate('/asha-dashboard');
                        break;

                    // ANM
                    case 'anm':
                        navigate('/anm-dashboard');
                        break;

                    // Unknown role
                    default:
                        console.error(
                            'Unknown user role:',
                            result.user?.role
                        );

                        navigate('/');
                        break;
                }
            }, 1000);

        } catch (error) {
            console.error(
                'Login Error:',
                error
            );

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

            {/* Snackbar */}
            <Snackbar
                snackbar={snackbar}
                setSnackbar={setSnackbar}
            />

            <div className="w-full max-w-md">

                <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/auth')}
                        className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors mb-8"
                    >
                        <span className="material-symbols-rounded text-[20px]">
                            arrow_back
                        </span>

                        Back
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">

                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-brand-highlight/10 text-brand-highlight rounded-full">

                            <span className="material-symbols-rounded text-[34px]">
                                lock_open
                            </span>

                        </div>

                        <h1 className="text-2xl font-serif font-bold text-brand-dark">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-text-muted">
                            Login to access your healthcare account.
                        </p>

                    </div>

                    {/* Login Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >

                        {/* Email */}
                        <div>

                            <label className="block mb-2 text-sm font-bold text-brand-dark">
                                Email Address
                            </label>

                            <div className="relative">

                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                                    mail
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight transition-all"
                                />

                            </div>

                        </div>

                        {/* Password */}
                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label className="text-sm font-bold text-brand-dark">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            '/auth/forgot-password'
                                        )
                                    }
                                    className="text-xs font-bold text-brand-blue hover:underline"
                                >
                                    Forgot Password?
                                </button>

                            </div>

                            <div className="relative">

                                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                                    lock
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight transition-all"
                                />

                                {/* Show / Hide Password */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >

                                    <span className="material-symbols-rounded text-[20px]">
                                        {showPassword
                                            ? 'visibility_off'
                                            : 'visibility'}
                                    </span>

                                </button>

                            </div>

                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-brand-dark text-white rounded-xl font-bold shadow-lg hover:bg-brand-highlight transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {isSubmitting
                                ? 'Logging in...'
                                : 'Login'}

                            {!isSubmitting && (
                                <span className="material-symbols-rounded text-[20px]">
                                    arrow_forward
                                </span>
                            )}

                        </button>

                    </form>

                    {/* Signup */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">

                        <p className="text-sm text-text-muted">

                            Don't have an account?{' '}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        '/auth/signup'
                                    )
                                }
                                className="font-bold text-brand-blue hover:underline"
                            >
                                Create Account
                            </button>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}