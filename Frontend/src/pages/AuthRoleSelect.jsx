import React from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
    { name: 'Patient', icon: 'person' },
    { name: 'ASHA Worker', icon: 'diversity_3' },
    { name: 'Hospital', icon: 'local_hospital' },
    { name: 'Doctor', icon: 'medical_services' },
    { name: 'Nurse', icon: 'healing' },
    { name: 'Admin', icon: 'admin_panel_settings' }
];

export default function AuthRoleSelect({ onClose }) {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg min-h-[450px] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-300">

                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/auth')} className="text-gray-400 hover:text-brand-dark transition-colors flex items-center gap-1 font-sans font-bold text-sm">
                        <span className="material-symbols-rounded text-[20px]">arrow_back</span> Back
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-brand-dark transition-colors ml-auto bg-gray-50 rounded-full p-1">
                        <span className="material-symbols-rounded text-[24px]">close</span>
                    </button>
                </div>

                <div className="flex-grow flex flex-col justify-center mt-4">
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2 text-center">Log in as...</h2>
                        <p className="text-text-muted font-sans text-sm mb-8 text-center">Select your account type to continue.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {roles.map((role) => (
                                <button
                                    key={role.name}
                                    onClick={() => navigate(`/auth/login/${encodeURIComponent(role.name)}`)}
                                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-brand-highlight hover:bg-brand-mint/30 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-500 group-hover:text-brand-highlight group-hover:shadow-md transition-all">
                                        <span className="material-symbols-rounded text-[24px]">{role.icon}</span>
                                    </div>
                                    <span className="font-sans font-bold text-sm text-brand-dark">{role.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}