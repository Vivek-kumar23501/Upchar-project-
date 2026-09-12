import { generateJaasToken } from "../utils/jaas.js";

export const generateVideoToken = (req, res) => {
    try {
        const { userId, name, email, role } = req.body;

        if (!userId || !name || !role) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const isModerator = role === "doctor";
        const roomName = "consultation-room-1";

        const token = generateJaasToken({ userId, name, email, roomName, isModerator });

        console.log(`Video token generated: ${role} -> ${roomName}`);

        res.json({
            success: true,
            appId: process.env.JAAS_APP_ID,
            roomName,
            token
        });
    } catch (error) {
        console.error("JaaS token error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create video token"
        });
    }
};