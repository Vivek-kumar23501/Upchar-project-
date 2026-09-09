import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AiDiagnosisModal from '../components/AiDiagnosisModal';
import ProfileModal from '../components/ProfileModal';
import PatientMainContent from '../components/PatientMainContent';

export default function PatientDashboard() {

    const navigate = useNavigate();

    /* =========================
       States
    ========================= */
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    /* =========================
       Session Management
    ========================= */
    useEffect(() => {
        try {
            const session = localStorage.getItem('user');

            if (!session) {
                navigate('/', { replace: true });
                return;
            }

            const parsedUser = JSON.parse(session);
            console.log('Patient Dashboard User:', parsedUser);
            console.log('Patient Dashboard Role:', parsedUser?.role);

            const role = parsedUser?.role?.toLowerCase();

            if (role !== 'user' && role !== 'patient') {
                console.error('Access denied. Role:', role);
                navigate('/', { replace: true });
                return;
            }

            setUser(parsedUser);

        } catch (error) {
            console.error('Session Error:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/', { replace: true });
        }
    }, [navigate]);

    /* =========================
       Profile Image
    ========================= */
    useEffect(() => {
        if (!user || !user.profilePic) return;

        // Check Local Storage Cache
        const cachedImage = localStorage.getItem(`profile_image_${user.profilePic}`);
        if (cachedImage) {
            setProfileImage(cachedImage);
            return;
        }

        // Google Apps Script
        const appsScriptUrl =
            'https://script.google.com/macros/s/AKfycbxyUIl9Y5wNomf2vp3PWf_JUGIlsF5brGHCckbMasXtdkS7JH8QLrzk4lLsZJ1XnhC2Cw/exec';

        fetch(`${appsScriptUrl}?id=${user.profilePic}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch profile image');
                return res.json();
            })
            .then((data) => {
                if (data.status === 'success' && data.base64) {
                    const imgData = data.base64.startsWith('data:image')
                        ? data.base64
                        : `data:image/jpeg;base64,${data.base64}`;

                    setProfileImage(imgData);
                    localStorage.setItem(`profile_image_${user.profilePic}`, imgData);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch profile image:', err);
            });
    }, [user]);

    /* =========================
       Loading
    ========================= */
    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#fff8f5]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#004d37]/10 flex items-center justify-center animate-pulse">
                        <span className="material-symbols-rounded text-[28px] text-[#004d37]">health_metrics</span>
                    </div>
                    <span className="font-bold text-[#004d37] text-sm">Loading Upchar...</span>
                </div>
            </div>
        );
    }


    return (
        <>
            {/* Main content — layout is managed by PatientLayout */}
            <PatientMainContent
                user={user}
                profileImage={profileImage}
                setIsAiOpen={setIsAiOpen}
                setIsProfileOpen={setIsProfileOpen}
            />

            {/* AI Diagnosis Modal */}
            <AiDiagnosisModal
                isOpen={isAiOpen}
                onClose={() => setIsAiOpen(false)}
                user={user}
            />

            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                setUser={setUser}
                profileImage={profileImage}
                setProfileImage={setProfileImage}
            />
        </>
    );
}