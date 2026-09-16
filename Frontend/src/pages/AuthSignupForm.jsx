
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Snackbar from './Snackbar';
import PasswordStrengthMeter from './PasswordStrengthMeter';

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        district: '',
        block: '',
        village: ''
    });


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

// --- ADD THESE STATES ---
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (photoPreview) URL.revokeObjectURL(photoPreview);
        };
    }, [photoPreview]);

   
      // Handle Photo Upload
   
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1048576) {
            setSnackbar({
                show: true,
                message: 'Profile picture must be under 1MB.',
                type: 'error'
            });
            if (photoPreview) URL.revokeObjectURL(photoPreview);
            setPhotoPreview(null);
            setPhotoFile(null);
            return;
        }

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const [snackbar, setSnackbar] = useState({
        show: false,
        message: '',
        type: ''
    });

    /* =========================
       Handle Input Change
    ========================= */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    /* =========================
       Password Validation
    ========================= */
    const password = formData.password;

    const isValidLength = password.length >= 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isPasswordValid =
        isValidLength &&
        hasCapital &&
        hasSpecial;

    /* =========================
       Password Strength
    ========================= */
    const getPasswordStrength = () => {
        let score = 0;

        if (password.length >= 8) score++;
        if (hasCapital) score++;
        if (hasSpecial) score++;
        if (/[0-9]/.test(password)) score++;

        if (score <= 1) {
            return {
                text: 'Weak Password',
                width: '25%',
                color: 'bg-red-500'
            };
        }

        if (score === 2) {
            return {
                text: 'Medium Password',
                width: '50%',
                color: 'bg-yellow-500'
            };
        }

        if (score === 3) {
            return {
                text: 'Strong Password',
                width: '75%',
                color: 'bg-blue-500'
            };
        }

        return {
            text: 'Very Strong Password',
            width: '100%',
            color: 'bg-green-500'
        };
    };

    const passwordStrength = getPasswordStrength();

    /* =========================
       Get Current Location
    ========================= */
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setSnackbar({
                show: true,
                message:
                    'Geolocation is not supported by your browser.',
                type: 'error'
            });

            return;
        }

        setIsGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                try {
                    /*
                     * Reverse Geocoding API
                     * No API key required
                     */
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );

                    if (!response.ok) {
                        throw new Error(
                            'Unable to fetch location details.'
                        );
                    }

                    const data = await response.json();

                    console.log(
                        'Reverse Geocoding Response:',
                        data
                    );

                    /*
                     * Administrative areas
                     */
                    const administrativeAreas =
                        data.localityInfo?.administrative || [];

                    /*
                     * Find District
                     */
                    const districtData =
                        administrativeAreas.find((item) => {
                            const description =
                                item.description?.toLowerCase() || '';

                            return (
                                description.includes('district') ||
                                description.includes('county')
                            );
                        });

                    /*
                     * Find Block / Tehsil
                     */
                    const blockData =
                        administrativeAreas.find((item) => {
                            const description =
                                item.description?.toLowerCase() || '';

                            return (
                                description.includes('tehsil') ||
                                description.includes('subdistrict') ||
                                description.includes('block')
                            );
                        });

                    /*
                     * District fallback
                     */
                    const district =
                        districtData?.name ||
                        data.city ||
                        data.principalSubdivision ||
                        '';

                    /*
                     * Block fallback
                     */
                    const block =
                        blockData?.name ||
                        data.locality ||
                        '';

                    /*
                     * Village / City
                     */
                    const village =
                        data.locality ||
                        data.city ||
                        data.localityInfo?.informative?.find(
                            (item) =>
                                item.description
                                    ?.toLowerCase()
                                    .includes('village')
                        )?.name ||
                        '';

                    console.log('Detected District:', district);
                    console.log('Detected Block:', block);
                    console.log('Detected Village:', village);

                    /*
                     * Update form
                     */
                    setFormData((prev) => ({
                        ...prev,
                        district: district,
                        block: block,
                        village: village
                    }));

                    setSnackbar({
                        show: true,
                        message:
                            'Location detected successfully.',
                        type: 'success'
                    });

                } catch (error) {
                    console.error(
                        'Reverse Geocoding Error:',
                        error
                    );

                    setSnackbar({
                        show: true,
                        message:
                            'Unable to get address from your location.',
                        type: 'error'
                    });

                } finally {
                    setIsGettingLocation(false);
                }
            },

            (error) => {
                console.error(
                    'Geolocation Error:',
                    error
                );

                let message =
                    'Unable to access your location.';

                if (error.code === 1) {
                    message =
                        'Location permission denied. Please allow location access.';
                } else if (error.code === 2) {
                    message =
                        'Your location could not be determined.';
                } else if (error.code === 3) {
                    message =
                        'Location request timed out. Please try again.';
                }

                setSnackbar({
                    show: true,
                    message: message,
                    type: 'error'
                });

                setIsGettingLocation(false);
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    /* =========================
       Signup Submit
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        /* Password validation */
        if (!isPasswordValid) {
            setSnackbar({
                show: true,
                message:
                    'Password must contain 8 characters, one capital letter and one special character.',
                type: 'error'
            });

            return;
        }

        /* Confirm password */
        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setSnackbar({
                show: true,
                message: 'Passwords do not match.',
                type: 'error'
            });

            return;
        }

        /* Mobile validation */
        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            setSnackbar({
                show: true,
                message:
                    'Please enter a valid 10 digit mobile number.',
                type: 'error'
            });

            return;
        }

