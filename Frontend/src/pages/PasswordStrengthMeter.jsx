import React from 'react';

export default function PasswordStrengthMeter({ pwd, isValidLength, hasCapital, hasSpecial, strengthText, strengthColor, progressWidth, progressColor }) {
    if (pwd.length === 0) return null;

    return (
        <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-gray-500">Strength:</span>
                <span className={`text-xs font-bold ${strengthColor}`}>{strengthText}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className={`h-full ${progressColor} transition-all duration-300`} style={{ width: progressWidth }}></div>
            </div>
            <ul className="text-[10px] font-sans font-medium space-y-1">
                <li className={`flex items-center gap-1 ${isValidLength ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="material-symbols-rounded text-[12px]">{isValidLength ? 'check_circle' : 'radio_button_unchecked'}</span> 8-15 chars
                </li>
                <li className={`flex items-center gap-1 ${hasCapital ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="material-symbols-rounded text-[12px]">{hasCapital ? 'check_circle' : 'radio_button_unchecked'}</span> 1 Capital letter
                </li>
                <li className={`flex items-center gap-1 ${hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="material-symbols-rounded text-[12px]">{hasSpecial ? 'check_circle' : 'radio_button_unchecked'}</span> 1 Special char
                </li>
            </ul>
        </div>
    );
}