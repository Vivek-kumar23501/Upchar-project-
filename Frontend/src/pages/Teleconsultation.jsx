import { useState, useEffect } from "react";
import axios from "axios";
import { JaaSMeeting } from "@jitsi/react-sdk";



function Teleconsultation() {

    const [userId, setUserId] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            const parsedUser = JSON.parse(storedUser);

            setUserId(parsedUser.id);
            setName(parsedUser.fullname);
            setEmail(parsedUser.email);

        }

    }, []);

    const selectedRole = "patient";

    const [meeting, setMeeting] = useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const joinConsultation = async () => {

        if (loading || meeting) return;

        try {

            setLoading(true);
            setError("");

            const response = await axios.post(
                "http://localhost:8080/api/video/token",
                {
                    userId,
                    name,
                    email,
                    role: selectedRole
                }
            );


            if (!response.data.success) {

                throw new Error(
                    "Token generation failed"
                );

            }


            setMeeting({

                appId:
                    response.data.appId,

                roomName:
                    response.data.roomName,

                token:
                    response.data.token

            });

        }

        catch (err) {

            console.error(
                "Video consultation error:",
                err
            );

            setError(
                "Unable to start video consultation."
            );

        }

        finally {

            setLoading(false);

        }

    };


    // -------------------------
    // BEFORE JOINING
    // -------------------------

    if (!meeting) {

        return (

            <div
                style={{
                    width: "100%",
                    minHeight: "100vh",
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
                        👤
                    </div>

                    <h1 style={{ color: "#eafff4", fontSize: "20px", marginBottom: "4px" }}>
                        {name}
                    </h1>

                    <p style={{ color: "#9fcdb6", fontSize: "14px", marginBottom: "30px" }}>
                        Patient
                    </p>


                    <button
                        onClick={
                            joinConsultation
                        }
                        disabled={loading || !userId}
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

                        {loading
                            ? "Joining..."
                            : "Join Consultation"}

                    </button>


                    {error && (

                        <p
                            style={{
                                color: "#ff8080",
                                marginTop: "15px",
                                fontSize: "14px"
                            }}
                        >
                            {error}
                        </p>

                    )}

                </div>

            </div>

        );

    }


    // -------------------------
    // JITSI MEETING
    // -------------------------

    return (

        <div
            style={{
                width: "100%",
                height: "100vh",
                background: "#0d2b1f"
            }}
        >

            <JaaSMeeting

                appId={
                    meeting.appId
                }

                roomName={
                    meeting.roomName
                }

                jwt={
                    meeting.token
                }


                userInfo={{
                    displayName: name,
                    email: email
                }}


                getIFrameRef={
                    (iframeRef) => {

                        iframeRef.style.width =
                            "100%";

                        iframeRef.style.height =
                            "100%";

                        iframeRef.allow =
                            "camera; microphone; fullscreen; display-capture; autoplay";

                    }
                }


                configOverwrite={{

                    startWithAudioMuted:
                        false,

                    startWithVideoMuted:
                        false

                }}


                onReadyToClose={() => {

                    setMeeting(null);

                }}

            />

        </div>

    );

}


export default Teleconsultation;