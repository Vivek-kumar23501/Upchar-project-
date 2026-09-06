import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAuthForm() {
  const navigate = useNavigate();

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

  const [snackbar, setSnackbar] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    let timer;

    if (snackbar.show) {
      timer = setTimeout(() => {
        setSnackbar(prev => ({
          ...prev,
          show: false
        }));
      }, 7000);
    }

    return () => clearTimeout(timer);
  }, [snackbar.show]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === 'mobile' &&
      value !== '' &&
      !/^\d+$/.test(value)
    ) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 1048576) {
      setFileError('Profile picture must be under 1MB.');

      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

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
      setSnackbar({
        show: true,
        message: 'Geolocation is not supported by your browser.',
        type: 'error'
      });

      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();
          const addr = data.address || {};

          setFormData(prev => ({
            ...prev,
            district:
              addr.state_district ||
              addr.district ||
              addr.county ||
              prev.district,

            block:
              addr.county ||
              addr.municipality ||
              addr.state_district ||
              prev.block,

            village:
              addr.village ||
              addr.hamlet ||
              addr.town ||
              addr.city ||
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              prev.village
          }));

          setSnackbar({
            show: true,
            message: 'Location fetched successfully.',
            type: 'success'
          });

        } catch (error) {
          setSnackbar({
            show: true,
            message:
              'Could not fetch precise location. Please enter manually.',
            type: 'error'
          });
        } finally {
          setLocationLoading(false);
        }
      },

      () => {
        setLocationLoading(false);

        setSnackbar({
          show: true,
          message: 'Location access denied or unavailable.',
          type: 'error'
        });
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

  const pwd = formData.password;

  const hasCapital = /[A-Z]/.test(pwd);

  const hasSpecial =
    /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

  const isValidLength =
    pwd.length >= 8 && pwd.length <= 15;

  const isPwdValid =
    hasCapital &&
    hasSpecial &&
    isValidLength;

  let strengthText = '';
  let strengthColor = '';
  let progressWidth = '0%';
  let progressColor = 'bg-transparent';

  if (pwd.length > 0) {
    const conditionsMet = [
      isValidLength,
      hasCapital,
      hasSpecial
    ].filter(Boolean).length;

    if (conditionsMet === 0) {
      strengthText = 'Weak';
      strengthColor = 'text-red-500';
      progressWidth = '25%';
      progressColor = 'bg-red-500';

    } else if (conditionsMet === 1) {
      strengthText = 'Moderate';
      strengthColor = 'text-orange-500';
      progressWidth = '50%';
      progressColor = 'bg-orange-500';

    } else if (conditionsMet === 2) {
      strengthText = 'Good';
      strengthColor = 'text-blue-500';
      progressWidth = '75%';
      progressColor = 'bg-blue-500';

    } else if (conditionsMet === 3) {
      strengthText = 'Best';
      strengthColor = 'text-green-500';
      progressWidth = '100%';
      progressColor = 'bg-green-500';
    }
  }

  const getConfirmStyle = () => {
    if (!formData.confirmPassword) {
      return 'border-gray-200 focus:border-brand-highlight';
    }

    if (formData.confirmPassword === pwd) {
      return 'border-green-500 text-green-700 bg-green-50 focus:border-green-500 focus:ring-green-500';
    }

    return 'border-red-500 text-red-700 bg-red-50 focus:border-red-500 focus:ring-red-500';
  };

  const resetForm = () => {
    setFormData({
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

    setPhotoPreview(null);
    setPhotoFile(null);
    setFileError('');
    setShowPassword(false);

    setSnackbar({
      show: false,
      message: '',
      type: 'success'
    });
  };

  const submitAuth = async (authAction, selectedRole) => {

    if (
      authAction === 'signup' &&
      (!isPwdValid ||
        pwd !== formData.confirmPassword)
    ) {
      return;
    }

    setIsSubmitting(true);

    setSnackbar({
      show: true,
      message: 'Processing...',
      type: 'success'
    });

    try {
      let finalProfilePicUrl = '';

      // =========================
      // PROFILE IMAGE UPLOAD
      // =========================

      if (authAction === 'signup' && photoFile) {

        setSnackbar({
          show: true,
          message: 'Uploading your image ...',
          type: 'success'
        });

        const base64String =
          await convertToBase64(photoFile);

        const appsScriptUrl =
          'https://script.google.com/macros/s/AKfycbxyUIl9Y5wNomf2vp3PWf_JUGIlsF5brGHCckbMasXtdkS7JH8QLrzk4lLsZJ1XnhC2Cw/exec';

        const driveResponse = await fetch(
          appsScriptUrl,
          {
            method: 'POST',
            body: JSON.stringify({
              fileName: photoFile.name,
              mimeType: photoFile.type,
              base64: base64String
            })
          }
        );

        const driveData =
          await driveResponse.json();

        if (driveData.status === 'success') {
          finalProfilePicUrl =
            driveData.fileId;
        } else {
          throw new Error(
            'Google Drive upload failed.'
          );
        }
      }

      // =========================
      // AUTH API
      // =========================

      setSnackbar({
        show: true,
        message: 'Saving account details...',
        type: 'success'
      });

      const url =
        authAction === 'signup'
          ? 'http://localhost:8080/signup'
          : 'http://localhost:8080/login';

      const response = await fetch(url, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          ...formData,
          role: selectedRole,
          profilePic: finalProfilePicUrl
        })
      });

      const data = await response.json();

      // =========================
      // SUCCESS
      // =========================

      if (response.ok) {

        if (authAction === 'login') {
          localStorage.setItem(
            'vitalis_user',
            JSON.stringify(data.user)
          );
        }

        setSnackbar({
          show: true,
          message: data.message,
          type: 'success'
        });

        setTimeout(() => {

          resetForm();

          // =========================
          // REACT ROUTER NAVIGATION
          // =========================

          if (authAction === 'login') {

            if (data.user.role === 'Patient') {
              navigate('/patient-dashboard');
            }

            else if (data.user.role === 'Doctor') {
              navigate('/doctor-dashboard');
            }

            else if (data.user.role === 'Admin') {
              navigate('/admin-dashboard');
            }

            else {
              navigate('/dashboard');
            }

          }

          // Signup ke baad
          else if (authAction === 'signup') {
            navigate('/auth/login');
          }

        }, 1500);

      } else {

        setSnackbar({
          show: true,
          message:
            data.message ||
            'An error occurred.',
          type: 'error'
        });
      }

    } catch (error) {

      console.error(error);

      setSnackbar({
        show: true,
        message:
          'Failed to connect to the server.',
        type: 'error'
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleInputChange,

    fileError,
    photoPreview,
    handlePhotoUpload,

    locationLoading,
    fetchLiveLocation,

    isSubmitting,
    showPassword,
    setShowPassword,

    snackbar,
    setSnackbar,

    pwd,
    hasCapital,
    hasSpecial,
    isValidLength,
    isPwdValid,

    strengthText,
    strengthColor,
    progressWidth,
    progressColor,

    getConfirmStyle,

    submitAuth,
    resetForm
  };
}