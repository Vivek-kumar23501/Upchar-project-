import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Bookmark,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Globe2,
  Heart,
  History,
  Loader2,
  Maximize2,
  Menu,
  Mic,
  Paperclip,
  Plus,
  RotateCcw,
  Send,
  Settings,
  ShieldPlus,
  Sparkles,
  Square,
  X,
} from "lucide-react";

// ============================================================
// API CONFIGURATION
// ============================================================

const RAG_API_BASE = "http://localhost:5002";
const NODE_API_BASE = "http://localhost:8080";

const TEXT_API_URL = `${RAG_API_BASE}/rag-chat`;
const VOICE_API_URL = `${RAG_API_BASE}/voice-chat`;

const SAVE_CHAT_URL = `${NODE_API_BASE}/chat/save`;
const CHAT_HISTORY_URL = `${NODE_API_BASE}/chat/history`; // + /:sessionId
const CHAT_SESSIONS_URL = `${NODE_API_BASE}/chat/sessions`;

// NOTE: point this at your real appointment-booking endpoint.
const BOOK_APPOINTMENT_URL = `${NODE_API_BASE}/appointments/book`;

// NOTE: point this at your real hospital-listing endpoint.
const HOSPITAL_LIST_URL = `${NODE_API_BASE}/hospital/all`;

// ============================================================
// AUTH TOKEN
// ============================================================

function getToken() {
  const token = localStorage.getItem("token");
  if (!token) console.warn("No authentication token found.");
  return token;
}

function clearToken() {
  localStorage.removeItem("token");
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ============================================================
// SESSION ID
// ============================================================

function generateSessionId() {
  return (
    "chat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10)
  );
}

// ============================================================
// SAVE CHAT MESSAGE (Node backend)
// ============================================================

async function saveChatMessage({
  sessionId,
  role,
  message,
  type = null,
  responseData = null,
  language = null,
  fromVoice = false,
}) {
  const token = getToken();
  if (!token) {
    console.warn("Chat not saved because token is missing.");
    return null;
  }

  try {
    const response = await fetch(SAVE_CHAT_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        sessionId,
        role,
        message,
        type,
        responseData,
        language,
        fromVoice,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Save chat failed:", data);
      return null;
    }

    return data.chat || data;
  } catch (error) {
    console.error("Save chat network error:", error);
    return null;
  }
}

// ============================================================
// LOAD ONE SESSION'S HISTORY
// ============================================================

async function fetchChatHistory(sessionId) {
  const token = getToken();
  if (!token) {
    return { messages: [], unauthorized: false, noToken: true };
  }

  const response = await fetch(
    `${CHAT_HISTORY_URL}/${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.status === 401) {
    clearToken();
    return { messages: [], unauthorized: true, noToken: false };
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("History loading failed:", data);
    return { messages: [], unauthorized: false, noToken: false };
  }

  return { messages: data.messages || [], unauthorized: false, noToken: false };
}

// ============================================================
// LOAD ALL SESSIONS (for the sidebar)
// ============================================================

async function fetchChatSessions() {
  const token = getToken();
  if (!token) return [];

  try {
    const response = await fetch(CHAT_SESSIONS_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Session loading failed:", data);
      return [];
    }

    return data.sessions || [];
  } catch (error) {
    console.error("Session request failed:", error);
    return [];
  }
}

// ============================================================
// RAG CHAT (Flask) — TEXT + VOICE
// ============================================================

async function sendTextMessage(text) {
  const response = await fetch(TEXT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms: text }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.error) {
    throw new Error(
      data.error || "Something went wrong talking to the health assistant."
    );
  }

  return data;
}

async function sendVoiceMessage(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "voice.webm");

  const response = await fetch(VOICE_API_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.error) {
    throw new Error(data.error || "Voice processing failed.");
  }

  return data;
}

// ============================================================
// BOOK APPOINTMENT (Node backend)
// ============================================================

async function bookAppointmentRequest(payload) {
  const token = getToken();

  try {
    const response = await fetch(BOOK_APPOINTMENT_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Booking failed. Please try again.");
    }

    return data;
  } catch (error) {
    // Surface a friendly message even if the endpoint above doesn't exist yet.
    throw new Error(
      error.message === "Failed to fetch"
        ? "Could not reach the appointment service."
        : error.message
    );
  }
}

// ============================================================
// FETCH HOSPITAL LIST (Node backend)
// ============================================================

async function fetchHospitalsRequest() {
  const response = await fetch(HOSPITAL_LIST_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not load hospitals.");
  }

  return data.hospitals || [];
}

// ============================================================
// LOCAL STORAGE PROFILE (used to autofill the appointment form)
// ============================================================

// Keys your app might store the logged-in user object under. Add more here
// if your login flow saves it under a different key.
const USER_OBJECT_KEYS = ["user", "userData", "userInfo", "profile", "currentUser", "authUser"];

function formatLocation(location) {
  if (!location || typeof location !== "object") return "";
  return [location.village, location.block, location.district]
    .filter(Boolean)
    .join(", ");
}

// Reads the user profile object straight out of localStorage, e.g.:
// { id, fullname, email, mobile, role, location: { district, block, village } }
function readStoredUserObject() {
  for (const key of USER_OBJECT_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && (parsed.fullname || parsed.email)) {
        return parsed;
      }
    } catch {
      // not JSON, skip
    }
  }

  // Fallback: scan every localStorage key for a JSON object shaped like a user
  // (covers the case where it's saved under a key we didn't guess above).
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    if (!raw || !raw.startsWith("{")) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && (parsed.fullname || parsed.email)) {
        return parsed;
      }
    } catch {
      // not JSON, skip
    }
  }

  return null;
}

function readStoredProfile() {
  const user = readStoredUserObject();

  if (!user) {
    // Legacy fallback if the app ever stored flat string keys instead.
    const pick = (...keys) => {
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (v) return v;
      }
      return "";
    };
    return {
      id: "",
      fullName: pick("fullname", "name", "userName", "full_name"),
      email: pick("email", "userEmail"),
      phone: pick("phone", "mobile", "phoneNumber", "contact"),
      address: pick("address"),
    };
  }

  return {
    id: user.id || user._id || "",
    fullName: user.fullname || user.name || "",
    email: user.email || "",
    phone: user.mobile || user.phone || "",
    address: formatLocation(user.location) || user.address || "",
  };
}

// ============================================================
// TEXT TO SPEECH
// ============================================================

const LANG_TO_SPEECH_TAG = {
  en: "en-IN",
  english: "en-IN",
  hi: "hi-IN",
  hindi: "hi-IN",
  bn: "bn-IN",
  bengali: "bn-IN",
  te: "te-IN",
  telugu: "te-IN",
  mr: "mr-IN",
  marathi: "mr-IN",
  ta: "ta-IN",
  tamil: "ta-IN",
  gu: "gu-IN",
  gujarati: "gu-IN",
  kn: "kn-IN",
  kannada: "kn-IN",
  ml: "ml-IN",
  malayalam: "ml-IN",
  pa: "pa-IN",
  punjabi: "pa-IN",
  ur: "ur-IN",
  urdu: "ur-IN",
  ne: "ne-NP",
  nepali: "ne-NP",
  bhojpuri: "hi-IN",
};

function resolveSpeechLang(languageField, languageCode) {
  const codeKey = (languageCode || "").toLowerCase();
  const nameKey = (languageField || "").toLowerCase();
  return LANG_TO_SPEECH_TAG[codeKey] || LANG_TO_SPEECH_TAG[nameKey] || "en-IN";
}

function hasSpeechSynthesis() {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

function speakText(text, languageField, languageCode, { onStart, onEnd } = {}) {
  if (!hasSpeechSynthesis() || !text) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const chunks = text
    .split(/(?<=[।.?!\n])\s+/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);

  if (chunks.length === 0) return;

  const langTag = resolveSpeechLang(languageField, languageCode);
  let currentIndex = 0;

  if (onStart) onStart();

  function speakNextChunk() {
    if (currentIndex >= chunks.length) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
    utterance.lang = langTag;
    utterance.rate = 0.95;

    utterance.onend = () => {
      currentIndex++;
      speakNextChunk();
    };

    utterance.onerror = () => {
      currentIndex++;
      speakNextChunk();
    };

    synth.speak(utterance);
  }

  speakNextChunk();
}

// ============================================================
// SMALL PRESENTATIONAL COMPONENTS
// ============================================================

function SpeakButton({ text, language, languageCode }) {
  const [speaking, setSpeaking] = useState(false);

  if (!hasSpeechSynthesis()) return null;

  function handleClick(e) {
    e.preventDefault();
    speakText(text, language, languageCode, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 min-h-9 px-2.5 rounded-[9px] border text-xs cursor-pointer transition-colors ${
        speaking
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-white border-[#e8e4dc] text-[#536074] hover:bg-[#f5f5f1]"
      }`}
    >
      🔊 Suno
    </button>
  );
}

