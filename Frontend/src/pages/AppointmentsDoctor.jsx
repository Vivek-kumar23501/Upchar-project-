import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Loader2,
  Phone,
  RefreshCcw,
  Search,
  ShieldPlus,
  User,
} from "lucide-react";

// ============================================================
// API CONFIGURATION — match these to your existing setup
// ============================================================

const NODE_API_BASE = "http://localhost:8080";
const APPOINTMENTS_ALL_URL = `${NODE_API_BASE}/appointments/all`;
const APPOINTMENT_STATUS_URL = (id) => `${NODE_API_BASE}/appointments/${id}/status`;

function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ============================================================
// DATA FETCHING
// ============================================================

async function fetchAllAppointments({ status, search }) {
  const token = getToken();
  if (!token) {
    return { appointments: [], unauthorized: false, noToken: true };
  }

  const params = new URLSearchParams();
  if (status && status !== "all") params.set("status", status);
  if (search) params.set("search", search);

  const response = await fetch(
    `${APPOINTMENTS_ALL_URL}${params.toString() ? `?${params}` : ""}`,
    { method: "GET", headers: getAuthHeaders() }
  );

  if (response.status === 401) {
    return { appointments: [], unauthorized: true, noToken: false };
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Could not load appointments.");
  }

  return { appointments: data.appointments || [], unauthorized: false, noToken: false };
}

