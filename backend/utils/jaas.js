import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JAAS_APP_ID = process.env.JAAS_APP_ID;
const JAAS_KEY_ID = process.env.JAAS_KEY_ID;

let JAAS_PRIVATE_KEY;
try {
    JAAS_PRIVATE_KEY = fs.readFileSync(
        path.join(__dirname, "..", "jaas_private_key.pem"),
        "utf8"
    );
} catch (err) {
    console.error("JaaS private key file not found. Place jaas_private_key.pem in backend/ root.");
}

export function generateJaasToken({ userId, name, email, roomName, isModerator }) {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        aud: "jitsi",
        iss: "chat",
        nbf: now - 10,
        exp: now + 2 * 60 * 60,
        sub: JAAS_APP_ID,
        room: roomName.toLowerCase(),
        context: {
            user: {
                id: userId,
                name: name,
                email: email || "",
                avatar: "",
                moderator: isModerator === true
            },
            features: {
                livestreaming: false,
                recording: false,
                transcription: false,
                "outbound-call": false,
                "inbound-call": false
            }
        }
    };

    return jwt.sign(payload, JAAS_PRIVATE_KEY, {
        algorithm: "RS256",
        header: { kid: JAAS_KEY_ID, typ: "JWT" }
    });
}