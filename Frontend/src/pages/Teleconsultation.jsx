import { useState } from "react";
import {
  Activity,
  Bell,
  ChevronRight,
  Clock,
  FlaskConical,
  HeartPulse,
  Mic,
  MicOff,
  Phone,
  Pill,
  PlusCircle,
  Search,
  Syringe,
  Video,
  VideoOff,
} from "lucide-react";

// ============================================================
// SAMPLE DATA — replace with real API data
// ============================================================

const DOCTOR = {
  name: "Dr. Ananya Sharma",
  specialty: "General Physician",
  experience: "12 yrs experience",
  rating: "4.9",
  nextSlot: "10:30 AM Today",
};

const UPCOMING_CALLS = [
  { id: 1, doctor: "Dr. Ananya Sharma", specialty: "General Physician", time: "10:30 AM", date: "Today" },
  { id: 2, doctor: "Dr. Rohit Verma", specialty: "Cardiologist", time: "4:00 PM", date: "12 Sep" },
];

const PATIENT = {
  name: "Tiwari",
  age: 26,
  gender: "Male",
  bloodGroup: "B+",
  lastVisit: "18 Aug 2026",
};

const VITALS = [
  { label: "Blood Pressure", value: "122/80", unit: "mmHg", trend: "steady" },
  { label: "Heart Rate", value: "76", unit: "bpm", trend: "steady" },
  { label: "Blood Sugar", value: "98", unit: "mg/dL", trend: "steady" },
];

const CONDITIONS = ["Seasonal Allergies", "Mild Hypertension"];

const MEDICATIONS = [
  { name: "Amlodipine 5mg", freq: "Once daily" },
  { name: "Cetirizine 10mg", freq: "As needed" },
];

const ALLERGIES = ["Penicillin", "Dust"];

const VISIT_HISTORY = [
  { date: "18 Aug 2026", reason: "Routine checkup", doctor: "Dr. Ananya Sharma" },
  { date: "02 Jun 2026", reason: "Fever & fatigue", doctor: "Dr. Rohit Verma" },
  { date: "14 Mar 2026", reason: "Allergy consultation", doctor: "Dr. Ananya Sharma" },
];

// ============================================================
// TOPBAR
// ============================================================

function Topbar() {
  return (
    <header className="vx-topbar">
      <div className="vx-search">
        <Search size={17} />
        <input type="text" placeholder="Search records, doctors..." />
      </div>

      <div className="vx-topbar-actions">
        <button type="button" className="vx-icon-btn" title="Notifications">
          <Bell size={19} />
          <span className="vx-dot" />
        </button>
        <div className="vx-avatar">t</div>
      </div>
    </header>
  );
}

// ============================================================
// LIVE CALL PANEL
// ============================================================

function CallPanel() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="vx-call-card">
      <div className="vx-call-stage">
        <div className="vx-call-doctor-tile">
          <div className="vx-call-avatar">AS</div>
          <div className="vx-call-name">{DOCTOR.name}</div>
          <div className="vx-call-role">{DOCTOR.specialty}</div>
        </div>

        <div className="vx-call-self-tile">
          {camOn ? (
            <div className="vx-self-preview">t</div>
          ) : (
            <div className="vx-self-preview off">
              <VideoOff size={18} />
            </div>
          )}
        </div>

        <span className="vx-live-pill">
          <span className="vx-live-blip" /> LIVE · 00:00
        </span>
      </div>

      <div className="vx-call-controls">
        <button
          type="button"
          className={`vx-call-btn${micOn ? "" : " muted"}`}
          onClick={() => setMicOn((v) => !v)}
          title={micOn ? "Mute mic" : "Unmute mic"}
        >
          {micOn ? <Mic size={19} /> : <MicOff size={19} />}
        </button>

        <button
          type="button"
          className={`vx-call-btn${camOn ? "" : " muted"}`}
          onClick={() => setCamOn((v) => !v)}
          title={camOn ? "Turn camera off" : "Turn camera on"}
        >
          {camOn ? <Video size={19} /> : <VideoOff size={19} />}
        </button>

        <button type="button" className="vx-call-btn end" title="End call">
          <Phone size={19} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// UPCOMING CONSULTATIONS