async function updateAppointmentStatus(id, status) {
  const response = await fetch(APPOINTMENT_STATUS_URL(id), {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Could not update status.");
  }

  return data.appointment;
}

// ============================================================
// SMALL PRESENTATIONAL BITS
// ============================================================

const STATUS_META = {
  pending: { label: "Pending", classes: "bg-[#fff4cf] text-[#8b6611]" },
  forward: { label: "Forwarded", classes: "bg-[#dceafd] text-[#1c5ea8]" },
  referred: { label: "Referred", classes: "bg-[#eee0fb] text-[#6b3fa0]" },
  completed: { label: "Completed", classes: "bg-[#dcf5e5] text-[#176a3e]" },
};

const SEVERITY_META = {
  low: "bg-[#dcf5e5] text-[#176a3e]",
  medium: "bg-[#fff4cf] text-[#8b6611]",
  high: "bg-[#ffe1e1] text-[#a52d2d]",
  unknown: "bg-[#eceff1] text-[#56616e]",
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.classes}`}>
      {meta.label}
    </span>
  );
}

function StatusSelect({ value, onChange, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-9 pl-3 pr-8 rounded-[9px] border border-[#e8e4dc] bg-white text-xs font-semibold text-[#374354] cursor-pointer outline-none focus:border-[#0f5946] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="pending">Pending</option>
        <option value="forward">Forwarded</option>
        <option value="referred">Referred</option>
        <option value="completed">Completed</option>
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9aa4b2]"
      />
    </div>
  );
}

function formatDate(dateStr, timeStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const dateLabel = Number.isNaN(d.getTime())
    ? dateStr
    : d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
  return timeStr ? `${dateLabel} · ${timeStr}` : dateLabel;
}

function AppointmentCard({ appointment, onStatusChange, updatingId }) {
  const isUpdating = updatingId === appointment._id;
  const severity = (appointment.severity || "unknown").toLowerCase();

  return (
    <div className="bg-white border border-[#e8e4dc] rounded-2xl shadow-[0_2px_7px_rgba(30,40,50,0.035)] p-5 flex flex-col gap-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 min-w-10 grid place-items-center rounded-[11px] bg-[#effaf4] text-[#0f5946]">
            <User size={18} />
          </div>
          <div>
            <div className="text-[#202938] text-sm font-bold leading-tight">
              {appointment.fullName}
            </div>
            <div className="flex items-center gap-1 text-[#7d8796] text-xs mt-0.5">
              <Phone size={12} />
              <span>{appointment.phone}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-[#536074]">
        {appointment.disease && (
          <span className="px-2.5 py-1 rounded-full bg-[#f0eee8] font-medium">
            {appointment.disease}
          </span>
        )}
        {appointment.severity && (
          <span
            className={`px-2.5 py-1 rounded-full font-bold capitalize ${
              SEVERITY_META[severity] || SEVERITY_META.unknown
            }`}
          >
            {severity}
          </span>
        )}
      </div>

      {appointment.reason && (
        <p className="text-[#536074] text-[13px] leading-relaxed">{appointment.reason}</p>
      )}

      <div className="flex items-center gap-1.5 text-[#7d8796] text-xs">
        <Calendar size={13} />
        <span>{formatDate(appointment.preferredDate, appointment.preferredTime)}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#f0eee8]">
        <span className="text-[10px] text-[#a4abb5]">
          Booked {new Date(appointment.createdAt).toLocaleDateString([], {
            day: "numeric",
            month: "short",
          })}
        </span>

        <div className="flex items-center gap-2">
          {isUpdating && <Loader2 size={14} className="animate-spin text-[#0f5946]" />}
          <StatusSelect
            value={appointment.status}
            disabled={isUpdating}
            onChange={(next) => onStatusChange(appointment._id, next)}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN VIEW
// ============================================================

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "forward", label: "Forwarded" },
  { value: "referred", label: "Referred" },
  { value: "completed", label: "Completed" },
];

export default function AppointmentsDoctor() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authWarning, setAuthWarning] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { appointments: rows, unauthorized, noToken } = await fetchAllAppointments({
        status: statusFilter,
        search: debouncedSearch,
      });

      if (noToken) {
        setAuthWarning("Please login first to view appointments.");
        setAppointments([]);
        return;
      }
      if (unauthorized) {
        setAuthWarning("Your session expired. Please login again.");
        setAppointments([]);
        return;
      }

      setAuthWarning(null);
      setAppointments(rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    const previous = appointments;
    // Optimistic update
    setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));

    try {
      await updateAppointmentStatus(id, status);
    } catch (err) {
      setAppointments(previous); // revert on failure
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    const c = { pending: 0, forward: 0, referred: 0, completed: 0 };
    appointments.forEach((a) => {
      if (c[a.status] !== undefined) c[a.status]++;
    });
    return c;
  }, [appointments]);

  return (
    <div className="w-full min-h-screen bg-[#fbfaf7] font-sans">
      <header className="px-9 pt-8 pb-6 max-[720px]:px-4 max-[720px]:pt-6">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-10 h-10 rounded-xl grid place-items-center text-white bg-[#0f5946]">
            <ShieldPlus size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="m-0 text-xl font-bold text-[#17212f]">All Appointments</h1>
            <p className="mt-0.5 mb-0 text-[12px] text-[#7d8796] font-medium">
              {appointments.length} record{appointments.length === 1 ? "" : "s"} loaded
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={isLoading}
            title="Refresh"
            className="ml-auto w-10 h-10 grid place-items-center rounded-[11px] border border-[#e8e4dc] bg-white text-[#536074] cursor-pointer hover:bg-[#f5f4f0] disabled:opacity-50"
          >
            <RefreshCcw size={17} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-[13px] border border-[#e8e4dc] bg-white flex-1 min-w-[220px] max-w-[360px]">
            <Search size={16} className="text-[#9aa4b2]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone, condition..."
              className="flex-1 min-w-0 border-0 outline-none bg-transparent text-sm text-[#364153] placeholder:text-[#a2a9b4]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={`h-9 px-3.5 rounded-[10px] text-xs font-bold cursor-pointer transition-colors ${
                  statusFilter === f.value
                    ? "bg-[#0f5946] text-white"
                    : "bg-white border border-[#e8e4dc] text-[#536074] hover:bg-[#f5f4f0]"
                }`}
              >
                {f.label}
                {f.value !== "all" && counts[f.value] > 0 && (
                  <span className="ml-1.5 opacity-80">{counts[f.value]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="px-9 pb-10 max-[720px]:px-4">
        {authWarning && (
          <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border border-[#f3caca] bg-[#fff4f4] text-[#a62f2f] text-sm mb-5">
            <AlertCircle size={16} />
            {authWarning}
          </div>
        )}

        {error && !authWarning && (
          <div className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border border-[#f3caca] bg-[#fff4f4] text-[#a62f2f] text-sm mb-5">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {isLoading && appointments.length === 0 && !authWarning && (
          <div className="flex items-center justify-center gap-2.5 py-24 text-[#7d8796]">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading appointments...</span>
          </div>
        )}

        {!isLoading && !authWarning && appointments.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-[#9ca5b1]">
            <Calendar size={30} className="mb-3 opacity-60" />
            <p className="text-sm">No appointments match this view.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
          {appointments.map((a) => (
            <AppointmentCard
              key={a._id}
              appointment={a}
              onStatusChange={handleStatusChange}
              updatingId={updatingId}
            />
          ))}
        </div>
      </section>
    </div>
  );
}