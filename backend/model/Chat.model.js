import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // groups messages of one "chat window" together — frontend
        // generates and persists this in localStorage per session
        sessionId: {
            type: String,
            default: null,
            index: true
        },

        role: {
            type: String,
            enum: ["user", "bot"],
            required: true
        },

        // the plain text shown in the chat bubble
        // (user's typed/spoken text, or the bot's answer/reasoning)
        message: {
            type: String,
            required: true
        },

        // only relevant for role: "bot" -> "prediction" or "info"
       type: {
    type: String,
    enum: ["prediction", "info", "text", "voice", null],
    default: null
},

        // full JSON the Flask RAG backend returned (severity, precautions,
        // matched_symptoms, ui_labels, etc.) — stored as-is for bot messages
        responseData: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        language: {
            type: String,
            default: null
        },

        fromVoice: {
            type: Boolean,
            default: false
        }
        ,
         fullname: {
            type: String,
            default: null,
            index: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);