import React from 'react';

export default function AiSidebar({ isSidebarOpen, setIsSidebarOpen, isOverlay, startNewSession }) {
    return (
        <div className={`
            ${isOverlay ? 'absolute' : 'static'} 
            inset-y-0 left-0 h-full bg-[#FCF9F2] border-r border-[#EAE3D9] flex flex-col transition-all duration-300 z-50 overflow-hidden
            ${isSidebarOpen ? 'w-72 translate-x-0 shadow-[10px_0_30px_rgba(0,0,0,0.05)]' : 'w-0 -translate-x-full border-transparent'}
        `}>
            <div className="p-6 w-72 flex flex-col h-full">
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#104F3B] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <span className="material-symbols-rounded text-[20px]">health_and_safety</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 text-[15px] leading-tight">Vitalis AI</h1>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-gray-700 p-1 bg-gray-100 rounded-md"
                    >
                        <span className="material-symbols-rounded text-[20px]">close</span>
                    </button>
                </div>

                <button onClick={startNewSession} className="w-full mb-6 flex justify-center items-center gap-2 bg-[#104F3B] hover:bg-[#0A3628] text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-sm">
                    <span className="material-symbols-rounded text-[18px]">add</span> New Session
                </button>

                <nav className="space-y-1.5 mb-8">
                    <button className="w-full flex items-center gap-3 bg-[#B5F1D1]/50 text-[#104F3B] px-4 py-3 rounded-xl font-bold transition-colors">
                        <span className="material-symbols-rounded text-[20px]">history</span> Chat History
                    </button>
                    <button className="w-full flex items-center gap-3 text-gray-600 hover:bg-[#F2ECE0] px-4 py-3 rounded-xl font-medium transition-colors">
                        <span className="material-symbols-rounded text-[20px]">bookmark</span> Saved Results
                    </button>
                </nav>

                <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Recent Cases</h3>
                    <div className="space-y-4 px-2">
                        <div className="cursor-pointer group">
                            <h4 className="font-bold text-[13px] text-gray-800 group-hover:text-[#104F3B]">Persistent Migraine</h4>
                            <p className="text-[11px] text-gray-400">2 hours ago</p>
                        </div>
                        <div className="cursor-pointer group">
                            <h4 className="font-bold text-[13px] text-gray-800 group-hover:text-[#104F3B]">Post-Op Recovery</h4>
                            <p className="text-[11px] text-gray-400">Yesterday</p>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-[#EAE3D9] space-y-1">
                    <button className="w-full flex items-center justify-between text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded-xl font-medium transition-colors hover:bg-[#F2ECE0]">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-rounded text-[18px]">settings</span>
                            <span className="text-sm">Settings</span>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between text-gray-600 hover:text-gray-900 px-3 py-2.5 rounded-xl font-medium transition-colors hover:bg-[#F2ECE0]">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-rounded text-[18px]">language</span>
                            <span className="text-sm">Language</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-[#EAE3D9]">EN</span>
                    </button>
                </div>
            </div>
        </div>
    );
}