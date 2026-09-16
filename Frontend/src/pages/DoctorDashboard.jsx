import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://upchar-project.onrender.com';

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');

    // Patients forwarded by hospitals to this doctor
    const [forwardedPatients, setForwardedPatients] = useState([]);
    const [patientsLoading, setPatientsLoading] = useState(false);
    const [patientsError, setPatientsError] = useState('');
    const [deletingPatientId, setDeletingPatientId] = useState(null);

    // hospitalId -> hospitalName, used as a fallback when an appointment
    // only carries a raw hospital id instead of a populated object.
    const [hospitalsMap, setHospitalsMap] = useState({});

    // Refer-to-hospital modal
    const [showReferModal, setShowReferModal] = useState(false);
    const [referPatient, setReferPatient] = useState(null);
    const [hospitalsList, setHospitalsList] = useState([]);
    const [hospitalsLoading, setHospitalsLoading] = useState(false);
    const [hospitalsError, setHospitalsError] = useState('');
    const [referringHospitalId, setReferringHospitalId] = useState(null);

    // Session Management
    useEffect(() => {
        try {
            const session = localStorage.getItem('user');
            if (!session) {
                navigate('/');
            } else {
                const parsedUser = JSON.parse(session);
                if (parsedUser.role !== 'doctor') {
                    navigate('/'); // Kick out non-doctors
                } else {
                    setUser(parsedUser);
                }
            }
        } catch (error) {
            localStorage.removeItem('user');
            navigate('/');
        }
    }, [navigate]);

    // Fetch Profile Image with Caching
    useEffect(() => {
        if (user && user.profilePic) {
            const cachedImage = localStorage.getItem(`profile_image_${user.profilePic}`);
            if (cachedImage) {
                setProfileImage(cachedImage);
                return;
            }

            const appsScriptUrl = "https://script.google.com/macros/s/AKfycbxyUIl9Y5wNomf2vp3PWf_JUGIlsF5brGHCckbMasXtdkS7JH8QLrzk4lLsZJ1XnhC2Cw/exec";
            fetch(`${appsScriptUrl}?id=${user.profilePic}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success" && data.base64) {
                        const imgData = data.base64.startsWith('data:image') 
                            ? data.base64 
                            : `data:image/jpeg;base64,${data.base64}`;
                        setProfileImage(imgData);
                        localStorage.setItem(`profile_image_${user.profilePic}`, imgData);
                    }
                })
                .catch(err => console.error("Failed to fetch profile image:", err));
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/', { replace: true });
    };

    // ---------------------------------------------------
    // Common auth headers + doctor id helper
    // ---------------------------------------------------

    const authHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    const getDoctorId = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;

        try {
            const doctorUser = JSON.parse(storedUser);
            return (
                doctorUser?._id ||
                doctorUser?.id ||
                doctorUser?.doctorId ||
                null
            );
        } catch (error) {
            console.error('Invalid doctor user:', error);
            return null;
        }
    };

    // ===================================================
    // FORWARDED PATIENTS (hospital -> doctor queue)
    // ===================================================

    // Pulls every appointment a hospital has forwarded to THIS doctor.
    // These stay visible regardless of referral actions taken on them -
    // only an explicit delete removes a patient from this list.
    const fetchForwardedPatients = async () => {
        setPatientsLoading(true);
        setPatientsError('');

        try {
            const doctorId = getDoctorId();

            if (!doctorId) {
                setPatientsError('Doctor ID nahi mila. Please login again.');
                return;
            }

            const res = await fetch(
                `${API_BASE}/appointments/queue?status=forward&doctorId=${encodeURIComponent(doctorId)}`,
                {
                    method: 'GET',
                    headers: authHeaders(),
                }
            );

            const data = await res.json();

            console.log('Forwarded Patients Response:', data);

            if (!res.ok || !data.success) {
                setPatientsError(data.message || 'Patients fetch nahi ho paye.');
                return;
            }

            setForwardedPatients(data.appointments || []);
        } catch (err) {
            console.error('Fetch Forwarded Patients Error:', err);
            setPatientsError('Server se patients fetch nahi ho paye.');
        } finally {
            setPatientsLoading(false);
        }
    };

    // Loads every hospital once and keeps an id -> name lookup, so a patient
    // card can always show "Forwarded by <hospital>" even if the appointment
    // response only includes a raw hospitalId instead of a populated object.
    const fetchHospitalsMap = async () => {
        try {
            const res = await fetch(`${API_BASE}/hospital/all`, {
                method: 'GET',
                headers: authHeaders(),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                console.error('Fetch Hospitals Map Error:', data.message);
                return;
            }

            const map = {};
            (data.hospitals || []).forEach((h) => {
                map[h._id] = h.hospitalName;
            });

            setHospitalsMap(map);
        } catch (err) {
            console.error('Fetch Hospitals Map Error:', err);
        }
    };

    useEffect(() => {
        if (activeSection === 'patients' && user) {
            fetchForwardedPatients();
            fetchHospitalsMap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection, user]);

    // Removes a patient from this doctor's list entirely. This is the ONLY
    // action that should make the patient (and their action buttons) disappear.
    const handleDeletePatient = async (appointmentId) => {
        const confirmDelete = window.confirm(
            'Kya aap is patient ko apni list se delete karna chahte hain?'
        );

        if (!confirmDelete) return;

        setDeletingPatientId(appointmentId);

        try {
            const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });

            const data = await res.json();

            console.log('Delete Patient Response:', data);

            if (!res.ok || !data.success) {
                setPatientsError(data.message || 'Patient delete nahi ho paya.');
                return;
            }

            setForwardedPatients((prev) =>
                prev.filter((p) => p._id !== appointmentId)
            );
        } catch (err) {
            console.error('Delete Patient Error:', err);
            setPatientsError('Server se connect nahi ho paya.');
        } finally {
            setDeletingPatientId(null);
        }
    };

    // ---------------------------------------------------
    // Refer-to-hospital flow
    // ---------------------------------------------------

    // Opens the hospital picker for a given patient and loads every hospital
    // on the platform so the doctor can choose where to refer them.
    const openReferModal = async (patient) => {
        setReferPatient(patient);
        setShowReferModal(true);
        setHospitalsError('');
        setHospitalsLoading(true);

        try {
            const res = await fetch(`${API_BASE}/hospital/all`, {
                method: 'GET',
                headers: authHeaders(),
            });

            const data = await res.json();

            console.log('Hospitals Response:', data);

            if (!res.ok || !data.success) {
                setHospitalsError(data.message || 'Hospitals fetch nahi ho paye.');
                return;
            }

            setHospitalsList(data.hospitals || []);
        } catch (err) {
            console.error('Fetch Hospitals Error:', err);
            setHospitalsError('Server se hospitals fetch nahi ho paye.');
        } finally {
            setHospitalsLoading(false);
        }
    };

    const closeReferModal = () => {
        setShowReferModal(false);
        setReferPatient(null);
        setHospitalsList([]);
        setHospitalsError('');
    };

    // Records the referral against the appointment WITHOUT changing its
    // main "forward" status - so the patient card + its buttons stay put
    // on this doctor's list until the doctor explicitly deletes it.
    const handleReferToHospital = async (hospital) => {
        if (!referPatient) return;

        setReferringHospitalId(hospital._id);

        try {
            const res = await fetch(
                `${API_BASE}/appointments/${referPatient._id}/refer`,
                {
                    method: 'PATCH',
                    headers: authHeaders(),
                    body: JSON.stringify({ hospitalId: hospital._id }),
                }
            );

            const data = await res.json();

            console.log('Refer To Hospital Response:', data);

            if (!res.ok || !data.success) {
                setHospitalsError(data.message || 'Refer nahi ho paya.');
                return;
            }

            closeReferModal();
            await fetchForwardedPatients();
        } catch (err) {
            console.error('Refer To Hospital Error:', err);
            setHospitalsError('Server se connect nahi ho paya.');
        } finally {
            setReferringHospitalId(null);
        }
    };

    // ---------------------------------------------------
    // Teleconsultation
    // ---------------------------------------------------

    const handleStartTeleconsultation = (patient) => {
        navigate('/doctor/consultation', {
            state: {
                appointmentId: patient._id,
                patientName: patient.fullName || patient.userId?.fullname,
                mode: 'video',
            },
        });
    };

    if (!user) return <div className="flex h-screen items-center justify-center bg-[#fff8f5] font-bold text-[#004d37]">Loading Workspace...</div>;

    const todayPatients = [
        { time: "09:00 AM", name: "Rajesh Kumar", type: "In-Person", status: "Waiting", condition: "Hypertension Review" },
        { time: "10:30 AM", name: "Priya Sharma", type: "Video", status: "Next", condition: "Post-Op Followup" },
        { time: "11:15 AM", name: "Amit Singh", type: "In-Person", status: "Scheduled", condition: "Severe Migraine" }
    ];

    // ===================================================
    // OVERVIEW SECTION
    // ===================================================

    const renderOverview = () => (
        <>
            {/* Welcome Section */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-1 md:mt-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#004d37] mb-2 tracking-tight">Welcome, Dr. {user.lastName || user.firstName}</h2>
                    <p className="text-sm md:text-base text-[#3f4944] opacity-90">You have <span className="font-bold text-[#00668a]">12 patients</span> scheduled today across clinic and teleconsultations.</p>
                </div>
                <button className="bg-[#004d37] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#00674b] transition-all shadow-md flex items-center gap-2">
                    <span className="material-symbols-rounded text-[18px]">add</span> Start Walk-In Consultation
                </button>
            </section>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-[#bec9c2]/40 shadow-sm flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-green-700 flex items-center justify-center mb-3">
                        <span className="material-symbols-rounded">group</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#1e1b18]">12</p>
                        <p className="text-xs md:text-sm text-[#6f7a73] font-bold uppercase tracking-wider mt-1">Total Patients</p>
                    </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-[#bec9c2]/40 shadow-sm flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#c3e7ff] text-[#00668a] flex items-center justify-center mb-3">
                        <span className="material-symbols-rounded">videocam</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#1e1b18]">3</p>
                        <p className="text-xs md:text-sm text-[#6f7a73] font-bold uppercase tracking-wider mt-1">Teleconsults</p>
                    </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-[#bec9c2]/40 shadow-sm flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center mb-3">
                        <span className="material-symbols-rounded">warning</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#1e1b18]">2</p>
                        <p className="text-xs md:text-sm text-[#6f7a73] font-bold uppercase tracking-wider mt-1">AI Urgent Alerts</p>
                    </div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-[#bec9c2]/40 shadow-sm flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#fff3e0] text-[#d35400] flex items-center justify-center mb-3">
                        <span className="material-symbols-rounded">science</span>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-[#1e1b18]">5</p>
                        <p className="text-xs md:text-sm text-[#6f7a73] font-bold uppercase tracking-wider mt-1">New Lab Reports</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">

                {/* Left Column: Today's Schedule */}
                <div className="xl:col-span-2 bg-white rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-6 md:p-8 border-b border-[#bec9c2]/30 flex justify-between items-center bg-[#fbf2ed]/50">
                        <h3 className="text-xl md:text-2xl font-bold text-[#004d37]">Today's Appointments</h3>
                        <button className="text-[#00668a] font-bold text-xs md:text-sm bg-white border border-[#bec9c2] px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">View Calendar</button>
                    </div>

                    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                        <div className="space-y-4">
                            {todayPatients.map((patient, index) => (
                                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[1.5rem] border border-[#bec9c2]/40 hover:shadow-md transition-shadow bg-white gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-[#e9e1dc] border border-[#bec9c2] flex items-center justify-center font-bold text-[#004d37] shrink-0">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-[#1e1b18]">{patient.name}</h4>
                                            <p className="text-sm text-[#3f4944] mt-0.5">{patient.condition}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[11px] font-bold bg-[#fbf2ed] text-[#6f7a73] px-2 py-1 rounded-md flex items-center gap-1">
                                                    <span className="material-symbols-rounded text-[14px]">schedule</span> {patient.time}
                                                </span>
                                                <span className={`text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${patient.type === 'Video' ? 'bg-[#c3e7ff] text-[#00668a]' : 'bg-[#e8f5e9] text-[#004d37]'}`}>
                                                    <span className="material-symbols-rounded text-[14px]">{patient.type === 'Video' ? 'videocam' : 'location_on'}</span> {patient.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col justify-between items-end gap-2">
                                        <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${patient.status === 'Waiting' ? 'bg-orange-100 text-orange-700' : patient.status === 'Next' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {patient.status}
                                        </span>
                                        <button className="text-[#00668a] text-sm font-bold hover:underline">Open Chart</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Triage & Actions */}
                <div className="xl:col-span-1 space-y-6 md:space-y-8">

                    {/* AI Triage Alerts */}
                    <div className="bg-gradient-to-br from-[#004d37] to-[#002116] rounded-3xl md:rounded-[2rem] p-6 md:p-8 shadow-lg text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                <span className="material-symbols-rounded text-white animate-pulse">crisis_alert</span>
                            </div>
                            <h3 className="text-xl font-bold">Nexus AI Triage</h3>
                        </div>

                        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">High Priority</span>
                                <span className="text-xs text-white/60">10m ago</span>
                            </div>
                            <h4 className="font-bold text-lg">Kamla Devi (ASHA Ref)</h4>
                            <p className="text-sm text-white/80 mt-1 line-clamp-2">AI detected potential symptoms of unstable angina during ASHA pre-screening.</p>
                            <button className="mt-4 w-full bg-white text-[#004d37] py-2 rounded-xl text-sm font-bold hover:bg-[#e9e1dc] transition-colors">Review Case</button>
                        </div>
                    </div>

                    {/* Pending Lab Results */}
                    <div className="bg-white rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#004d37]">Pending Lab Reports</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl border border-[#bec9c2]/40 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-[#fff3e0] text-[#d35400] flex items-center justify-center"><span className="material-symbols-rounded text-[18px]">bloodtype</span></div>
                                    <div>
                                        <p className="font-bold text-sm text-[#1e1b18]">Suresh M.</p>
                                        <p className="text-[11px] text-[#6f7a73]">Lipid Panel</p>
                                    </div>
                                </div>
                                <span className="material-symbols-rounded text-[#00668a] text-[20px]">chevron_right</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl border border-[#bec9c2]/40 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-[#c3e7ff] text-[#00668a] flex items-center justify-center"><span className="material-symbols-rounded text-[18px]">pulmonology</span></div>
                                    <div>
                                        <p className="font-bold text-sm text-[#1e1b18]">Anita K.</p>
                                        <p className="text-[11px] text-[#6f7a73]">Chest X-Ray</p>
                                    </div>
                                </div>
                                <span className="material-symbols-rounded text-[#00668a] text-[20px]">chevron_right</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 text-center text-sm font-bold text-[#00668a] hover:bg-[#fbf2ed] rounded-xl transition-colors">View All 5 Reports</button>
                    </div>

                </div>
            </div>
        </>
    );

    // ===================================================
    // PATIENTS SECTION (forwarded by hospitals)
    // ===================================================

    const renderPatients = () => (
        <>
            <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-1 md:mt-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#004d37] mb-2 tracking-tight">Forwarded Patients</h2>
                    <p className="text-sm md:text-base text-[#3f4944] opacity-90">
                        Hospitals ne jo patients aapko forward kiye hain, wo yahan dikhte hain — jab tak aap delete na karein, wo yahin rahenge.
                    </p>
                </div>
                <button
                    onClick={fetchForwardedPatients}
                    disabled={patientsLoading}
                    className="flex items-center gap-2 bg-white text-[#004d37] border border-[#bec9c2] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#fbf2ed] transition-colors disabled:opacity-60"
                >
                    <span className={`material-symbols-rounded text-[18px] ${patientsLoading ? 'animate-spin' : ''}`}>refresh</span>
                    Refresh
                </button>
            </section>

            {patientsError && (
                <div className="bg-[#ffdad6] text-[#93000a] text-sm font-semibold px-4 py-3 rounded-xl">
                    {patientsError}
                </div>
            )}

            <div className="bg-white rounded-3xl md:rounded-[2rem] border border-[#bec9c2]/40 shadow-sm p-6 md:p-8">
                {patientsLoading && forwardedPatients.length === 0 ? (
                    <div className="border border-dashed border-[#bec9c2]/60 rounded-2xl p-10 text-center">
                        <p className="text-sm text-[#6f7a73] font-medium">Patients load ho rahe hain...</p>
                    </div>
                ) : forwardedPatients.length === 0 ? (
                    <div className="border border-dashed border-[#bec9c2]/60 rounded-2xl p-10 text-center">
                        <p className="text-sm text-[#6f7a73] font-medium">Abhi koi patient forward nahi kiya gaya hai.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {forwardedPatients.map((patient) => {
                            const patientName =
                                patient.fullName || patient.userId?.fullname || 'Unknown patient';

                            const phone =
                                patient.phone || patient.userId?.mobile || 'N/A';

                            // hospitalId can arrive as a populated object
                            // ({ hospitalName }), a raw id string, or the
                            // backend may already send hospitalName directly.
                            const hospitalIdRaw = patient.hospitalId;

                            const hospitalName =
                                patient.hospitalName ||
                                (typeof hospitalIdRaw === 'object' && hospitalIdRaw !== null
                                    ? hospitalIdRaw.hospitalName
                                    : null) ||
                                (typeof hospitalIdRaw === 'string'
                                    ? hospitalsMap[hospitalIdRaw]
                                    : null) ||
                                'Unknown hospital';

                            const referredHospitalName =
                                patient.referredHospitalName ||
                                patient.referredHospitalId?.hospitalName ||
                                null;

                            return (
                                <div
                                    key={patient._id}
                                    className="p-4 md:p-5 rounded-[1.5rem] border border-[#bec9c2]/40 hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className="w-14 h-14 rounded-full bg-[#e9e1dc] border border-[#bec9c2] flex items-center justify-center font-bold text-[#004d37] shrink-0">
                                                {patientName.charAt(0)}
                                            </div>

                                            <div className="min-w-0">
                                                <h4 className="font-bold text-lg text-[#1e1b18]">{patientName}</h4>
                                                <p className="text-sm text-[#3f4944] mt-0.5">
                                                    {patient.disease || 'Disease not specified'} • {phone}
                                                </p>

                                                <p className="text-[11px] font-bold bg-[#fbf2ed] text-[#6f7a73] px-2 py-1 rounded-md inline-flex items-center gap-1 mt-2">
                                                    <span className="material-symbols-rounded text-[14px]">local_hospital</span>
                                                    Forwarded by {hospitalName}
                                                </p>

                                                {patient.matchedSymptoms && patient.matchedSymptoms.length > 0 && (
                                                    <p className="text-xs text-[#6f7a73] mt-2">
                                                        Symptoms: {patient.matchedSymptoms.join(', ')}
                                                    </p>
                                                )}

                                                <p className="text-xs text-[#6f7a73] mt-1 flex items-center gap-1">
                                                    <span className="material-symbols-rounded text-[14px]">schedule</span>
                                                    {patient.preferredDate}
                                                    {patient.preferredTime ? ` • ${patient.preferredTime}` : ''}
                                                </p>

                                                {referredHospitalName && (
                                                    <p className="text-xs text-[#00668a] font-semibold mt-1 flex items-center gap-1">
                                                        <span className="material-symbols-rounded text-[14px]">send</span>
                                                        Referred to {referredHospitalName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeletePatient(patient._id)}
                                            disabled={deletingPatientId === patient._id}
                                            className="shrink-0 text-[#93000a] hover:bg-[#ffdad6] p-2 rounded-lg transition-colors disabled:opacity-60"
                                            title="Delete patient"
                                        >
                                            <span className="material-symbols-rounded text-[20px]">
                                                {deletingPatientId === patient._id ? 'hourglass_empty' : 'delete'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Actions - stay active until the doctor deletes this patient */}
                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#bec9c2]/30">
                                        <button
                                            onClick={() => openReferModal(patient)}
                                            className="flex items-center gap-1.5 bg-[#00674b] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#004d37] transition-colors"
                                        >
                                            <span className="material-symbols-rounded text-[16px]">send</span>
                                            Refer to Hospital
                                        </button>

                                        <button
                                            onClick={() => handleStartTeleconsultation(patient)}
                                            className="flex items-center gap-1.5 bg-white text-[#00668a] border border-[#00668a]/40 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#c3e7ff]/40 transition-colors"
                                        >
                                            <span className="material-symbols-rounded text-[16px]">videocam</span>
                                            Start Teleconsultation
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Refer-to-hospital modal */}
            {showReferModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-[#004d37] text-xl">Refer to Hospital</h3>
                                <p className="text-xs text-[#6f7a73] mt-1">
                                    {referPatient?.fullName || referPatient?.userId?.fullname || 'Patient'} ke liye hospital chunein.
                                </p>
                            </div>

                            <button
                                onClick={closeReferModal}
                                className="text-[#6f7a73] hover:text-[#1e1b18] p-1"
                            >
                                <span className="material-symbols-rounded text-[22px]">close</span>
                            </button>
                        </div>

                        {hospitalsError && (
                            <div className="bg-[#ffdad6] text-[#93000a] text-sm font-semibold px-4 py-2 rounded-xl mb-4">
                                {hospitalsError}
                            </div>
                        )}

                        {hospitalsLoading ? (
                            <div className="border border-dashed border-[#bec9c2]/60 rounded-2xl p-8 text-center">
                                <p className="text-sm text-[#6f7a73]">Hospitals load ho rahe hain...</p>
                            </div>
                        ) : hospitalsList.length === 0 ? (
                            <div className="border border-dashed border-[#bec9c2]/60 rounded-2xl p-8 text-center">
                                <p className="text-sm text-[#6f7a73]">Koi hospital nahi mila.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {hospitalsList.map((hospital) => (
                                    <div
                                        key={hospital._id}
                                        className="flex items-center justify-between gap-4 border border-[#bec9c2]/40 rounded-2xl p-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-bold text-[#1e1b18]">{hospital.hospitalName}</p>
                                            <p className="text-xs text-[#6f7a73] mt-1">
                                                {hospital.address?.city || 'N/A'}, {hospital.address?.state || 'N/A'}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleReferToHospital(hospital)}
                                            disabled={referringHospitalId === hospital._id}
                                            className="shrink-0 bg-[#004d37] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#00674b] transition-colors disabled:opacity-60"
                                        >
                                            {referringHospitalId === hospital._id ? 'Referring...' : 'Refer'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className="bg-[#fff8f5] text-[#1e1b18] font-sans min-h-screen flex antialiased selection:bg-[#004d37] selection:text-white">
            
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar */}
            <nav className={`fixed md:flex flex-col h-screen w-64 left-0 top-0 bg-[#fbf2ed] border-r border-[#bec9c2]/30 z-50 py-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="mb-8 md:mb-12 flex items-center gap-3 px-2 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-[#00674b] text-[#90e2bf] flex items-center justify-center text-xl font-bold shadow-sm group-hover:scale-105 transition-transform">V</div>
                    <div>
                        <h1 className="text-xl font-bold text-[#004d37] leading-tight">Vitalis Nexus</h1>
                        <p className="text-[10px] text-[#00668a] font-bold uppercase tracking-widest">Clinical Workspace</p>
                    </div>
                </div>
                
                <div className="flex-1 space-y-2">
                    <button
                        onClick={() => {
                            setActiveSection('overview');
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${
                            activeSection === 'overview'
                                ? 'text-[#004d37] bg-[#00674b]/10 border-l-4 border-[#004d37]'
                                : 'text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium'
                        }`}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">dashboard</span> Overview
                    </button>

                    <button
                        onClick={() => {
                            setActiveSection('patients');
                            setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-left ${
                            activeSection === 'patients'
                                ? 'text-[#004d37] bg-[#00674b]/10 border-l-4 border-[#004d37]'
                                : 'text-[#3f4944] hover:bg-[#efe6e2] hover:text-[#1e1b18] font-medium'
                        }`}
                    >
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">group</span> Patients
                    </button>

                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3f4944] hover:bg-[#efe6e2] transition-colors hover:text-[#1e1b18] font-medium">
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">calendar_month</span> Schedule
                    </a>

                    <a href="/doctor/consultation" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3f4944] hover:bg-[#efe6e2] transition-colors hover:text-[#1e1b18] font-medium">
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">healing</span> Consultations
                    </a>

                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3f4944] hover:bg-[#efe6e2] transition-colors hover:text-[#1e1b18] font-medium">
                        <span className="material-symbols-rounded text-[20px] md:text-[24px]">science</span> Lab Reports
                    </a>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="pt-4 border-t border-[#bec9c2]/30 space-y-1">
                        <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#3f4944] hover:bg-[#efe6e2] transition-colors text-sm font-medium">
                            <span className="material-symbols-rounded text-[18px] md:text-[20px]">settings</span> Settings
                        </a>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#3f4944] hover:bg-[#efe6e2] transition-colors text-sm font-medium text-left">
                            <span className="material-symbols-rounded text-[18px] md:text-[20px]">logout</span> Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 relative overflow-x-hidden flex flex-col min-h-screen">
                
                {/* Topbar */}
                <header className="flex justify-between items-center px-4 md:px-10 h-16 md:h-20 bg-[#fff8f5]/80 backdrop-blur-md z-30 sticky top-0 border-b border-[#bec9c2]/20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1.5 rounded-full hover:bg-[#efe6e2] text-[#3f4944]">
                            <span className="material-symbols-rounded text-[22px]">menu</span>
                        </button>
                        <div className="flex-1 md:w-96 relative">
                            <span className="material-symbols-rounded absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#6f7a73] text-[20px]">search</span>
                            <input className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-2.5 rounded-full bg-[#f5ece7] border-none focus:ring-2 focus:ring-[#00674b]/50 text-xs md:text-sm placeholder-[#6f7a73] transition-shadow outline-none" placeholder="Search ABHA ID, Patient Name..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5 ml-2">
                        <button className="p-1.5 rounded-full hover:bg-[#efe6e2] text-[#3f4944] relative transition-colors">
                            <span className="material-symbols-rounded text-[22px]">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ba1a1a] rounded-full ring-2 ring-[#fff8f5]"></span>
                        </button>
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-[#efe6e2] overflow-hidden bg-[#fbf2ed] shadow-sm shrink-0 flex items-center justify-center">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[#004d37] font-bold text-sm md:text-base">Dr.</span>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-10 max-w-[1400px] w-full mx-auto flex-1 flex flex-col gap-6 md:gap-8 relative z-10">
                    {activeSection === 'overview' ? renderOverview() : renderPatients()}
                </main>

                <footer className="bg-white border-t border-[#bec9c2]/30 py-6 md:py-8 px-4 md:px-10 mt-auto w-full">
                    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs md:text-sm text-[#3f4944]">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-[#004d37] text-white flex items-center justify-center text-[10px] font-bold">V</div>
                            <span className="font-semibold text-[#1e1b18]">© 2026 Vitalis Nexus.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}