// ============================================================

function UpcomingList() {
  return (
    <div className="vx-panel">
      <div className="vx-panel-head">
        <h3>Upcoming Consultations</h3>
        <button type="button" className="vx-link-btn">
          <PlusCircle size={15} />
          Book new
        </button>
      </div>

      <div className="vx-upcoming-list">
        {UPCOMING_CALLS.map((c) => (
          <div className="vx-upcoming-item" key={c.id}>
            <div className="vx-upcoming-avatar">
              {c.doctor.split(" ").slice(-1)[0][0]}
            </div>
            <div className="vx-upcoming-info">
              <div className="vx-upcoming-doctor">{c.doctor}</div>
              <div className="vx-upcoming-specialty">{c.specialty}</div>
            </div>
            <div className="vx-upcoming-time">
              <Clock size={13} />
              {c.time} · {c.date}
            </div>
            <button type="button" className="vx-join-btn">
              Join
              <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PATIENT HISTORY — RIGHT PANEL
// ============================================================

function PatientHistoryPanel() {
  return (
    <aside className="vx-history">
      <div className="vx-history-header">
        <div className="vx-history-avatar">
          {PATIENT.name[0].toUpperCase()}
        </div>
        <div>
          <div className="vx-history-name">{PATIENT.name}</div>
          <div className="vx-history-meta">
            {PATIENT.age} yrs · {PATIENT.gender} · {PATIENT.bloodGroup}
          </div>
        </div>
      </div>

      <div className="vx-history-section">
        <div className="vx-history-section-title">
          <HeartPulse size={15} />
          Latest Vitals
        </div>
        <div className="vx-vitals-grid">
          {VITALS.map((v) => (
            <div className="vx-vital-card" key={v.label}>
              <div className="vx-vital-value">{v.value}</div>
              <div className="vx-vital-unit">{v.unit}</div>
              <div className="vx-vital-label">{v.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="vx-history-section">
        <div className="vx-history-section-title">
          <Activity size={15} />
          Known Conditions
        </div>
        <div className="vx-chip-row">
          {CONDITIONS.map((c) => (
            <span className="vx-chip" key={c}>{c}</span>
          ))}
        </div>
      </div>

      <div className="vx-history-section">
        <div className="vx-history-section-title">
          <Pill size={15} />
          Current Medications
        </div>
        <div className="vx-med-list">
          {MEDICATIONS.map((m) => (
            <div className="vx-med-row" key={m.name}>
              <span className="vx-med-name">{m.name}</span>
              <span className="vx-med-freq">{m.freq}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="vx-history-section">
        <div className="vx-history-section-title">
          <Syringe size={15} />
          Allergies
        </div>
        <div className="vx-chip-row">
          {ALLERGIES.map((a) => (
            <span className="vx-chip warn" key={a}>{a}</span>
          ))}
        </div>
      </div>

      <div className="vx-history-section last">
        <div className="vx-history-section-title">
          <FlaskConical size={15} />
          Visit History
        </div>
        <div className="vx-timeline">
          {VISIT_HISTORY.map((v, i) => (
            <div className="vx-timeline-item" key={i}>
              <div className="vx-timeline-dot" />
              <div className="vx-timeline-content">
                <div className="vx-timeline-reason">{v.reason}</div>
                <div className="vx-timeline-meta">{v.date} · {v.doctor}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// STYLES
// ============================================================

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --vx-green-900: #0f5946;
  --vx-green-800: #0e5b49;
  --vx-green-100: #d8f3e3;
  --vx-bg: #fdf3ee;
  --vx-white: #ffffff;
  --vx-border: #efe2d8;
  --vx-text: #202938;
  --vx-muted: #8b7f76;
  --vx-orange: #c8662b;
  --vx-blue: #2f6fb0;
  --vx-danger: #c73f3f;
  --vx-shadow: 0 8px 26px rgba(70, 45, 20, 0.06);
}

* { box-sizing: border-box; }

.vx-app {
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
  width: 100%;
  min-height: 100vh;
  background: var(--vx-bg);
  color: var(--vx-text);
}

/* ================= MAIN ================= */

.vx-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.vx-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 32px;
  border-bottom: 1px solid var(--vx-border);
}

.vx-search {
  flex: 1;
  max-width: 520px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 18px;
  border-radius: 23px;
  background: #f1e6dd;
  color: #8a7d72;
}

.vx-search input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--vx-text);
  font-family: inherit;
}

.vx-search input::placeholder {
  color: #a79a8f;
}

.vx-topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.vx-icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #4a4038;
  cursor: pointer;
}

.vx-icon-btn:hover {
  background: #f1e6dd;
}

.vx-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d64545;
  border: 2px solid var(--vx-bg);
}

.vx-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f2e5da;
  border: 1px solid var(--vx-border);
  color: #4a4038;
  font-weight: 700;
  font-size: 14px;
}

.vx-page-body {
  flex: 1;
  display: flex;
  gap: 26px;
  padding: 30px 32px 40px;
  align-items: flex-start;
}

.vx-page-heading h2 {
  margin: 0 0 6px;
  font-size: 30px;
  font-weight: 800;
  color: var(--vx-green-900);
}

.vx-page-heading p {
  margin: 0 0 24px;
  color: var(--vx-muted);
  font-size: 14.5px;
}

/* ================= LEFT COLUMN ================= */

.vx-left-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* --- Call card --- */

.vx-call-card {
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(160deg, #163f34 0%, #0c2b23 100%);
  box-shadow: var(--vx-shadow);
}

.vx-call-stage {
  position: relative;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vx-call-doctor-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #eaf3ee;
}

.vx-call-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.18);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: .5px;
}

.vx-call-name {
  font-size: 17px;
  font-weight: 700;
}

.vx-call-role {
  font-size: 12.5px;
  color: #b7cdc4;
}

.vx-call-self-tile {
  position: absolute;
  bottom: 18px;
  right: 18px;
  width: 108px;
  height: 76px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.2);
  background: #0a2019;
}

.vx-self-preview {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #1c4a3c;
  color: #fff;
  font-weight: 700;
}

.vx-self-preview.off {
  background: #12241f;
  color: #7c9a90;
}

.vx-live-pill {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 20px;
  background: rgba(0,0,0,.3);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .3px;
}

.vx-live-blip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff5c5c;
}

.vx-call-controls {
  display: flex;
  justify-content: center;
  gap: 14px;
  padding: 18px 0 22px;
}

.vx-call-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 0;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.12);
  color: #fff;
  cursor: pointer;
}

.vx-call-btn:hover {
  background: rgba(255,255,255,.2);
}

.vx-call-btn.muted {
  background: rgba(255,255,255,.06);
  color: #94a8a1;
}

.vx-call-btn.end {
  background: var(--vx-danger);
}

.vx-call-btn.end:hover {
  background: #b23434;
}

/* --- Panels --- */

.vx-panel {
  background: var(--vx-white);
  border: 1px solid var(--vx-border);
  border-radius: 20px;
  padding: 22px 24px;
  box-shadow: var(--vx-shadow);
}

.vx-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.vx-panel-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #24322b;
}

.vx-link-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  color: var(--vx-green-900);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}

.vx-upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vx-upcoming-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--vx-border);
}

.vx-upcoming-avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--vx-green-100);
  color: var(--vx-green-900);
  font-weight: 700;
}

