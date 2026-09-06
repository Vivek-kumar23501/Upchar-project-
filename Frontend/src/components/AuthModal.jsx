import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [view, setView] = useState('initial');
  const [authAction, setAuthAction] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    abhaId: '',
    password: '',
    confirmPassword: '',
    district: '',
    block: '',
    village: ''
  });

  const [fileError, setFileError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });

  // Auto-hide Snackbar after 7 seconds
  useEffect(() => {
    let timer;
    if (snackbar.show) {
      timer = setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [snackbar.show]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);

    };
  }, [photoPreview]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile' && value !== '' && !/^\d+$/.test(value)) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      setFileError('Profile picture must be under 1MB.');
      if (photoPreview) URL.revokeObjectURL(photoPreview);

      setPhotoPreview(null);
      setPhotoFile(null);
      return;
    }

    setFileError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      setSnackbar({ show: true, message: "Geolocation is not supported by your browser.", type: 'error' });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.address || {};

          setFormData(prev => ({
            ...prev,
            district: addr.state_district || addr.district || addr.county || prev.district,
            block: addr.county || addr.municipality || addr.state_district || prev.block,
            village: addr.village || addr.hamlet || addr.town || addr.city || addr.suburb || addr.neighbourhood || addr.residential || prev.village
          }));
          setSnackbar({ show: true, message: "Location fetched successfully.", type: 'success' });
        } catch (error) {
          setSnackbar({ show: true, message: "Could not fetch precise location. Please enter manually.", type: 'error' });
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        setSnackbar({ show: true, message: "Location access denied or unavailable.", type: 'error' });
      }
    );
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authAction === 'signup' && (!isPwdValid || pwd !== formData.confirmPassword)) {
      return;
    }

    setIsSubmitting(true);
    setSnackbar({ show: true, message: 'Processing...', type: 'success' });

    try {
      let finalProfilePicUrl = '';

      // 1. Upload to Google Drive via Apps Script if an image is selected
      if (authAction === 'signup' && photoFile) {
        setSnackbar({ show: true, message: 'Uploading your image ...', type: 'success' });

        const base64String = await convertToBase64(photoFile);


        const appsScriptUrl = "https://script.google.com/macros/s/AKfycbxyUIl9Y5wNomf2vp3PWf_JUGIlsF5brGHCckbMasXtdkS7JH8QLrzk4lLsZJ1XnhC2Cw/exec";

        const driveResponse = await fetch(appsScriptUrl, {
          method: "POST",
          body: JSON.stringify({
            fileName: photoFile.name,
            mimeType: photoFile.type,
            base64: base64String
          })
        });

        const driveData = await driveResponse.json();

        if (driveData.status === "success") {
          finalProfilePicUrl = driveData.fileId;
        } else {
          throw new Error("Google Drive upload failed.");
        }
      }

      // 2. Send the JSON data to your local backend
      setSnackbar({ show: true, message: 'Saving account details...', type: 'success' });

      const url = authAction === 'signup'
        ? 'http://localhost:5000/api/auth/signup'
        : 'http://localhost:5000/api/auth/login';

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
          profilePic: finalProfilePicUrl
        }),
      });

      const data = await response.json();

