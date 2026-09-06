import mongoose from "mongoose";
import Chat from "../model/Chat.model.js";

// ========================= SAVE CHAT MESSAGE =========================
// Called by the frontend right after it gets a response back from the
// Flask RAG backend (or right after the user sends a message). This
// endpoint has nothing to do with Flask — it just persists whatever
// the frontend already has.
const saveChat = async (req, res) => {
    try {
        const {
            sessionId,
            role,
            message,
            type,
            responseData,
            language,
            fromVoice
        } = req.body;

        if (!role || !message) {
            return res.status(400).json({
                success: false,
                message: "role and message are required"
            });
        }

        if (!["user", "bot"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "role must be 'user' or 'bot'"
            });
        }

        const chat = await Chat.create({
            user: req.user.id,
            fullname: req.user.fullname || null,
            sessionId: sessionId || null,
            role,
            message,
            type: type || null,
            responseData: responseData || null,
            language: language || null,
            fromVoice: !!fromVoice
        });

        res.status(201).json({
            success: true,
            chat
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ========================= GET MY CHAT HISTORY =========================
// Returns all messages for the logged-in user, optionally filtered to
// one sessionId (one "chat window").
const getMyChats = async (req, res) => {
    try {
        const { sessionId } = req.query;

        const filter = { user: req.user.id };

        if (sessionId) {
            filter.sessionId = sessionId;
        }

        const chats = await Chat.find(filter).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            chats
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ========================= LIST MY SESSIONS =========================
// Returns a distinct list of sessionIds for the sidebar / "your chats"
// list, with the last message time, a preview, and the user's fullname.
const getMySessions = async (req, res) => {
    try {
        const sessions = await Chat.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: "$sessionId",
                    fullname: { $first: "$fullname" },
                    firstMessage: { $first: "$message" },
                    lastMessage: { $last: "$message" },
                    lastActivity: { $last: "$createdAt" },
                    messageCount: { $sum: 1 }
                }
            },
            { $sort: { lastActivity: -1 } }
        ]);

        res.status(200).json({
            success: true,
            sessions
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ========================= LIST SESSIONS GROUPED BY USER =========================
// Admin-style view: every user's sessions, grouped by fullname —
// useful if you ever need to separate/browse chats user-wise.
const getAllSessionsByUser = async (req, res) => {
    try {
        const grouped = await Chat.aggregate([
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: { user: "$user", sessionId: "$sessionId" },
                    fullname: { $first: "$fullname" },
                    lastActivity: { $last: "$createdAt" },
                    messageCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$fullname",
                    sessions: {
                        $push: {
                            sessionId: "$_id.sessionId",
                            lastActivity: "$lastActivity",
                            messageCount: "$messageCount"
                        }
                    },
                    totalMessages: { $sum: "$messageCount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            users: grouped
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Path-param version — used by the frontend's "load this session" call.
const getChatHistoryBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is required"
            });
        }

        const messages = await Chat.find({
            user: req.user.id,
            sessionId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export { saveChat, getMyChats, getMySessions, getAllSessionsByUser, getChatHistoryBySession };