function ResultCard({ result, onBookAppointment }) {
  const severity = (result.severity || "unknown").toLowerCase();
  const precautions = Array.isArray(result.precautions) ? result.precautions : [];
  const labels = result.ui_labels || {};

  const severityDisplay = labels[`severity_${severity}`] || severity;
  const confidenceLabel = labels.confidence_label || "Confidence";
  const reasoningLabel = labels.reasoning_label || "Reasoning";
  const precautionsLabel = labels.precautions_label || "Precautions";
  const appointmentLabel = labels.appointment_button || "Book Appointment Now";

  const reasoningText = result.reasoning || "No reasoning available.";

  const speechText = `${result.predicted_disease || ""}. ${reasoningText}${
    precautions.length > 0 ? `. ${precautionsLabel}: ${precautions.join(", ")}` : ""
  }`;

  const severityClasses = {
    low: "bg-[#dcf5e5] text-[#176a3e]",
    medium: "bg-[#fff4cf] text-[#8b6611]",
    high: "bg-[#ffe1e1] text-[#a52d2d]",
    unknown: "bg-[#eceff1] text-[#56616e]",
  };

  // Pull the top-ranked candidate's hybrid score, if debug info is present.
  const topCandidate = result._debug?.candidates?.[0];

  function handleBookClick() {
    onBookAppointment(result.predicted_disease || "", severity, {
      confidence: result.confidence || "",
      matchedSymptoms: Array.isArray(result.matched_symptoms)
        ? result.matched_symptoms
        : [],
      riskScore: topCandidate?.hybrid_score ?? null,
      symptomScore: topCandidate?.symptom_score ?? null,
      vectorScore: topCandidate?.vector_score ?? null,
    });
  }

  return (
    <div className="max-w-[min(740px,76%)] max-[720px]:max-w-[calc(100%-45px)] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-[18px_20px] bg-white border border-[#e8e4dc] shadow-[0_8px_26px_rgba(32,41,56,0.06)] text-[#4c5869] text-sm leading-relaxed">
      <div className="flex items-center justify-between">
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
            severityClasses[severity] || severityClasses.unknown
          }`}
        >
          {severityDisplay}
        </span>
        <span className="text-[#0e5b49]">
          <Activity size={17} />
        </span>
      </div>

      <h3 className="mt-2 mb-3.5 text-[#202938] text-[17px] font-semibold">
        {result.predicted_disease || "Unclear"}
      </h3>

      <div className="mt-2.5">
        <span className="mr-1.5 text-[#374354] font-bold">{confidenceLabel}</span>
        <span>{result.confidence || "N/A"}</span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1">
        <span className="mr-1.5 text-[#374354] font-bold">{reasoningLabel}</span>
        <span>{reasoningText}</span>
      </div>

      {precautions.length > 0 && (
        <div className="mt-2.5">
          <span className="mr-1.5 text-[#374354] font-bold">{precautionsLabel}</span>
          <ul className="mt-1 ml-5 list-disc">
            {precautions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5 mt-3.5 max-[480px]:flex-col">
        {result.recommend_appointment && (
          <button
            type="button"
            onClick={handleBookClick}
            className="flex-1 min-h-[38px] rounded-[9px] bg-[#c94343] text-white font-bold cursor-pointer hover:bg-[#b93838] transition-colors max-[480px]:w-full"
          >
            {appointmentLabel}
          </button>
        )}

        <SpeakButton
          text={speechText}
          language={result.language}
          languageCode={result.language_code}
        />
      </div>
    </div>
  );
}

function MessageBubble({ message, onBookAppointment }) {
  if (message.kind === "error") {
    return (
      <div className="flex items-start gap-[18px] mb-[18px] max-[720px]:gap-2.5">
        <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946] max-[720px]:w-9 max-[720px]:min-w-9 max-[720px]:h-9 max-[720px]:rounded-[10px]">
          <ShieldPlus size={18} />
        </div>
        <div className="max-w-[min(740px,76%)] max-[720px]:max-w-[calc(100%-45px)] px-4 py-3.5 rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#f3caca] bg-[#fff4f4] text-[#a62f2f] text-[13px]">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.kind === "result") {
    return (
      <div className="flex items-start gap-[18px] mb-[18px] max-[720px]:gap-2.5">
        <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946] max-[720px]:w-9 max-[720px]:min-w-9 max-[720px]:h-9 max-[720px]:rounded-[10px]">
          <FileText size={18} />
        </div>
        <ResultCard result={message.data} onBookAppointment={onBookAppointment} />
      </div>
    );
  }

  if (message.kind === "info") {
    const answerText = message.data.answer || "No answer available.";
    return (
      <div className="flex items-start gap-[18px] mb-[18px] max-[720px]:gap-2.5">
        <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946] max-[720px]:w-9 max-[720px]:min-w-9 max-[720px]:h-9 max-[720px]:rounded-[10px]">
          <FileText size={18} />
        </div>
        <div className="max-w-[min(740px,76%)] max-[720px]:max-w-[calc(100%-45px)] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-[18px_22px] bg-white border border-[#e8e4dc] shadow-[0_2px_7px_rgba(30,40,50,0.035)] text-[#536074] text-[15px] leading-relaxed">
          <div>{answerText}</div>
          <SpeakButton
            text={answerText}
            language={message.data.language}
            languageCode={message.data.language_code}
          />
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start gap-[18px] mb-[18px] max-[720px]:gap-2.5 ${
        isUser ? "justify-end" : ""
      }`}
    >
      {!isUser && (
        <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946] max-[720px]:w-9 max-[720px]:min-w-9 max-[720px]:h-9 max-[720px]:rounded-[10px]">
          <ShieldPlus size={18} />
        </div>
      )}

      <div
        className={
          isUser
            ? "max-w-[min(740px,76%)] max-[720px]:max-w-[calc(100%-45px)] px-[18px] py-3 rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-2xl bg-[#0f5946] text-white text-sm leading-relaxed"
            : "max-w-[min(740px,76%)] max-[720px]:max-w-[calc(100%-45px)] px-[22px] py-[18px] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-white border border-[#e8e4dc] shadow-[0_2px_7px_rgba(30,40,50,0.035)] text-[#536074] text-[15px] leading-relaxed"
        }
      >
        {message.fromVoice && (
          <div className="flex items-center gap-1 mb-1 text-[10px] opacity-75">
            <Mic size={12} /> Voice message
          </div>
        )}
        <span>{message.text}</span>
      </div>
    </div>
  );
}