if (response.ok) {
        // 1. Save the user data to localStorage so the dashboard can read it
        if (authAction === 'login') {
          localStorage.setItem('vitalis_user', JSON.stringify(data.user));
        }

        setSnackbar({ show: true, message: data.message, type: 'success' });
        
        setTimeout(() => {
          handleClose();
          
          // 2. Redirect to the dashboard!
          if (authAction === 'login' && data.user.role === 'Patient') {
            navigate('/patient-dashboard');
          }
        }, 1500);
        
      } else {
        setSnackbar({ show: true, message: data.message || 'An error occurred.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ show: true, message: "Failed to connect to the server.", type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pwd = formData.password;
  const hasCapital = /[A-Z]/.test(pwd);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
  const isValidLength = pwd.length >= 8 && pwd.length <= 15;
  const isPwdValid = hasCapital && hasSpecial && isValidLength;

  let strengthText = "";
  let strengthColor = "";
  let progressWidth = "0%";
  let progressColor = "bg-transparent";

  if (pwd.length > 0) {
    const conditionsMet = [isValidLength, hasCapital, hasSpecial].filter(Boolean).length;
    if (conditionsMet === 0) {
      strengthText = "Weak"; strengthColor = "text-red-500"; progressWidth = "25%"; progressColor = "bg-red-500";
    } else if (conditionsMet === 1) {
      strengthText = "Moderate"; strengthColor = "text-orange-500"; progressWidth = "50%"; progressColor = "bg-orange-500";
    } else if (conditionsMet === 2) {
      strengthText = "Good"; strengthColor = "text-blue-500"; progressWidth = "75%"; progressColor = "bg-blue-500";
    } else if (conditionsMet === 3) {
      strengthText = "Best"; strengthColor = "text-green-500"; progressWidth = "100%"; progressColor = "bg-green-500";
    }
  }

  const getConfirmStyle = () => {
    if (!formData.confirmPassword) return 'border-gray-200 focus:border-brand-highlight';
    if (formData.confirmPassword === pwd) return 'border-green-500 text-green-700 bg-green-50 focus:border-green-500 focus:ring-green-500';
    return 'border-red-500 text-red-700 bg-red-50 focus:border-red-500 focus:ring-red-500';
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView('initial');
      setAuthAction('');
      setSelectedRole('');
      setFormData({ firstName: '', lastName: '', email: '', mobile: '', abhaId: '', password: '', confirmPassword: '', district: '', block: '', village: '' });
      setPhotoPreview(null);
      setPhotoFile(null);
      setFileError('');
      setShowPassword(false);
      setSnackbar({ show: false, message: '', type: 'success' });
    }, 300);
  };

  const startFlow = (action) => {
    setAuthAction(action);
    if (action === 'signup') {
      setSelectedRole('Patient');
      setView('form');
    } else {
      setView('role-selection');
    }
  };

  const goBack = () => {
    if (view === 'form') {
      if (authAction === 'signup') setView('initial');
      else setView('role-selection');
    } else if (view === 'role-selection') {
      setView('initial');
    }
  };

  const roles = [
    { name: 'Patient', icon: 'person' },
    { name: 'ASHA Worker', icon: 'diversity_3' },
    { name: 'Hospital', icon: 'local_hospital' },
    { name: 'Doctor', icon: 'medical_services' },
    { name: 'Nurse', icon: 'healing' },
    { name: 'Admin', icon: 'admin_panel_settings' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">

      {/* Custom Snackbar Notification */}
      {snackbar.show && (
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-6 fade-in duration-300 w-[90%] max-w-md ${snackbar.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
          <span className="material-symbols-rounded text-[24px] shrink-0">
            {snackbar.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <p className="font-sans font-medium text-sm pr-6 leading-tight">{snackbar.message}</p>
          <button
            onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${snackbar.type === 'success' ? 'hover:bg-green-100 text-green-600' : 'hover:bg-red-100 text-red-600'
              }`}
          >
            <span className="material-symbols-rounded text-[18px] block">close</span>
          </button>
        </div>
      )}

      <div className={`bg-white rounded-[2rem] p-8 w-full shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-full overflow-y-auto ${authAction === 'signup' && view === 'form' ? 'max-w-2xl' : 'max-w-lg min-h-[450px] flex flex-col'}`}>

        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 py-2">
          {view !== 'initial' ? (
            <button onClick={goBack} className="text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1 font-sans font-bold text-sm">
              <span className="material-symbols-rounded text-[20px]">arrow_back</span> Back
            </button>
          ) : <div />}
          <button onClick={handleClose} className="text-gray-400 hover:text-brand-dark transition-colors ml-auto bg-gray-50 rounded-full p-1">
            <span className="material-symbols-rounded text-[24px]">close</span>
          </button>
        </div>

        <div className={`flex-grow flex flex-col ${authAction !== 'signup' ? 'justify-center mt-4' : ''}`}>

          {/* STEP 1: INITIAL ACTION SELECTION */}
          {view === 'initial' && (
            <div className="text-center animate-in slide-in-from-bottom-4 duration-300">
              <div className="w-16 h-16 bg-brand-mint text-brand-dark rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-rounded text-[32px]">health_metrics</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-3">Welcome to Vitalis Nexus</h2>
              <p className="text-text-muted font-sans text-sm mb-10 px-4">
                Connect with the rural healthcare network to access visual tools, locators, and teleconsultations.
              </p>
              <div className="flex flex-col gap-4">
                <button onClick={() => startFlow('login')} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold font-sans hover:bg-brand-highlight transition-colors shadow-lg">Log In</button>
                <button onClick={() => startFlow('signup')} className="w-full bg-brand-mint text-brand-dark py-4 rounded-xl font-bold font-sans hover:bg-gray-200 transition-colors border border-gray-100">Create New Account</button>
              </div>
            </div>
          )}

          {/* STEP 2: ROLE SELECTION (LOGIN ONLY) */}
          {view === 'role-selection' && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2 text-center">Log in as...</h2>
              <p className="text-text-muted font-sans text-sm mb-8 text-center">Select your account type to continue.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <button key={role.name} onClick={() => { setSelectedRole(role.name); setView('form'); }} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-brand-highlight hover:bg-brand-mint/30 transition-all group">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-500 group-hover:text-brand-highlight group-hover:shadow-md transition-all">
                      <span className="material-symbols-rounded text-[24px]">{role.icon}</span>
                    </div>
                    <span className="font-sans font-bold text-sm text-brand-dark">{role.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC FORM */}
          {view === 'form' && (
            <div className="animate-in slide-in-from-right-8 duration-300 w-full mx-auto">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-brand-highlight text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="material-symbols-rounded text-[28px]">{roles.find(r => r.name === selectedRole)?.icon || 'person'}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-1">
                  {authAction === 'signup' ? 'Create Patient Account' : `Log in as ${selectedRole}`}
                </h2>
                <p className="text-text-muted font-sans text-sm">
                  {authAction === 'signup' ? 'Fill out the details below to join the network.' : `Enter your ${selectedRole.toLowerCase()} credentials below.`}
                </p>
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* ----------------- SIGNUP FIELDS ----------------- */}
                {authAction === 'signup' && (
                  <>
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-300 flex items-center justify-center">
                        {photoPreview ? <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover" /> : <span className="material-symbols-rounded text-gray-400 text-[32px]">person</span>}
                      </div>
                      <div className="flex flex-col flex-grow">
                        <label className="text-sm font-bold text-brand-dark mb-1">Profile Photo (Optional)</label>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-xs text-text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-mint file:text-brand-dark hover:file:bg-brand-highlight hover:file:text-white transition-all cursor-pointer" />
                        {fileError && <span className="text-red-500 text-xs mt-1 font-bold">{fileError}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all" />
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" title="Please enter a valid email address (e.g., user@gmail.com)" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all" />
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number (10 digits)" required pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter exactly 10 digits" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all" />
                    </div>

                    <div className="w-full">
                      <input type="text" name="abhaId" value={formData.abhaId} onChange={handleInputChange} placeholder="ABHA ID / Ayushman Card No. (Optional)" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all" />
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-brand-dark">Address Details</label>
                        <button type="button" onClick={fetchLiveLocation} disabled={locationLoading} className="text-xs bg-brand-blue/10 text-brand-blue font-bold px-3 py-1.5 rounded-full hover:bg-brand-blue hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50">
                          <span className={`material-symbols-rounded text-[14px] ${locationLoading ? 'animate-spin' : ''}`}>my_location</span>
                          {locationLoading ? 'Locating...' : 'Auto-Fill Location'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="District" required className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-brand-highlight font-sans transition-all" />
                        <input type="text" name="block" value={formData.block} onChange={handleInputChange} placeholder="Block / Tehsil" required className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-brand-highlight font-sans transition-all" />
                        <input type="text" name="village" value={formData.village} onChange={handleInputChange} placeholder="Village / City" required className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-brand-highlight font-sans transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Create Password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all pr-12" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                            <span className="material-symbols-rounded text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        </div>

                        {pwd.length > 0 && (
                          <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-bold text-gray-500">Strength:</span>
                              <span className={`text-xs font-bold ${strengthColor}`}>{strengthText}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                              <div className={`h-full ${progressColor} transition-all duration-300`} style={{ width: progressWidth }}></div>
                            </div>
                            <ul className="text-[10px] font-sans font-medium space-y-1">
                              <li className={`flex items-center gap-1 ${isValidLength ? 'text-green-600' : 'text-gray-400'}`}><span className="material-symbols-rounded text-[12px]">{isValidLength ? 'check_circle' : 'radio_button_unchecked'}</span> 8-15 chars</li>
                              <li className={`flex items-center gap-1 ${hasCapital ? 'text-green-600' : 'text-gray-400'}`}><span className="material-symbols-rounded text-[12px]">{hasCapital ? 'check_circle' : 'radio_button_unchecked'}</span> 1 Capital letter</li>
                              <li className={`flex items-center gap-1 ${hasSpecial ? 'text-green-600' : 'text-gray-400'}`}><span className="material-symbols-rounded text-[12px]">{hasSpecial ? 'check_circle' : 'radio_button_unchecked'}</span> 1 Special char</li>
                            </ul>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="relative">
                          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" required disabled={!isPwdValid} className={`w-full px-4 py-3 rounded-xl border font-sans transition-all focus:outline-none focus:ring-1 disabled:opacity-50 disabled:bg-gray-100 ${getConfirmStyle()}`} />
                        </div>
                        {formData.confirmPassword && formData.confirmPassword !== pwd && <p className="text-red-500 text-[11px] font-bold mt-1 px-2">Passwords do not match.</p>}
                        {formData.confirmPassword && formData.confirmPassword === pwd && <p className="text-green-600 text-[11px] font-bold mt-1 px-2">Passwords match perfectly.</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* ----------------- LOGIN FIELDS ----------------- */}
                {authAction === 'login' && (
                  <div className="space-y-4 max-w-sm mx-auto w-full">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" title="Please enter a valid email address" className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all" />
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-brand-highlight focus:ring-1 focus:ring-brand-highlight font-sans transition-all pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                        <span className="material-symbols-rounded text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={(authAction === 'signup' && (!isPwdValid || pwd !== formData.confirmPassword)) || isSubmitting} className="w-full max-w-sm mx-auto bg-brand-dark text-white py-3.5 rounded-xl font-bold font-sans hover:bg-brand-highlight transition-colors mt-2 shadow-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:hover:bg-brand-dark">
                  {isSubmitting ? 'Processing...' : (authAction === 'signup' ? 'Complete Registration' : 'Secure Log In')}
                  {!isSubmitting && <span className="material-symbols-rounded text-[20px]">arrow_forward</span>}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-gray-100 pt-6">
                <p className="text-sm font-sans text-text-muted">
                  {authAction === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => startFlow(authAction === 'login' ? 'signup' : 'login')} className="text-brand-blue font-bold hover:underline focus:outline-none">
                    {authAction === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}