try {
            setIsSubmitting(true);
            let finalProfilePicUrl = '';

           
            if (photoFile) {
                setSnackbar({ show: true, message: 'Uploading your image...', type: 'success' });
                const base64String = await convertToBase64(photoFile);
                const appsScriptUrl = "https://script.google.com/macros/s/AKfycbxyUIl9Y5wNomf2vp3PWf_JUGIlsF5brGHCckbMasXtdkS7JH8QLrzk4lLsZJ1XnhC2Cw/exec";

                const driveResponse = await fetch(appsScriptUrl, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({
                        uploadType: "profile",
                        fileName: photoFile.name,
                        mimeType: photoFile.type,
                        base64: base64String
                    })
                });

                const driveData = await driveResponse.json();
                if (driveData.status === "success") {
                    finalProfilePicUrl = driveData.fileId;
                } else {
                    throw new Error("Failed to upload profile picture to cloud.");
                }
            }

            setSnackbar({ show: true, message: 'Creating account...', type: 'success' });

            // 2. Send Data to Backend
            const response = await fetch(
                'https://upchar-project.onrender.com/signup',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullname: formData.fullname.trim(),
                        email: formData.email.trim(),
                        mobile: formData.mobile,
                        password: formData.password,
                        district: formData.district.trim(),
                        block: formData.block.trim(),
                        village: formData.village.trim(),
                        profilePic: finalProfilePicUrl 
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    'Registration failed.'
                );
            }

            setSnackbar({
                show: true,

                message:
                    result.message ||
                    'OTP sent to your email.',

                type: 'success'
            });

            /*
             * Backend signup sends OTP.
             * Navigate to OTP verification page.
             */
            setTimeout(() => {
                navigate(
                    '/auth/verify-otp',
                    {
                        state: {
                            email:
                                formData.email.trim()
                        }
                    }
                );
            }, 1000);

        } catch (error) {
            console.error(
                'Signup Error:',
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
        <div className="min-h-screen flex items-center justify-center bg-[#f4f8f6] px-4 py-10 font-sans">
            
            {/* Snackbar */}
            <Snackbar snackbar={snackbar} setSnackbar={setSnackbar} />

            {/* WIDER BENTO CONTAINER: max-w-5xl for horizontal PC view */}
            <div className="w-full max-w-5xl bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

                {/* =========================
                    Header & Title
                ========================= */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#004d37] text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <span className="material-symbols-rounded text-[32px]">person_add</span>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#004d37]">
                                Create Patient Account
                            </h1>
                            <p className="text-sm text-gray-500 font-medium mt-1">
                                Join Vitalis Nexus for premium healthcare access.
                            </p>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/auth')}
                        className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-[#004d37] rounded-full transition-all w-fit"
                    >
                        <span className="material-symbols-rounded text-[18px]">arrow_back</span>
                        Back
                    </button>
                </div>

                {/* =========================
                    Bento Grid Form
                ========================= */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- BENTO BOX 1: Profile Photo (Left Side on PC) --- */}
                    <div className="lg:col-span-4 relative p-6 pt-8 border-2 border-gray-100 rounded-2xl bg-white hover:border-[#004d37]/30 transition-colors flex flex-col items-center justify-center">
                        <label className="absolute -top-3 left-6 bg-white px-2 text-[11px] font-bold text-[#004d37] uppercase tracking-wider">
                            Profile Photo (Optional)
                        </label>
                        
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 shrink-0 flex items-center justify-center border-2 border-gray-200 shadow-sm mb-4">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-rounded text-gray-300 text-[48px]">person</span>
                            )}
                        </div>
                        
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="w-full text-xs text-gray-500 cursor-pointer file:mr-0 file:w-full file:py-2 file:px-4 file:border-0 file:rounded-xl file:text-xs file:font-bold file:bg-[#e8f5e9] file:text-[#004d37] hover:file:bg-[#004d37] hover:file:text-white file:transition-colors file:cursor-pointer"
                        />
                    </div>

                    {/* --- BENTO BOX 2: Personal Info (Right Side on PC) --- */}
                    <div className="lg:col-span-8 relative p-6 pt-8 border-2 border-gray-100 rounded-2xl bg-white hover:border-[#004d37]/30 transition-colors grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="absolute -top-3 left-6 bg-white px-2 text-[11px] font-bold text-[#004d37] uppercase tracking-wider">
                            Personal Information
                        </label>

                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label className="block mb-1.5 text-xs font-bold text-gray-600">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                autoComplete="name"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold text-gray-600">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold text-gray-600">Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="10-digit number"
                                required
                                pattern="[0-9]{10}"
                                maxLength="10"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* --- BENTO BOX 3: Address (Full Width) --- */}
                    <div className="lg:col-span-12 relative p-6 pt-8 border-2 border-gray-100 rounded-2xl bg-[#fbf2ed]/30 hover:border-[#004d37]/30 transition-colors">
                        <label className="absolute -top-3 left-6 bg-white px-2 text-[11px] font-bold text-[#004d37] uppercase tracking-wider">
                            Address Details
                        </label>
                        
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={isGettingLocation}
                            className="absolute -top-4 right-6 px-4 py-1.5 bg-[#e8f5e9] text-[#004d37] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#004d37]/20 hover:bg-[#004d37] hover:text-white transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                            <span className={`material-symbols-rounded text-[16px] ${isGettingLocation ? 'animate-spin' : ''}`}>
                                {isGettingLocation ? 'progress_activity' : 'my_location'}
                            </span>
                            {isGettingLocation ? 'Detecting Location...' : 'Auto Detect'}
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block mb-1.5 text-xs font-bold text-gray-600">District</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block mb-1.5 text-xs font-bold text-gray-600">Block / Tehsil</label>
                                <input
                                    type="text"
                                    name="block"
                                    value={formData.block}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block mb-1.5 text-xs font-bold text-gray-600">Village / City</label>
                                <input
                                    type="text"
                                    name="village"
                                    value={formData.village}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- BENTO BOX 4: Security (Full Width) --- */}
                    <div className="lg:col-span-12 relative p-6 pt-8 border-2 border-gray-100 rounded-2xl bg-white hover:border-[#004d37]/30 transition-colors grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="absolute -top-3 left-6 bg-white px-2 text-[11px] font-bold text-[#004d37] uppercase tracking-wider">
                            Security
                        </label>

                        {/* Password */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold text-gray-600">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create password"
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004d37]"
                                >
                                    <span className="material-symbols-rounded text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="mt-2.5 px-1 flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${passwordStrength.color} transition-all duration-500`} style={{ width: passwordStrength.width }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-1.5 text-xs font-bold text-gray-600">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    required
                                    className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl focus:outline-none focus:ring-1 transition-all text-sm ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                                            : 'border-gray-200 focus:border-[#004d37] focus:ring-[#004d37]'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004d37]"
                                >
                                    <span className="material-symbols-rounded text-[20px]">
                                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-1.5 px-1 text-[10px] font-bold text-red-500 uppercase tracking-wide">
                                    Passwords do not match.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* =========================
                        Submit Button & Login Link
                    ========================= */}
                    <div className="lg:col-span-12 mt-2 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
                        
                        <p className="text-sm text-gray-500 font-medium order-2 sm:order-1">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/auth/login')}
                                className="font-bold text-[#00668a] hover:underline"
                            >
                                Login
                            </button>
                        </p>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isPasswordValid || formData.password !== formData.confirmPassword}
                            className="w-full sm:w-auto order-1 sm:order-2 px-10 py-3.5 bg-[#004d37] text-white rounded-xl font-bold shadow-lg hover:bg-[#00674b] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            {!isSubmitting && <span className="material-symbols-rounded text-[20px]">arrow_forward</span>}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