.vx-upcoming-info {
  flex: 1;
  min-width: 0;
}

.vx-upcoming-doctor {
  font-size: 14.5px;
  font-weight: 700;
  color: #24322b;
}

.vx-upcoming-specialty {
  font-size: 12.5px;
  color: var(--vx-muted);
}

.vx-upcoming-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vx-muted);
  white-space: nowrap;
}

.vx-join-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  border: 0;
  border-radius: 10px;
  background: var(--vx-green-900);
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
}

.vx-join-btn:hover {
  background: var(--vx-green-800);
}

/* ================= RIGHT: PATIENT HISTORY ================= */

.vx-history {
  width: 340px;
  min-width: 340px;
  background: var(--vx-white);
  border: 1px solid var(--vx-border);
  border-radius: 20px;
  padding: 22px 22px 26px;
  box-shadow: var(--vx-shadow);
  align-self: flex-start;
}

.vx-history-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--vx-border);
  margin-bottom: 18px;
}

.vx-history-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--vx-green-900);
  color: #fff;
  font-weight: 700;
  font-size: 17px;
}

.vx-history-name {
  font-size: 15.5px;
  font-weight: 700;
  color: #24322b;
}

.vx-history-meta {
  font-size: 12px;
  color: var(--vx-muted);
  margin-top: 2px;
}

