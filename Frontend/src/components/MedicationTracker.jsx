import React, { useState } from 'react';

export default function MedicationTracker() {
    const [isEditingMeds, setIsEditingMeds] = useState(false);
    
    const [medications, setMedications] = useState([
        { id: 1, timeLabel: "Morning • 8:00 AM", name: "Amoxicillin", dose: "10mg", instruction: "After food", taken: true, icon: "check_circle", colorTheme: "green" },
        { id: 2, timeLabel: "Afternoon • 1:00 PM", name: "Metformin", dose: "500mg", instruction: "Before food", taken: false, icon: "pill", colorTheme: "primary" },
        { id: 3, timeLabel: "Evening • 8:00 PM", name: "Atorvastatin", dose: "20mg", instruction: "After food", taken: false, icon: "routine", colorTheme: "orange" }
    ]);

    const toggleMedication = (id) => {
        setMedications(meds => meds.map(med => med.id === id ? { ...med, taken: !med.taken } : med));
    };

    const updateMedication = (id, field, value) => {
        setMedications(meds => meds.map(med => med.id === id ? { ...med, [field]: value } : med));
    };

    const addMedication = () => {
        const newMed = {
            id: Date.now(),
            timeLabel: "New Time",
            name: "New Medicine",
            dose: "Dose",
            instruction: "Instructions",
            taken: false,
            icon: "pill",
            colorTheme: "primary"
        };
        setMedications([...medications, newMed]);
    };

    const removeMedication = (id) => {
        setMedications(meds => meds.filter(med => med.id !== id));
    };

    return (
        <section className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-[#004d37]">Today's Medication</h3>
                <button 
                    onClick={() => setIsEditingMeds(!isEditingMeds)}
                    className={`font-bold text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-colors ${isEditingMeds ? 'bg-[#004d37] text-white' : 'bg-[#a0f3cf]/40 text-[#004d37] hover:bg-[#a0f3cf]/70'}`}
                >
                    {isEditingMeds ? 'Save' : 'Edit'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {medications.map((med) => (
                    <div key={med.id} className={`rounded-2xl md:rounded-[1.5rem] p-4 md:p-6 shadow-sm border transition-all ${
                        med.taken && !isEditingMeds ? 'bg-[#f5ece7] border-transparent opacity-70' : 
                        med.colorTheme === 'primary' ? 'bg-gradient-to-br from-[#004d37] to-[#00674b] shadow-md text-white border-transparent' : 
                        'bg-white border-[#bec9c2]/40 hover:shadow-md'
                    }`}>
                        <div className="flex items-start justify-between gap-3">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                                med.colorTheme === 'primary' ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white' : 
                                med.colorTheme === 'orange' ? 'bg-[#fff3e0] text-[#d35400]' : 
                                'bg-[#e8f5e9] text-green-600'
                            }`}>
                                <span className="material-symbols-rounded text-[20px] md:text-[24px]">{med.taken && !isEditingMeds ? 'check_circle' : med.icon}</span>
                            </div>
                            {isEditingMeds && (
                                <button onClick={() => removeMedication(med.id)} className="text-red-400 hover:text-red-500 bg-red-50 p-1.5 md:p-2 rounded-xl transition-colors">
                                    <span className="material-symbols-rounded text-[18px] md:text-[20px]">delete</span>
                                </button>
                            )}
                        </div>
                        
                        <div className="mt-4 md:mt-5">
                            {isEditingMeds ? (
                                <div className="space-y-2 md:space-y-3">
                                    <input type="text" value={med.timeLabel} onChange={(e) => updateMedication(med.id, 'timeLabel', e.target.value)} className="w-full bg-black/5 border-b border-gray-300 focus:border-[#004d37] outline-none text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 px-2 py-1 md:py-1.5 rounded placeholder-gray-500 transition-colors" placeholder="Time (e.g. 8:00 AM)"/>
                                    <input type="text" value={med.name} onChange={(e) => updateMedication(med.id, 'name', e.target.value)} className="w-full bg-black/5 border-b border-gray-300 focus:border-[#004d37] outline-none font-bold text-lg md:text-xl px-2 py-1 md:py-1.5 rounded placeholder-gray-500 transition-colors" placeholder="Medication Name"/>
                                    <div className="flex gap-2 md:gap-3">
                                        <input type="text" value={med.dose} onChange={(e) => updateMedication(med.id, 'dose', e.target.value)} className="w-1/3 bg-black/5 border-b border-gray-300 focus:border-[#004d37] outline-none text-xs md:text-sm px-2 py-1 md:py-1.5 rounded placeholder-gray-500 transition-colors" placeholder="Dose"/>
                                        <input type="text" value={med.instruction} onChange={(e) => updateMedication(med.id, 'instruction', e.target.value)} className="w-2/3 bg-black/5 border-b border-gray-300 focus:border-[#004d37] outline-none text-xs md:text-sm px-2 py-1 md:py-1.5 rounded placeholder-gray-500 transition-colors" placeholder="Instruction"/>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider mb-1 ${med.colorTheme === 'primary' ? 'text-[#a0f3cf]' : 'text-[#6f7a73]'}`}>{med.timeLabel}</p>
                                    <h4 className={`font-bold text-lg md:text-xl ${med.colorTheme === 'primary' ? 'text-white' : 'text-[#1e1b18]'}`}>{med.name}</h4>
                                    <p className={`text-xs md:text-[15px] mb-4 md:mb-6 mt-0.5 md:mt-1 ${med.colorTheme === 'primary' ? 'text-white/80' : 'text-[#3f4944]'}`}>{med.dose} • {med.instruction}</p>
                                    <button 
                                        onClick={() => toggleMedication(med.id)}
                                        className={`text-xs md:text-sm font-bold px-4 py-2 md:py-2.5 rounded-full transition-colors w-full flex items-center justify-center gap-1.5 md:gap-2 ${
                                            med.taken ? 'bg-transparent text-gray-500 border border-gray-300' :
                                            med.colorTheme === 'primary' ? 'bg-white text-[#004d37] hover:bg-[#e9e1dc] shadow-sm' : 
                                            'bg-[#004d37] text-white hover:bg-[#00674b] shadow-sm'
                                        }`}
                                    >
                                        {med.taken ? 'Taken' : 'Mark as taken'}
                                        {med.taken && <span className="material-symbols-rounded text-[16px] md:text-[18px]">done</span>}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {isEditingMeds && (
                    <button onClick={addMedication} className="rounded-2xl md:rounded-[1.5rem] p-4 md:p-6 border-2 border-dashed border-[#bec9c2] flex flex-col items-center justify-center text-[#6f7a73] hover:text-[#004d37] hover:border-[#004d37] hover:bg-[#fbf2ed] transition-all min-h-[180px] md:min-h-[240px]">
                        <span className="material-symbols-rounded text-[36px] md:text-[48px] mb-2 md:mb-3">add_circle</span>
                        <span className="font-bold text-sm md:text-lg">Add New</span>
                    </button>
                )}
            </div>
        </section>
    );
}