function formatWhen(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
}

function truncate(text, max = 42) {
  if (!text) return "New conversation";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

// ============================================================
// SIDEBAR — slide-in drawer on mobile
// ============================================================

function Sidebar({ sessions, activeSessionId, onSelect, onNewChat, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="hidden max-[720px]:block fixed inset-0 z-[35] bg-black/45"
        />
      )}

      <aside
        className={`w-[322px] min-w-[322px] h-screen flex flex-col px-[23px] pt-[26px] pb-5 bg-[#faf9f4] border-r border-[#e8e4dc]
          max-[900px]:w-[250px] max-[900px]:min-w-[250px]
          max-[720px]:fixed max-[720px]:top-0 max-[720px]:left-0 max-[720px]:z-40 max-[720px]:w-[82%] max-[720px]:max-w-[300px] max-[720px]:min-w-0
          max-[720px]:transition-transform max-[720px]:duration-250 max-[720px]:ease-in-out
          ${isOpen ? "max-[720px]:translate-x-0 max-[720px]:shadow-[12px_0_30px_rgba(0,0,0,0.15)]" : "max-[720px]:-translate-x-full"}
        `}
      >
        <div className="flex items-center gap-3.5 pb-[33px] max-[720px]:pb-5">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-white bg-[#0f5946]">
            <ShieldPlus size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="m-0 text-[17px] leading-tight font-bold text-[#17212f]">
              Vitalis AI
            </h1>
            <p className="mt-1 mb-0 text-[11px] text-[#7d8796] font-medium">
              Clinical Assistant
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close menu"
            className="hidden max-[720px]:grid ml-auto place-items-center w-8 h-8 rounded-lg text-[#667180] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="w-full h-14 flex items-center justify-center gap-2.5 rounded-[13px] bg-[#0f5946] text-white text-base font-bold cursor-pointer transition-all hover:bg-[#0e5b49] hover:-translate-y-px"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>New Session</span>
        </button>

        <nav className="mt-[27px] flex flex-col gap-2">
          <button
            type="button"
            className="w-full flex items-center gap-3.5 min-h-[46px] px-[18px] rounded-[13px] text-sm font-bold text-left cursor-pointer bg-[#d8f3e3] text-[#0f5946]"
          >
            <History size={18} />
            <span>Chat History</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center gap-3.5 min-h-[46px] px-[18px] rounded-[13px] text-sm font-medium text-left text-[#4d596a] cursor-pointer hover:bg-[#f0eee8]"
          >
            <Bookmark size={18} />
            <span>Saved Results</span>
          </button>
        </nav>

        <div className="mt-9 mx-2.5 mb-3.5 text-[#9aa2ae] text-[10px] tracking-wider font-bold">
          RECENT CASES
        </div>

        <nav className="flex-1 overflow-y-auto pr-0.5">
          {sessions.length === 0 && (
            <div className="px-2.5 py-2.5 text-[#9ca5b1] text-xs">
              No conversations yet
            </div>
          )}

          {sessions.map((s) => {
            const id = s._id;
            const isActive = id === activeSessionId;

            return (
              <button
                type="button"
                key={id || "untitled"}
                onClick={() => id && onSelect(id)}
                className={`w-full block text-left px-2.5 pt-[9px] pb-2.5 mb-[3px] rounded-[9px] text-[#202938] cursor-pointer hover:bg-[#f0eee8] ${
                  isActive ? "bg-[#f0eee8]" : ""
                }`}
              >
                <div className="overflow-hidden whitespace-nowrap text-ellipsis text-sm font-semibold leading-snug">
                  {truncate(s.lastMessage || s.firstMessage)}
                </div>
                <div className="flex gap-2 mt-1 text-[#9ca5b1] text-[11px]">
                  <span>{formatWhen(s.lastActivity)}</span>
                  <span>{s.messageCount || 0} msgs</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#e8e4dc] pt-[19px] flex flex-col gap-[3px]">
          <button
            type="button"
            className="w-full flex items-center gap-3.5 min-h-[46px] px-[18px] rounded-[13px] text-sm font-medium text-left text-[#4d596a] cursor-pointer hover:bg-[#f0eee8]"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center gap-3.5 min-h-[46px] px-[18px] rounded-[13px] text-sm font-medium text-left text-[#4d596a] cursor-pointer hover:bg-[#f0eee8]"
          >
            <Globe2 size={18} />
            <span>Language</span>
            <span className="ml-auto min-w-9 px-[7px] py-1 border border-[#e8e4dc] rounded-md bg-white text-[#7c8795] text-[10px] text-center">
              EN
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

const WELCOME =
  "Hello! I am Vitalis AI, your clinical assistant. Please describe your symptoms in detail.";

function ChatWindow({
  messages,
  isSending,
  isRecording,
  micStatus,
  hasMic,
  authWarning,
  onSend,
  onToggleRecording,
  onMenuClick,
  onBookAppointment,
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, micStatus]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const quickSymptoms = [
    { label: "Chest Tightness", icon: <Heart size={17} fill="currentColor" /> },
    { label: "Fatigue" },
    { label: "Severe Headache" },
  ];

  return (
    <main className="flex-1 min-w-0 h-screen flex flex-col bg-[#fdfcf9]">
      <header className="h-[76px] min-h-[76px] px-[27px] flex items-center justify-between border-b border-[#e8e4dc] bg-[#fdfcf9]/[.98] max-[720px]:h-16 max-[720px]:min-h-16 max-[720px]:px-3.5">
        <div className="flex items-center gap-[18px] max-[720px]:gap-2.5">
          <button
            type="button"
            title="Menu"
            onClick={onMenuClick}
            className="hidden max-[720px]:grid w-9 h-9 place-items-center rounded-[9px] text-[#667180] cursor-pointer hover:bg-[#f1efe9]"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5 text-[17px] font-bold text-[#202938] max-[720px]:text-[15px]">
            <span>Active Assessment</span>
            <span className="px-[7px] py-[3px] rounded-md bg-[#0f5946] text-white text-[9px] tracking-wide font-extrabold">
              LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Fullscreen"
            className="w-9 h-9 grid place-items-center rounded-[9px] text-[#667180] cursor-pointer hover:bg-[#f1efe9] max-[720px]:hidden"
          >
            <Maximize2 size={19} />
          </button>
        </div>
      </header>

      <section className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex gap-2 pt-[27px] px-9 max-[900px]:px-6 max-[720px]:pt-4 max-[720px]:px-3.5 max-[720px]:overflow-x-auto">
          {quickSymptoms.map((item, index) => (
            <button
              type="button"
              key={item.label}
              onClick={() => setInput(item.label)}
              className={`h-11 px-[18px] inline-flex items-center justify-center gap-2.5 rounded-[13px] border text-[15px] font-medium cursor-pointer whitespace-nowrap shadow-[0_2px_5px_rgba(30,40,50,0.025)] max-[720px]:h-10 max-[720px]:px-3.5 max-[720px]:text-[13px] ${
                index === 0
                  ? "border-[#0f5946] bg-[#0f5946] text-white font-semibold"
                  : "border-[#e8e4dc] bg-white text-[#566174] hover:border-[#cfd8d2] hover:bg-[#fbfffc]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto scroll-smooth px-9 pt-7 pb-[165px] max-[900px]:px-6 max-[720px]:px-3.5 max-[720px]:pt-5 max-[720px]:pb-[145px]"
        >
          {messages.length === 0 && (
            <div className="flex items-start gap-[18px] mb-[18px]">
              <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946]">
                <FileText size={18} />
              </div>
              <div className="max-w-[min(740px,76%)] px-[22px] py-[18px] rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-white border border-[#e8e4dc] shadow-[0_2px_7px_rgba(30,40,50,0.035)] text-[#536074] text-[15px] leading-relaxed">
                {WELCOME}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onBookAppointment={onBookAppointment} />
          ))}

          {authWarning && (
            <div className="flex items-start gap-[18px] mb-[18px]">
              <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946]">
                <ShieldPlus size={18} />
              </div>
              <div className="max-w-[min(740px,76%)] px-4 py-3.5 rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[#f3caca] bg-[#fff4f4] text-[#a62f2f] text-[13px]">
                {authWarning}
              </div>
            </div>
          )}

          {isSending && (
            <div className="flex items-start gap-[18px] mb-[18px]">
              <div className="w-[42px] min-w-[42px] h-[42px] grid place-items-center rounded-[13px] text-white bg-[#0f5946]">
                <Sparkles size={17} />
              </div>
              <div className="min-h-11 flex items-center gap-1.5 px-3.5 text-[#7d8796]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ca79e] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ca79e] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ca79e] animate-bounce [animation-delay:300ms]" />
                <em className="ml-[7px] text-xs not-italic">Analyzing...</em>
              </div>
            </div>
          )}

          {micStatus && (
            <div className="w-fit mx-auto my-1 flex items-center gap-[7px] text-[#146b55] text-xs">
              <Mic size={15} /> {micStatus}
            </div>
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 z-[5] w-[min(870px,calc(100%-70px))] max-[720px]:bottom-3 max-[720px]:w-[calc(100%-20px)]">
          <div className="min-h-16 flex items-center gap-2 pl-3.5 pr-2.5 py-[7px] rounded-[17px] border border-[#e6e1d9] bg-white shadow-[0_12px_30px_rgba(40,47,56,0.08)] max-[720px]:min-h-[58px] max-[720px]:rounded-2xl max-[480px]:pl-2.5 max-[480px]:pr-1.5 max-[480px]:gap-1">
            <button
              type="button"
              title="Attach file"
              className="w-[38px] min-w-[38px] h-[42px] grid place-items-center rounded-[9px] text-[#9aa4b2] cursor-pointer hover:bg-[#f5f4f0] hover:text-[#6c7786] max-[480px]:w-[34px] max-[480px]:min-w-[34px] max-[480px]:h-9"
            >
              <Paperclip size={20} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe how you're feeling..."
              autoComplete="off"
              className="flex-1 min-w-0 h-[46px] border-0 outline-none bg-transparent text-[#364153] font-sans text-[15px] placeholder:text-[#a2a9b4] max-[480px]:text-sm"
            />

            <button
              type="button"
              id="vn-mic-btn"
              title={isRecording ? "Stop recording" : "Speak"}
              disabled={!hasMic || isSending}
              onClick={onToggleRecording}
              className={`w-[38px] min-w-[38px] h-[42px] grid place-items-center rounded-[9px] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed max-[480px]:w-[34px] max-[480px]:min-w-[34px] max-[480px]:h-9 ${
                isRecording
                  ? "text-[#c73f3f] bg-[#ffeded] animate-pulse"
                  : "text-[#9aa4b2] hover:bg-[#f5f4f0] hover:text-[#6c7786]"
              }`}
            >
              {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={20} />}
            </button>

            <button
              type="button"
              title="Send message"
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="w-[46px] min-w-[46px] h-[46px] grid place-items-center rounded-xl bg-[#8eb3a9] text-white cursor-pointer transition-all disabled:opacity-55 disabled:cursor-not-allowed enabled:hover:bg-[#0f5946] enabled:hover:-translate-y-px max-[480px]:w-10 max-[480px]:min-w-10 max-[480px]:h-10"
            >
              <Send size={18} fill="currentColor" />
            </button>
          </div>

          <div className="mt-2 text-center text-[#a4abb5] text-[10px] max-[720px]:hidden">
            Vitalis AI provides clinical guidance and does not replace professional medical advice.
          </div>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// APPOINTMENT BOOKING VIEW (the "next route")
// ============================================================

function AppointmentPage({ context, onBack }) {
  const storedProfile = readStoredProfile();

  const buildInitialForm = useCallback(
    () => ({
      fullName: storedProfile.fullName,
      email: storedProfile.email,
      phone: storedProfile.phone,
      age: "",
      gender: "",
      address: storedProfile.address,
      reason: context?.disease || "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
      hospitalId: "",
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [context]
  );

  const [form, setForm] = useState(buildInitialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const [hospitals, setHospitals] = useState([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const [hospitalsError, setHospitalsError] = useState("");

  // Load the hospital list once, when the booking page mounts.
  useEffect(() => {
    let isMounted = true;

    async function loadHospitals() {
      setHospitalsLoading(true);
      try {
        const list = await fetchHospitalsRequest();
        if (isMounted) {
          setHospitals(list);
          setHospitalsError("");
        }
      } catch (err) {
        if (isMounted) {
          setHospitalsError(err.message || "Could not load hospitals.");
        }
      } finally {
        if (isMounted) setHospitalsLoading(false);
      }
    }

    loadHospitals();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    // "Cancel" discards manual edits and re-autofills from localStorage.
    setForm(buildInitialForm());
    setStatus("idle");
    setErrorMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.preferredDate || !form.hospitalId) {
      setErrorMsg("Please fill in name, phone, hospital, and a preferred date.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      await bookAppointmentRequest({
        ...form,
        userId: storedProfile.id || undefined,
        disease: context?.disease || "",
        severity: context?.severity || "",
        confidence: context?.confidence || "",
        riskScore: context?.riskScore ?? null,
        symptomScore: context?.symptomScore ?? null,
        vectorScore: context?.vectorScore ?? null,
        matchedSymptoms: context?.matchedSymptoms || [],
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "success") {
    const selectedHospital = hospitals.find((h) => h._id === form.hospitalId);

    return (
      <main className="flex-1 min-w-0 h-screen flex flex-col items-center justify-center bg-[#fdfcf9] px-6 text-center">
        <div className="w-16 h-16 grid place-items-center rounded-full bg-[#d8f3e3] text-[#0f5946] mb-5">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-[#202938] mb-2">Appointment booked</h2>
        <p className="text-[#7d8796] max-w-sm mb-8">
          We've scheduled your visit for {form.reason || "your consultation"}
          {selectedHospital ? ` at ${selectedHospital.hospitalName}` : ""} on{" "}
          {form.preferredDate}
          {form.preferredTime ? ` at ${form.preferredTime}` : ""}. A confirmation will be
          sent to {form.email || "your registered contact"}.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-6 rounded-[13px] bg-[#0f5946] text-white font-bold cursor-pointer hover:bg-[#0e5b49]"
        >
          Back to chat
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 h-screen flex flex-col bg-[#fdfcf9]">
      <header className="h-[76px] min-h-[76px] px-[27px] flex items-center gap-[18px] border-b border-[#e8e4dc] bg-[#fdfcf9]/[.98] max-[720px]:h-16 max-[720px]:min-h-16 max-[720px]:px-3.5">
        <button
          type="button"
          title="Back to chat"
          onClick={onBack}
          className="w-9 h-9 grid place-items-center rounded-[9px] text-[#667180] cursor-pointer hover:bg-[#f1efe9]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2.5 text-[17px] font-bold text-[#202938] max-[720px]:text-[15px]">
          <Calendar size={18} className="text-[#0f5946]" />
          <span>Book Appointment</span>
        </div>
      </header>

      <section className="flex-1 min-h-0 overflow-y-auto px-9 py-8 max-[900px]:px-6 max-[720px]:px-3.5 max-[720px]:py-5">
        <form
          onSubmit={handleSubmit}
          className="max-w-[640px] mx-auto bg-white border border-[#e8e4dc] rounded-2xl shadow-[0_8px_26px_rgba(32,41,56,0.06)] p-7 max-[720px]:p-4"
        >
          {context?.disease && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#effaf4] border border-[#d8f3e3] text-sm text-[#146b55]">
              Booking a consultation for <strong>{context.disease}</strong>
              {context.severity ? ` · ${context.severity} severity` : ""}
              {context.confidence ? ` · ${context.confidence} confidence` : ""}
              {typeof context.riskScore === "number"
                ? ` · risk score ${context.riskScore.toFixed(2)}`
                : ""}
              . Fields below were auto-filled from your saved profile — feel free to edit
              them.
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-[#f3caca] bg-[#fff4f4] text-[#a62f2f] text-sm">
              {errorMsg}
            </div>
          )}

          {hospitalsError && (
            <div className="mb-6 px-4 py-3 rounded-xl border border-[#f3caca] bg-[#fff4f4] text-[#a62f2f] text-sm">
              {hospitalsError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
            {/* Hospital selection — placed first so it's the top priority
                choice, and spans both columns since it's the most important
                decision the person makes on this form. */}
            <Field label="Select hospital" required full>
              <div className="relative">
                <select
                  value={form.hospitalId}
                  onChange={(e) => updateField("hospitalId", e.target.value)}
                  disabled={hospitalsLoading || hospitals.length === 0}
                  className={`${inputClasses} appearance-none disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {hospitalsLoading
                      ? "Loading hospitals..."
                      : hospitals.length === 0
                      ? "No hospitals available"
                      : "-- Choose a hospital --"}
                  </option>
                  {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.hospitalName}
                      {h.address?.city ? ` — ${h.address.city}` : ""}
                    </option>
                  ))}
                </select>
                <Building2
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa4b2] pointer-events-none"
                />
              </div>
            </Field>

            <Field label="Full name" required>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={inputClasses}
                placeholder="Your name"
              />
            </Field>

            <Field label="Phone" required>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClasses}
                placeholder="10-digit mobile number"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClasses}
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Age">
              <input
                type="number"
                min="0"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                className={inputClasses}
                placeholder="Age"
              />
            </Field>

            <Field label="Gender">
              <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className={inputClasses}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Reason for visit">
              <input
                type="text"
                value={form.reason}
                onChange={(e) => updateField("reason", e.target.value)}
                className={inputClasses}
                placeholder="Reason for visit"
              />
            </Field>

            <Field label="Preferred date" required>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) => updateField("preferredDate", e.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label="Preferred time">
              <input
                type="time"
                value={form.preferredTime}
                onChange={(e) => updateField("preferredTime", e.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label="Address" full>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className={inputClasses}
                placeholder="Address"
              />
            </Field>

            <Field label="Notes" full>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className={`${inputClasses} resize-none`}
                placeholder="Anything else the doctor should know"
              />
            </Field>
          </div>

          <div className="flex gap-3 mt-7 max-[480px]:flex-col">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="flex-1 h-12 rounded-[13px] bg-[#0f5946] text-white font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#0e5b49] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" && <Loader2 size={18} className="animate-spin" />}
              {status === "submitting" ? "Booking..." : "Confirm Appointment"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="h-12 px-5 rounded-[13px] border border-[#e8e4dc] bg-white text-[#536074] font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#f5f4f0]"
            >
              <RotateCcw size={16} />
              Cancel &amp; Autofill
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const inputClasses =
  "w-full h-11 px-3.5 rounded-[10px] border border-[#e8e4dc] bg-white text-sm text-[#364153] outline-none focus:border-[#0f5946] focus:ring-2 focus:ring-[#d8f3e3]";

function Field({ label, required, full, children }) {
  return (
    <label className={`flex flex-col gap-1.5 text-xs font-semibold text-[#374354] ${full ? "col-span-2 max-[480px]:col-span-1" : ""}`}>
      <span>
        {label}
        {required && <span className="text-[#c94343]"> *</span>}
      </span>
      {children}
    </label>
  );
}

// ============================================================
// CHAT STATE (was useChat.js)
// ============================================================

let nextLocalId = 1;
function localId() {
  return `local_${nextLocalId++}`;
}

function messageFromHistoryRow(chat) {
  if (chat.role === "user") {
    return {
      id: chat._id || localId(),
      role: "user",
      kind: "text",
      text: chat.message,
      fromVoice: !!chat.fromVoice,
    };
  }

  if (chat.responseData && typeof chat.responseData === "object") {
    return {
      id: chat._id || localId(),
      role: "bot",
      kind: chat.type === "info" ? "info" : "result",
      data: chat.responseData,
    };
  }

  return {
    id: chat._id || localId(),
    role: "bot",
    kind: "text",
    text: chat.message,
  };
}

function useChat() {
  const [sessionId, setSessionId] = useState(
    () => localStorage.getItem("activeChatSessionId") || generateSessionId()
  );
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micStatus, setMicStatus] = useState(null);
  const [authWarning, setAuthWarning] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);

  const hasMic =
    typeof navigator !== "undefined" &&
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  useEffect(() => {
    localStorage.setItem("activeChatSessionId", sessionId);
  }, [sessionId]);

  const refreshSessions = useCallback(async () => {
    const list = await fetchChatSessions();
    setSessions(list);
    return list;
  }, []);

  const loadSession = useCallback(async (id) => {
    const { messages: rows, unauthorized, noToken } = await fetchChatHistory(id);

    if (unauthorized) {
      setAuthWarning("Your login session has expired. Please login again.");
      return;
    }

    if (noToken) {
      setAuthWarning("Please login first to use chat history.");
      return;
    }

    setAuthWarning(null);
    setMessages(rows.map(messageFromHistoryRow));
  }, []);

  useEffect(() => {
    if (!getToken()) {
      setAuthWarning("Please login first to use chat history.");
      return;
    }
    refreshSessions();
    loadSession(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newChat = useCallback(() => {
    const id = generateSessionId();
    setSessionId(id);
    setMessages([]);
    setAuthWarning(null);
  }, []);

  const selectSession = useCallback(
    async (id) => {
      if (id === sessionId) return;
      setSessionId(id);
      await loadSession(id);
    },
    [sessionId, loadSession]
  );

  const pushMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { id: localId(), ...msg }]);
  }, []);

  const handleResult = useCallback(
    async (result, { fromVoice = false } = {}) => {
      if (result.type === "info") {
        pushMessage({ role: "bot", kind: "info", data: result });
        await saveChatMessage({
          sessionId,
          role: "bot",
          message: result.answer || "No answer available.",
          type: "info",
          responseData: result,
          language: result.language || result.language_code || null,
          fromVoice,
        });
      } else {
        pushMessage({ role: "bot", kind: "result", data: result });
        await saveChatMessage({
          sessionId,
          role: "bot",
          message:
            result.predicted_disease || result.reasoning || "Health prediction result",
          type: "prediction",
          responseData: result,
          language: result.language || result.language_code || null,
          fromVoice,
        });
      }
      refreshSessions();
    },
    [sessionId, pushMessage, refreshSessions]
  );

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || "").trim();
      if (!trimmed) return;

      pushMessage({ role: "user", kind: "text", text: trimmed, fromVoice: false });
      saveChatMessage({
        sessionId,
        role: "user",
        message: trimmed,
        type: "text",
        fromVoice: false,
      });

      setIsSending(true);
      try {
        const result = await sendTextMessage(trimmed);
        await handleResult(result, { fromVoice: false });
      } catch (err) {
        pushMessage({ role: "bot", kind: "error", text: "Error: " + err.message });
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, pushMessage, handleResult]
  );

  const sendVoice = useCallback(
    async (audioBlob) => {
      setIsSending(true);
      try {
        const result = await sendVoiceMessage(audioBlob);

        if (result.transcript) {
          pushMessage({
            role: "user",
            kind: "text",
            text: result.transcript,
            fromVoice: true,
          });
          saveChatMessage({
            sessionId,
            role: "user",
            message: result.transcript,
            type: "voice",
            language: result.language || result.language_code || null,
            fromVoice: true,
          });
        }

        await handleResult(result, { fromVoice: true });
      } catch (err) {
        pushMessage({ role: "bot", kind: "error", text: "Error: " + err.message });
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, pushMessage, handleResult]
  );

  const startRecording = useCallback(async () => {
    if (!hasMic) return;

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch {
      pushMessage({
        role: "bot",
        kind: "error",
        text: "Mic permission denied ya mic available nahi hai.",
      });
      return;
    }

    audioChunksRef.current = [];

    const mimeType = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "";

    const recorder = mimeType
      ? new MediaRecorder(mediaStreamRef.current, { mimeType })
      : new MediaRecorder(mediaStreamRef.current);

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      const blob = new Blob(audioChunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      sendVoice(blob);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
    setMicStatus("Sun raha hoon... bolo, phir ⏹ dabao");
  }, [hasMic, sendVoice, pushMessage]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setMicStatus(null);
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    sessionId,
    sessions,
    messages,
    isSending,
    isRecording,
    micStatus,
    hasMic,
    authWarning,
    newChat,
    selectSession,
    sendMessage,
    toggleRecording,
  };
}

// ============================================================
// TOP-LEVEL EXPORT — single component, drop in anywhere
// ============================================================

export default function Chatbot() {
  useEffect(() => {
    document.title = "Vitalis AI | Accessible Health Assistant";
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // "route" state: swap this for react-router's <Routes> if your app already
  // uses a router — pass the same `appointmentContext` as location state.
  const [view, setView] = useState("chat"); // "chat" | "appointment"
  const [appointmentContext, setAppointmentContext] = useState(null);

  const {
    sessionId,
    sessions,
    messages,
    isSending,
    isRecording,
    micStatus,
    hasMic,
    authWarning,
    newChat,
    selectSession,
    sendMessage,
    toggleRecording,
  } = useChat();

  // Now receives the extra risk details (confidence, matched symptoms, hybrid
  // score) alongside the disease + severity that were already being passed.
  function handleBookAppointment(disease, severity, riskDetails = {}) {
    setAppointmentContext({ disease, severity, ...riskDetails });
    setView("appointment");
  }

  return (
    <div className="w-full h-screen overflow-hidden flex bg-[#fbfaf7] font-sans">
      {view === "chat" && (
        <Sidebar
          sessions={sessions}
          activeSessionId={sessionId}
          onSelect={(id) => {
            selectSession(id);
            setSidebarOpen(false);
          }}
          onNewChat={() => {
            newChat();
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {view === "chat" ? (
        <ChatWindow
          messages={messages}
          isSending={isSending}
          isRecording={isRecording}
          micStatus={micStatus}
          hasMic={hasMic}
          authWarning={authWarning}
          onSend={sendMessage}
          onToggleRecording={toggleRecording}
          onMenuClick={() => setSidebarOpen(true)}
          onBookAppointment={handleBookAppointment}
        />
      ) : (
        <AppointmentPage
          context={appointmentContext}
          onBack={() => setView("chat")}
        />
      )}
    </div>
  );
}