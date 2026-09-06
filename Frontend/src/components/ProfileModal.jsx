import React, { useState, useEffect } from 'react';

export default function ProfileModal({ isOpen, onClose, user, setUser, profileImage, setProfileImage }) {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', mobile: '', district: '', block: '', village: '', password: ''
    });
    
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Populate form when modal opens using the correct backend structure
    useEffect(() => {
        if (user && isOpen) {
            // Split fullname into first and last name for the UI
            const nameParts = user.fullname ? user.fullname.split(' ') : ['', ''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setFormData({
                firstName: firstName,
                lastName: lastName,
                mobile: user.mobile || '',
                // Extract from nested location object
                district: user.location?.district || '',
                block: user.location?.block || '',
                village: user.location?.village || '',
                password: '' // Require fresh password entry
            });
            setPhotoPreview(profileImage);
            setMessage({ text: '', type: '' });
        }
    }, [user, profileImage, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1048576) {
            setMessage({ text: 'Image must be under 1MB', type: 'error' });
            return;
        }
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setMessage({ text: '', type: '' });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!formData.password) {
            setMessage({ text: 'Password is required to save changes.', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: 'Saving changes...', type: 'success' });

        try {
            let finalProfilePicUrl = user.profilePic;

            // 1. Upload new image to Google Drive if selected
            if (photoFile) {
                setMessage({ text: 'Uploading new profile picture...', type: 'success' });
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
                    throw new Error("Failed to upload image.");
                }
            }

            // 2. Update user data in backend
            setMessage({ text: 'Verifying password and updating...', type: 'success' });
            
            // Adjust this URL to your local/production backend endpoint
            const response = await fetch(`http://localhost:8080/update/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: `${formData.firstName} ${formData.lastName}`.trim(),
                    mobile: formData.mobile,
                    district: formData.district,
                    block: formData.block,
                    village: formData.village,
                    password: formData.password,
                    profilePic: finalProfilePicUrl
                })
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Update Local Storage & React State to match backend structure
                const updatedUser = { 
                    ...user, 
                    fullname: `${formData.firstName} ${formData.lastName}`.trim(),
                    mobile: formData.mobile,
                    location: {
                        district: formData.district,
                        block: formData.block,
                        village: formData.village
                    },
                    profilePic: finalProfilePicUrl 
                };
                
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Match your dashboard auth key
                setUser(updatedUser);
                
                if (photoFile) {
                    setProfileImage(photoPreview);
                }

                setMessage({ text: 'Profile updated successfully!', type: 'success' });
                setTimeout(() => onClose(), 1500);
            } else {
                setMessage({ text: data.message || 'Update failed.', type: 'error' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Network error occurred.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined}></div>
            
            {/* Added max-h-[90vh] and flex-col to constrain height */}
            <div className="relative bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                
                {/* Pinned Header (shrink-0 prevents it from squishing) */}
                <div className="bg-[#fbf2ed] px-6 py-4 flex justify-between items-center border-b border-[#bec9c2]/30 shrink-0">
                    <h2 className="text-xl font-bold text-[#004d37]">Edit Profile</h2>
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#efe6e2] text-[#3f4944] transition-colors disabled:opacity-50">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                {/* Scrollable Form (overflow-y-auto allows vertical scrolling inside) */}
                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-5 overflow-y-auto">
                    
                    {/* Image Upload Area */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-24 h-24 rounded-full border-4 border-[#e9e1dc] overflow-hidden bg-gray-100 group shrink-0">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-rounded text-[40px]">person</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="material-symbols-rounded text-white">photo_camera</span>
                                <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>
                        <p className="text-xs text-[#6f7a73] font-medium">Click to change photo</p>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] text-sm transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] text-sm transition-all" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">Mobile Number</label>
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#004d37] focus:ring-1 focus:ring-[#004d37] text-sm transition-all" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">District</label>
                            <input type="text" name="district" value={formData.district} onChange={handleInputChange} required className="w-full px-3 py-2.5 rounded-xl border border-[#bec9c2] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#004d37] text-sm transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">Block</label>
                            <input type="text" name="block" value={formData.block} onChange={handleInputChange} required className="w-full px-3 py-2.5 rounded-xl border border-[#bec9c2] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#004d37] text-sm transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">Village</label>
                            <input type="text" name="village" value={formData.village} onChange={handleInputChange} required className="w-full px-3 py-2.5 rounded-xl border border-[#bec9c2] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#004d37] text-sm transition-all" />
                        </div>
                    </div>

                    {/* Password Verification Field */}
                    <div className="space-y-1 pt-2 border-t border-gray-100">
                        <label className="text-xs font-bold text-red-600 uppercase tracking-wider ml-1">Enter Password to Confirm</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Required to save changes" required className="w-full px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/30 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-all shrink-0" />
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-xl text-sm font-bold text-center shrink-0 ${message.type === 'success' ? 'bg-[#e8f5e9] text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting || !formData.password} className="w-full shrink-0 bg-[#004d37] text-white py-3.5 rounded-xl font-bold hover:bg-[#00674b] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Saving...' : 'Verify & Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );

}