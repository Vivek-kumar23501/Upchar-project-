import React, { useState, useEffect, useRef } from 'react';
import AiSidebar from './AiSidebar';

export default function AiDiagnosisModal({ isOpen, onClose, user }) {
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (isOpen && user && messages.length === 0) {
            setMessages([
                { 
                    id: 1, 
                    sender: 'ai', 
                    type: 'text',
                    text: `Hello ${user.firstName}. I am Vitalis AI, your clinical assistant. Please describe your symptoms in detail.` 
                }
            ]);
        }
    }, [isOpen, user, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, isOpen, isFullscreen]);

    useEffect(() => {
        const handleResize = () => {
            if (isFullscreen && window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isFullscreen]);

    const handleSendMessage = (textToSend) => {
        const text = textToSend || input;
        if (!text.trim()) return;

        const newMsg = { id: Date.now(), sender: 'user', type: 'text', text: text.trim() };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const lowerText = text.toLowerCase();
            
            let aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                type: 'text',
                text: "I have noted this. To better understand your condition, could you tell me how long these symptoms have been present?"
            };

            if (lowerText.includes("chest") || lowerText.includes("heart")) {
                aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'assessment',
                    text: "Based on your description, this requires immediate medical evaluation.",
                    data: {
                        conditions: [
                            { name: "Myocardial Ischemia Risk", match: "82%", color: "bg-red-500" },
                            { name: "Severe Angina", match: "65%", color: "bg-orange-500" }
                        ],
                        steps: [
                            { text: "Stop all strenuous physical activity", icon: "warning", color: "text-red-500" },
                            { text: "If pain radiates to the arm or jaw, seek ER immediately", icon: "warning", color: "text-red-500" }
                        ],
                        actions: [
                            { label: "Emergency", style: "bg-red-500 hover:bg-red-600 text-white" },
                            { label: "Generate Report", style: "bg-blue-600 hover:bg-blue-700 text-white" }
                        ]
                    }
                };
            } else if (lowerText.includes("pain") || lowerText.includes("headache") || lowerText.includes("fever")) {
                aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'assessment',
                    text: "Based on your description, I have generated a preliminary assessment.",
                    data: {
                        conditions: [
                            { name: "Musculoskeletal Strain", match: "85%", color: "bg-[#104F3B]" },
                            { name: "Costochondritis", match: "40%", color: "bg-blue-500" }
                        ],
                        steps: [
                            { text: "Apply warm compress to the affected area", icon: "check_circle", color: "text-green-600" },
                            { text: "Avoid heavy lifting for 48 hours", icon: "check_circle", color: "text-green-600" },
                            { text: "Rest and hydrate frequently", icon: "check_circle", color: "text-green-600" }
                        ],
                        actions: [
                            { label: "Generate Report", style: "bg-blue-600 hover:bg-blue-700 text-white" },
                            { label: "Book Appointment", style: "bg-orange-500 hover:bg-orange-600 text-white" }
                        ]
                    }
                };
            } else if (lowerText.includes("fatigue") || lowerText.includes("tired")) {
                aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'assessment',
                    text: "Fatigue can have multiple underlying causes. Here is a preliminary look.",
                    data: {
                        conditions: [
                            { name: "Viral Infection (Mild)", match: "70%", color: "bg-[#104F3B]" },
                            { name: "Vitamin D Deficiency", match: "55%", color: "bg-blue-500" }
                        ],
                        steps: [
                            { text: "Ensure 8 hours of sleep per night", icon: "bedtime", color: "text-blue-500" },
                            { text: "Increase fluid intake", icon: "water_drop", color: "text-blue-500" }
                        ],
                        actions: [
                            { label: "Generate Report", style: "bg-blue-600 hover:bg-blue-700 text-white" }
                        ]
                    }
                };
            }

            setMessages(prev => [...prev, aiMsg]);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const startNewSession = () => {
        setMessages([{ 
            id: Date.now(), 
            sender: 'ai', 
            type: 'text',
            text: `Starting a new session. How can I assist you today, ${user?.firstName}?` 
        }]);
        if (window.innerWidth < 1024 || !isFullscreen) setIsSidebarOpen(false);
    };

    if (!isOpen) return null;

    const quickSymptoms = ["Chest Tightness", "Fatigue", "Severe Headache"];
    const isOverlay = !isFullscreen || window.innerWidth < 1024;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
                onClick={onClose}
            ></div>

            <div className={`relative bg-[#FCF9F2] shadow-2xl flex transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform animate-in slide-in-from-right-full ${
                isFullscreen 
                ? 'w-full h-full rounded-none' 
                : 'w-full sm:w-[480px] lg:w-[500px] h-full sm:h-[95vh] sm:my-auto sm:mr-4 sm:rounded-[2rem] overflow-hidden'
            }`}>
                
                {isSidebarOpen && isOverlay && (
                    <div 
                        className="absolute inset-0 bg-gray-900/20 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                
                <AiSidebar 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                    isOverlay={isOverlay} 
                    startNewSession={startNewSession} 
                />

                <div className="flex-1 flex flex-col relative w-full h-full min-w-0">
                    
                    <header className="px-5 sm:px-6 py-4 border-b border-[#EAE3D9] bg-[#FCF9F2] flex justify-between items-center z-20 shrink-0">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#EAE3D9]/50 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <span className="material-symbols-rounded text-[24px]">menu</span>
                            </button>
                            <div>
                                <h2 className="text-base font-bold text-gray-900 leading-tight flex items-center gap-2">
                                    Active Assessment
                                    <span className="bg-[#104F3B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider hidden sm:inline-block">Live</span>
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button 
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#EAE3D9]/50 text-gray-500 hover:text-gray-800 transition-colors hidden sm:flex"
                                title={isFullscreen ? "Minimize" : "Fullscreen"}
                            >
                                <span className="material-symbols-rounded text-[20px]">
                                    {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                                </span>
                            </button>
                            <button 
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <span className="material-symbols-rounded text-[22px]">close</span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 pb-32 space-y-6 relative bg-white/50">
                        
                        <div className="flex flex-wrap gap-2">
                            {quickSymptoms.map((symp, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSendMessage(symp)}
                                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors border shadow-sm ${
                                        i === 0 
                                        ? 'bg-[#104F3B] text-white border-[#104F3B] hover:bg-[#0A3628]' 
                                        : 'bg-white border-[#EAE3D9] text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {i === 0 && <span className="material-symbols-rounded text-[16px] sm:text-[18px]">favorite</span>}
                                    {symp}
                                </button>
                            ))}
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                
                                {msg.sender === 'ai' && (
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#104F3B] rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1">
                                        <span className="material-symbols-rounded text-white text-[18px]">
                                            {msg.type === 'assessment' ? 'fact_check' : 'description'}
                                        </span>
                                    </div>
                                )}

                                <div className={`${isFullscreen ? 'max-w-3xl' : 'max-w-[90%] sm:max-w-[85%]'}`}>
                                    {msg.type === 'text' && (
                                        <div className={`px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl shadow-sm text-[13px] sm:text-[14px] leading-relaxed ${
                                            msg.sender === 'user' 
                                            ? 'bg-[#104F3B] text-white rounded-tr-sm inline-block' 
                                            : 'bg-white border border-[#EAE3D9] text-gray-700 rounded-tl-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    )}

                                    {msg.type === 'assessment' && (
                                        <div className="bg-white border border-[#EAE3D9] rounded-[1.25rem] shadow-sm w-full overflow-hidden mt-1">
                                            <div className="px-5 py-4 border-b border-[#EAE3D9] flex items-center gap-2 bg-[#FCF9F2]/50">
                                                <span className="material-symbols-rounded text-[#104F3B]">verified</span>
                                                <h3 className="text-[14px] sm:text-[15px] font-bold text-[#104F3B]">Preliminary Assessment</h3>
                                            </div>
                                            
                                            <div className={`p-5 grid gap-6 ${isFullscreen ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Likely Conditions</h4>
                                                    <div className="space-y-3">
                                                        {msg.data.conditions.map((cond, idx) => (
                                                            <div key={idx} className={`p-3 rounded-xl border ${idx === 0 ? 'bg-[#F6F0E4] border-transparent' : 'bg-[#FCF9F2] border-[#EAE3D9]'}`}>
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className="font-bold text-gray-800 text-xs sm:text-sm">{cond.name}</span>
                                                                    <span className={`font-bold text-xs ${idx === 0 ? 'text-[#104F3B]' : 'text-blue-600'}`}>{cond.match} Match</span>
                                                                </div>
                                                                <div className="w-full bg-[#EAE3D9] h-1.5 rounded-full overflow-hidden">
                                                                    <div className={`${cond.color} h-full rounded-full`} style={{ width: cond.match }}></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={`${isFullscreen ? 'border-l border-[#EAE3D9] pl-6' : 'border-t border-[#EAE3D9] pt-6'}`}>
                                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Recommended Next Steps</h4>
                                                    <ul className="space-y-3">
                                                        {msg.data.steps.map((step, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <span className={`material-symbols-rounded ${step.color} text-[18px] mt-0.5 shrink-0`}>{step.icon}</span>
                                                                <span className="text-[13px] sm:text-sm text-gray-700 leading-tight">{step.text}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="px-5 pb-5 pt-2 flex flex-wrap gap-2">
                                                {msg.data.actions.map((action, idx) => (
                                                    <button key={idx} className={`flex-1 min-w-[140px] py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors shadow-sm ${action.style}`}>
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4 animate-in fade-in duration-300">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#104F3B] rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1">
                                    <span className="material-symbols-rounded text-white text-[18px]">more_horiz</span>
                                </div>
                                <div className="bg-white border border-[#EAE3D9] px-4 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-[#104F3B]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-[#104F3B]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-[#104F3B]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#FCF9F2] via-[#FCF9F2] to-transparent pt-12 z-20">
                        <div className={`mx-auto transition-all ${isFullscreen ? 'max-w-3xl' : 'max-w-full'}`}>
                            <div className="bg-white border border-[#EAE3D9] rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-1.5 sm:p-2 pl-3 sm:pl-4 flex items-center gap-1.5 transition-all focus-within:ring-2 focus-within:ring-[#B5F1D1] focus-within:border-[#104F3B]">
                                <button className="text-gray-400 hover:text-[#104F3B] transition-colors shrink-0 p-1 hidden sm:block">
                                    <span className="material-symbols-rounded text-[22px]">attach_file</span>
                                </button>
                                <button className="text-gray-400 hover:text-[#104F3B] transition-colors shrink-0 p-1">
                                    <span className="material-symbols-rounded text-[22px]">mic</span>
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Describe how you're feeling..."
                                    className="flex-1 bg-transparent border-none focus:outline-none text-[14px] sm:text-[15px] text-gray-800 placeholder-gray-400 py-2 w-full px-2"
                                />
                                <button 
                                    onClick={() => handleSendMessage()}
                                    disabled={!input.trim()}
                                    className="w-10 h-10 bg-[#104F3B] rounded-xl flex items-center justify-center text-white hover:bg-[#0A3628] transition-colors shrink-0 disabled:opacity-50 shadow-sm"
                                >
                                    <span className="material-symbols-rounded text-[20px] ml-0.5">send</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}