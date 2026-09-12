import { useState, useEffect } from "react";
import axios from "axios";
import { JaaSMeeting } from "@jitsi/react-sdk";



function DoctorConsultation() {

    const [doctorId, setDoctorId] = useState(null);
    const [doctorName, setDoctorName] = useState("");
    const [doctorEmail, setDoctorEmail] = useState("");

    const selectedRole = "doctor";

    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // -------------------------
    // Static patient health report
    // -------------------------
    const patientReport = {
        name: "Ramesh Kumar",
        age: 45,
        gender: "Male",
        bloodGroup: "B+",
        allergies: ["Penicillin", "Dust"],
        conditions: ["Type 2 Diabetes", "Hypertension"],
        medications: ["Metformin 500mg", "Amlodipine 5mg"],
        vitals: {
            bloodPressure: "130/85 mmHg",
            heartRate: "78 bpm",
            sugarLevel: "142 mg/dL",
            weight: "72 kg"
        },
        notes: "Patient reports occasional dizziness in the morning. Advised to monitor blood sugar twice daily."
    };


    // -------------------------
    // Load logged-in doctor info
    // -------------------------
    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            const parsedUser = JSON.parse(storedUser);

            setDoctorId(parsedUser.id);
            setDoctorName(parsedUser.fullname);
            setDoctorEmail(parsedUser.email);

        }

    }, []);


    const joinConsultation = async () => {

        if (loading || meeting) return;

        try {

            setLoading(true);
            setError("");

            const response = await axios.post(
                "http://localhost:8080/api/video/token",
                {
                    userId: doctorId,
                    name: doctorName,
                    email: doctorEmail,
                    role: selectedRole
                }
            );

            if (!response.data.success) {
                throw new Error("Token generation failed");
            }

            setMeeting({
                appId: response.data.appId,
                roomName: response.data.roomName,
                token: response.data.token
            });

        }

        catch (err) {

            console.error("Video consultation error:", err);
            setError("Unable to start video consultation.");

        }

        finally {

            setLoading(false);

        }

    };


    // -------------------------
    // LEFT SIDEBAR — PATIENT HEALTH REPORT
    // -------------------------
    const renderHealthSidebar = () => (

        <div
            style={{
                width: "320px",
                minWidth: "320px",
                height: "100vh",
                overflowY: "auto",
                background: "#0f2a1d",
                borderRight: "1px solid #1c4531",
                padding: "24px",
                color: "#eafff4",
                fontFamily: "'Segoe UI', sans-serif"
            }}
        >

            <h2 style={{ fontSize: "18px", marginBottom: "20px", color: "#eafff4" }}>
                Patient Health Report
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "2px" }}>Name</p>
                    <p style={{ fontSize: "15px", fontWeight: "600" }}>
                        {patientReport.name}
                    </p>
                </div>

                <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                        <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "2px" }}>Age</p>
                        <p style={{ fontSize: "15px", fontWeight: "600" }}>
                            {patientReport.age}
                        </p>
                    </div>
                    <div>
                        <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "2px" }}>Gender</p>
                        <p style={{ fontSize: "15px", fontWeight: "600" }}>
                            {patientReport.gender}
                        </p>
                    </div>
                </div>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "2px" }}>Blood Group</p>
                    <p style={{ fontSize: "15px", fontWeight: "600" }}>
                        {patientReport.bloodGroup}
                    </p>
                </div>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "4px" }}>Allergies</p>
                    <p style={{ fontSize: "14px" }}>
                        {patientReport.allergies.join(", ")}
                    </p>
                </div>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "4px" }}>Existing Conditions</p>
                    <p style={{ fontSize: "14px" }}>
                        {patientReport.conditions.join(", ")}
                    </p>
                </div>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "4px" }}>Current Medications</p>
                    <p style={{ fontSize: "14px" }}>
                        {patientReport.medications.join(", ")}
                    </p>
                </div>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "8px" }}>Latest Vitals</p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9fcdb6" }}>Blood Pressure</span>
                            <span>{patientReport.vitals.bloodPressure}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9fcdb6" }}>Heart Rate</span>
                            <span>{patientReport.vitals.heartRate}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9fcdb6" }}>Sugar Level</span>
                            <span>{patientReport.vitals.sugarLevel}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#9fcdb6" }}>Weight</span>
                            <span>{patientReport.vitals.weight}</span>
                        </div>
                    </div>

                </div>

                <div>
                    <p style={{ color: "#7fae95", fontSize: "12px", marginBottom: "4px" }}>Notes</p>
                    <p style={{ fontSize: "13px", color: "#c9e8d8", lineHeight: "1.5" }}>
                        {patientReport.notes}
                    </p>
                </div>

            </div>

        </div>

    );


    // -------------------------
    // RIGHT SIDE — BEFORE JOINING
    // -------------------------
    const renderJoinPanel = () => (

        <div
            style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #0d2b1f 0%, #143d2c 100%)",
                fontFamily: "'Segoe UI', sans-serif"
            }}
        >

            <div
                style={{
                    background: "linear-gradient(160deg, #163828 0%, #0f2a1d 100%)",
                    padding: "45px 40px",
                    borderRadius: "20px",
                    textAlign: "center",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                    maxWidth: "400px",
                    width: "90%"
                }}
            >

                <div
                    style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        background: "#1c4531",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        fontSize: "28px",
                        fontWeight: "bold",
                        color: "#eafff4"
                    }}
                >
                    👨‍⚕️
                </div>

                <h1 style={{ color: "#eafff4", fontSize: "20px", marginBottom: "4px" }}>
                    {doctorName || "Doctor"}
                </h1>

                <p style={{ color: "#9fcdb6", fontSize: "14px", marginBottom: "30px" }}>
                    Doctor
                </p>

                <button
                    onClick={joinConsultation}
                    disabled={loading || !doctorId}
                    style={{
                        padding: "14px 30px",
                        border: "none",
                        borderRadius: "50px",
                        background: loading ? "#3a7a55" : "#22a06b",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        width: "100%",
                        boxShadow: "0 4px 14px rgba(34,160,107,0.4)"
                    }}
                >
                    {loading ? "Joining..." : "Join Consultation"}
                </button>

                {error && (
                    <p style={{ color: "#ff8080", marginTop: "15px", fontSize: "14px" }}>
                        {error}
                    </p>
                )}

            </div>

        </div>

    );


    // -------------------------
    // RIGHT SIDE — JITSI MEETING
    // -------------------------
    const renderMeeting = () => (

        <div style={{ flex: 1, height: "100vh", background: "#0d2b1f" }}>

            <JaaSMeeting

                appId={meeting.appId}
                roomName={meeting.roomName}
                jwt={meeting.token}

                userInfo={{
                    displayName: doctorName,
                    email: doctorEmail
                }}

                getIFrameRef={(iframeRef) => {
                    iframeRef.style.width = "100%";
                    iframeRef.style.height = "100%";
                    iframeRef.allow = "camera; microphone; fullscreen; display-capture; autoplay";
                }}

                configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false
                }}

                onReadyToClose={() => {
                    setMeeting(null);
                }}

            />

        </div>

    );


    return (

        <div style={{ width: "100%", height: "100vh", display: "flex" }}>

            {renderHealthSidebar()}

            {meeting ? renderMeeting() : renderJoinPanel()}

        </div>

    );

}


export default DoctorConsultation;