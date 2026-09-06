import React, { useEffect } from 'react';

export default function Snackbar({ snackbar, setSnackbar }) {
    
    // Auto-hide logic: Hides the snackbar after 7 seconds (7000ms)
    useEffect(() => {
        if (snackbar.show) {
            const timer = setTimeout(() => {
                setSnackbar(prev => ({ ...prev, show: false }));
            }, 7000);
            
            // Clean up the timer if the component unmounts or changes
            return () => clearTimeout(timer);
        }
    }, [snackbar.show, setSnackbar]);

    if (!snackbar.show) return null;

    const isSuccess = snackbar.type === 'success';

    return (
        <>
            {/* Inline style for the 7-second shrinking progress bar animation */}
            <style>{`
                @keyframes progress-bar {
                    0% { width: 100%; }
                    100% { width: 0%; }
                }
                .animate-progress {
                    animation: progress-bar 7s linear forwards;
                }
            `}</style>

            {/* Premium Glassmorphism Container (Fixed to stay on screen when scrolling) */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col w-[90%] max-w-sm overflow-hidden rounded-2xl shadow-[0_16px_40px_rgb(0,0,0,0.12)] border backdrop-blur-xl bg-white/95 animate-in slide-in-from-top-8 fade-in duration-500 ease-out ${
                isSuccess ? 'border-green-200/50' : 'border-red-200/50'
            }`}>
                
                <div className="flex items-start gap-4 p-4">
                    
                    {/* Premium Colored Icon Background */}
                    <div className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-full shadow-inner ${
                        isSuccess ? 'bg-green-50 text-[#004d37]' : 'bg-red-50 text-red-600'
                    }`}>
                        <span className="material-symbols-rounded text-[22px]">
                            {isSuccess ? 'check_circle' : 'error'}
                        </span>
                    </div>

                    {/* Title and Message */}
                    <div className="flex-1 pt-0.5">
                        <h4 className={`text-sm font-bold mb-0.5 ${isSuccess ? 'text-[#004d37]' : 'text-red-700'}`}>
                            {isSuccess ? 'Success' : 'Error'}
                        </h4>
                        <p className="font-sans font-medium text-gray-600 text-xs leading-relaxed pr-2">
                            {snackbar.message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={() => setSnackbar(prev => ({ ...prev, show: false }))}
                        className={`p-1.5 rounded-full transition-colors shrink-0 -mr-1 -mt-1 ${
                            isSuccess ? 'hover:bg-green-50 text-green-600/50 hover:text-[#004d37]' : 'hover:bg-red-50 text-red-600/50 hover:text-red-700'
                        }`}
                    >
                        <span className="material-symbols-rounded text-[18px] block">close</span>
                    </button>
                </div>

                {/* Animated Progress Bar Container */}
                <div className="w-full h-1 bg-gray-100">
                    <div 
                        className={`h-full animate-progress ${isSuccess ? 'bg-[#004d37]' : 'bg-red-500'}`}
                    />
                </div>

            </div>
        </>
    );
}