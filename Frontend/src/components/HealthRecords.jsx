import React, { useState, useEffect } from 'react';

export default function HealthRecords({ user }) {
    const [records, setRecords] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [docName, setDocName] = useState('');
    const [file, setFile] = useState(null);
    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });


    const REPORT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxyUIl9Y5wNomf2vp3PWf_JUGIlsF5brGHCckbMasXtdkS7JH8QLrzk4lLsZJ1XnhC2Cw/exec";

    // Safely get the user ID
    const userId = user?.id || user?._id;

    // 1. Fetch records from MongoDB when the component loads
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/api/auth/records/${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.records) {
                        setRecords(data.records);
                    }
                    setFetching(false);
                })
                .catch(err => {
                    console.error("Failed to fetch records:", err);
                    setFetching(false);
                });
        } else {
            setFetching(false);
        }
    }, [userId]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size <= 5242880) { // 5MB limit
            setFile(selectedFile);
        } else {
            showSnackbar('File must be under 5MB', 'error');
            e.target.value = null;
        }
    };

    const convertToBase64 = (fileObj) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileObj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !docName || !userId) return;

        setUploading(true);
        showSnackbar('Uploading document securely to Drive...', 'success');

        try {
            const base64String = await convertToBase64(file);

            // Step A: Upload file to Google Drive via Apps Script
            const response = await fetch(REPORT_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    fileName: docName,
                    mimeType: file.type,
                    base64: base64String
                })
            });

            const data = await response.json();

            if (data.status === "success") {
                
                const newRecord = {
                    id: Date.now().toString(),
                    name: docName,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    type: file.type.includes('pdf') ? 'PDF' : 'Image',
                    link: data.fileUrl,
                    isShared: false
                };

                // Step B: Save record metadata to MongoDB so it persists on refresh
                const dbResponse = await fetch(`https://upchar-project.onrender.com/api/auth/records/${userId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newRecord)
                });

                if (!dbResponse.ok) {
                    throw new Error("Google Drive upload succeeded, but database save failed.");
                }
                
                // Step C: Update UI instantly
                setRecords(prevRecords => [newRecord, ...prevRecords]);
                showSnackbar('Document uploaded & saved successfully!', 'success');
                
                // Reset form
                setFile(null);
                setDocName('');
                document.getElementById('fileUploadInput').value = ""; 
            } else {
                throw new Error("Failed to upload to Google Drive. Check your Apps Script URL.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            showSnackbar(error.message || 'Upload failed. Please try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleShare = (link) => {
        if (link === "#") {
            showSnackbar('This is a demo file. Upload a real file to share!', 'error');
            return;
        }
        navigator.clipboard.writeText(link);
        showSnackbar('Secure link copied to clipboard! Send this to your doctor.', 'success');
    };

    const showSnackbar = (msg, type) => {
        setSnackbar({ show: true, message: msg, type });
        setTimeout(() => setSnackbar({ show: false, message: '', type: 'success' }), 4000);
    };

    return (
        <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-[#bec9c2]/40 shadow-sm relative overflow-hidden">
            
            {/* Snackbar */}
            {snackbar.show && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-md text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-4 ${snackbar.type === 'success' ? 'bg-[#e8f5e9] text-green-700' : 'bg-red-50 text-red-600'}`}>
                    <span className="material-symbols-rounded text-[18px]">{snackbar.type === 'success' ? 'check_circle' : 'error'}</span>
                    {snackbar.message}
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-[#004d37]">Medical Records</h3>
                    <p className="text-[#3f4944] text-sm mt-1">Upload and share your lab reports and prescriptions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Upload Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleUpload} className="bg-[#fbf2ed] p-5 rounded-[1.5rem] border border-[#bec9c2]/30 flex flex-col gap-4">
                        <h4 className="font-bold text-[#1e1b18]">Upload New Document</h4>
                        
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">Document Name</label>
                            <input 
                                type="text" 
                                value={docName} 
                                onChange={(e) => setDocName(e.target.value)} 
                                required 
                                placeholder="e.g. Blood Test Oct 2026"
                                className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2] bg-white focus:outline-none focus:border-[#004d37] text-sm transition-all" 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#3f4944] uppercase tracking-wider ml-1">Select File (PDF/Image)</label>
                            <input 
                                id="fileUploadInput"
                                type="file" 
                                onChange={handleFileChange} 
                                required 
                                accept="image/*,.pdf"
                                className="w-full text-xs text-[#6f7a73] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#004d37]/10 file:text-[#004d37] hover:file:bg-[#004d37]/20 transition-all cursor-pointer bg-white border border-[#bec9c2] rounded-xl p-1" 
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={uploading || !file || !docName} 
                            className="w-full mt-2 bg-[#004d37] text-white py-3 rounded-xl font-bold hover:bg-[#00674b] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>Uploading... <span className="material-symbols-rounded animate-spin text-[18px]">sync</span></>
                            ) : (
                                <>Upload Record <span className="material-symbols-rounded text-[18px]">cloud_upload</span></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Records List */}
                <div className="lg:col-span-2 space-y-3">
                    {fetching ? (
                        <div className="text-center py-10 text-[#6f7a73]">
                            <span className="material-symbols-rounded text-[40px] animate-spin mb-2 block">sync</span>
                            <p className="font-medium">Loading your records...</p>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-10 text-[#6f7a73]">
                            <span className="material-symbols-rounded text-[40px] opacity-50 mb-2 block">folder_open</span>
                            <p className="font-medium">No medical records uploaded yet.</p>
                        </div>
                    ) : (
                        records.map((record) => (
                            <div key={record.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-[1.5rem] border border-[#bec9c2]/40 hover:shadow-md transition-all bg-white group">
                                
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${record.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                        <span className="material-symbols-rounded text-[24px]">
                                            {record.type === 'PDF' ? 'picture_as_pdf' : 'image'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1e1b18] text-base group-hover:text-[#004d37] transition-colors line-clamp-1">{record.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[11px] font-bold text-[#6f7a73] uppercase tracking-wider">{record.date}</p>
                                            {record.isShared && (
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <span className="material-symbols-rounded text-[12px]">link</span> Shared
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <a 
                                        href={record.link} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex-1 sm:flex-none text-center text-sm font-bold bg-[#fbf2ed] text-[#004d37] px-4 py-2 rounded-lg hover:bg-[#efe6e2] transition-colors"
                                    >
                                        View
                                    </a>
                                    <button 
                                        onClick={() => handleShare(record.link)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-sm font-bold bg-[#004d37] text-white px-4 py-2 rounded-lg hover:bg-[#00674b] transition-colors shadow-sm"
                                    >
                                        <span className="material-symbols-rounded text-[16px]">share</span> Share
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
}