.vx-history-section {
  margin-bottom: 20px;
}

.vx-history-section.last {
  margin-bottom: 0;
}

.vx-history-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--vx-green-900);
  margin-bottom: 10px;
}

.vx-vitals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.vx-vital-card {
  border: 1px solid var(--vx-border);
  border-radius: 12px;
  padding: 10px 8px;
  text-align: center;
}

.vx-vital-value {
  font-size: 16px;
  font-weight: 800;
  color: #24322b;
  line-height: 1.1;
}

.vx-vital-unit {
  font-size: 9.5px;
  color: var(--vx-muted);
  margin-top: 1px;
}

.vx-vital-label {
  font-size: 10px;
  color: #8b7f76;
  margin-top: 6px;
  line-height: 1.25;
}

.vx-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.vx-chip {
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--vx-green-100);
  color: var(--vx-green-900);
  font-size: 12px;
  font-weight: 600;
}

.vx-chip.warn {
  background: #fde3e3;
  color: #b23434;
}

.vx-med-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vx-med-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border: 1px solid var(--vx-border);
  border-radius: 10px;
}

.vx-med-name {
  font-size: 13px;
  font-weight: 600;
  color: #24322b;
}

.vx-med-freq {
  font-size: 11.5px;
  color: var(--vx-muted);
}

.vx-timeline {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.vx-timeline-item {
  display: flex;
  gap: 10px;
}

.vx-timeline-dot {
  width: 8px;
  height: 8px;
  min-width: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--vx-green-900);
}

.vx-timeline-reason {
  font-size: 13px;
  font-weight: 600;
  color: #24322b;
}

.vx-timeline-meta {
  font-size: 11.5px;
  color: var(--vx-muted);
  margin-top: 2px;
}

/* ================= RESPONSIVE ================= */

@media (max-width: 1180px) {
  .vx-page-body {
    flex-direction: column;
  }

  .vx-history {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 720px) {
  .vx-topbar {
    padding: 16px 18px;
  }

  .vx-page-body {
    padding: 20px 16px 32px;
  }

  .vx-page-heading h2 {
    font-size: 24px;
  }

  .vx-call-stage {
    height: 260px;
  }

  .vx-vitals-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

function useInjectStyles() {
  if (typeof document !== "undefined" && !document.getElementById("vx-teleconsult-styles")) {
    const tag = document.createElement("style");
    tag.id = "vx-teleconsult-styles";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
  }
}

// ============================================================
// PAGE EXPORT
// ============================================================

export default function TeleconsultationPage() {
  useInjectStyles();

  return (
    <div className="vx-app">
      <div className="vx-main">
        <Topbar />

        <div className="vx-page-body">
          <div className="vx-left-col">
            <div className="vx-page-heading">
              <h2>Teleconsultation</h2>
              <p>Connect with your doctor over video, right from your dashboard.</p>
            </div>

            <CallPanel />
            <UpcomingList />
          </div>

          <PatientHistoryPanel />
        </div>
      </div>
    </div>
  );
}