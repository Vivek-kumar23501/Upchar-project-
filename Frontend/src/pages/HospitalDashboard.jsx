import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Users,
  CalendarCheck,
  Activity,
  LogOut,
  Phone,
  MapPin,
  LayoutDashboard,
  AlertTriangle,
  UserPlus,
  Stethoscope,
  HeartHandshake,
  Pill,
  Menu,
  X,
  Trash2,
  Plus,
  ListOrdered,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";

const API_BASE = "http://localhost:8080";

// Sidebar navigation sections
const sidebarSections = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "queueManagement", label: "Queue Management", icon: ListOrdered },
  { key: "emergency", label: "Emergency", icon: AlertTriangle },
  { key: "managePatient", label: "Manage Patient", icon: UserPlus },
  {
    key: "doctorReferral",
    label: "Manage Doctor Referral",
    icon: Stethoscope,
  },
  { key: "manageDoctor", label: "Manage Doctor", icon: Stethoscope },
  { key: "manageAsha", label: "Manage ASHA", icon: HeartHandshake },
  { key: "manageMedicine", label: "Manage Medicine", icon: Pill },
];

// Stats card data
const statsConfig = [
  {
    key: "totalPatients",
    label: "Total Patients",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "todayAppointments",
    label: "Today's Appointments",
    icon: CalendarCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    key: "activeCases",
    label: "Active Cases",
    icon: Activity,
    color: "bg-orange-100 text-orange-600",
  },
];

// Doctor form fields
const doctorFormFields = [
  {
    name: "doctorName",
    label: "Doctor Name",
    type: "text",
    required: true,
    placeholder: "e.g. Dr. Raj Kumar",
  },
  {
    name: "qualification",
    label: "Qualification",
    type: "text",
    required: true,
    placeholder: "e.g. MBBS, MD",
  },
  {
    name: "specialization",
    label: "Specialization",
    type: "text",
    required: true,
    placeholder: "e.g. Cardiologist",
  },
  {
    name: "registrationNumber",
    label: "Registration Number",
    type: "text",
    required: true,
    placeholder: "e.g. MED123456",
  },
  {
    name: "experience",
    label: "Experience (years)",
    type: "number",
    required: true,
    placeholder: "e.g. 5",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    placeholder: "doctor@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Minimum 6 characters",
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    required: true,
    placeholder: "e.g. 9876543210",
  },
  {
    name: "department",
    label: "Department",
    type: "text",
    required: false,
    placeholder: "e.g. Cardiology",
  },
  {
    name: "consultationFee",
    label: "Consultation Fee",
    type: "number",
    required: false,
    placeholder: "e.g. 500",
  },
  {
    name: "availableTime",
    label: "Available Time",
    type: "text",
    required: false,
    placeholder: "e.g. 10:00 AM - 4:00 PM",
  },
];

// ASHA form fields
const ashaFormFields = [
  {
    name: "ashaName",
    label: "ASHA Name",
    type: "text",
    required: true,
    placeholder: "e.g. Sunita Devi",
  },
  {
    name: "ashaId",
    label: "ASHA ID",
    type: "text",
    required: true,
    placeholder: "e.g. ASHA123456",
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    required: true,
    placeholder: "e.g. 9876543210",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: false,
    placeholder: "asha@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Minimum 6 characters",
  },
  {
    name: "village",
    label: "Village",
    type: "text",
    required: true,
    placeholder: "e.g. Rampur",
  },
  {
    name: "block",
    label: "Block",
    type: "text",
    required: true,
    placeholder: "e.g. Bettiah",
  },
  {
    name: "district",
    label: "District",
    type: "text",
    required: true,
    placeholder: "e.g. West Champaran",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    required: true,
    placeholder: "e.g. Bihar",
  },
  {
    name: "experience",
    label: "Experience (years)",
    type: "number",
    required: false,
    placeholder: "e.g. 5",
  },
  {
    name: "qualification",
    label: "Qualification",
    type: "text",
    required: false,
    placeholder: "e.g. 10th Pass",
  },
];

// Queue status badge styles + flow (matches Appointment.model.js enum)
const QUEUE_STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  forward: "bg-blue-100 text-blue-700",
  referred: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
};

const QUEUE_STATUS_FLOW = ["pending", "forward", "referred", "completed"];

const QUEUE_SEVERITY_STYLES = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
  unknown: "bg-gray-100 text-gray-600",
};

const queueStatusFilters = [
  { label: "Active Queue", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Forwarded", value: "forward" },
  { label: "Referred", value: "referred" },
  { label: "Completed", value: "completed" },
];

const HospitalDashboard = () => {
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activeCases: 0,
  });

  // Doctor state
  const [doctors, setDoctors] = useState([]);
  const [showDoctorForm, setShowDoctorForm] = useState(false);

  const [doctorFormData, setDoctorFormData] = useState({
    doctorName: "",
    qualification: "",
    specialization: "",
    registrationNumber: "",
    experience: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    consultationFee: "",
    availableDays: [],
    availableTime: "",
  });

  const [doctorError, setDoctorError] = useState("");
  const [doctorLoading, setDoctorLoading] = useState(false);

  // ASHA state
  const [ashaWorkers, setAshaWorkers] = useState([]);
  const [showAshaForm, setShowAshaForm] = useState(false);

  const [ashaFormData, setAshaFormData] = useState({
    ashaName: "",
    ashaId: "",
    phone: "",
    email: "",
    password: "",
    village: "",
    block: "",
    district: "",
    state: "",
    experience: "",
    qualification: "",
  });

  const [ashaError, setAshaError] = useState("");
  const [ashaLoading, setAshaLoading] = useState(false);

  // Queue Management state
  const [queueAppointments, setQueueAppointments] = useState([]);
  const [queueError, setQueueError] = useState("");
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueStatusFilter, setQueueStatusFilter] = useState("");
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

  // Forward-to-doctor modal state
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardAppointment, setForwardAppointment] = useState(null);
  const [forwardDoctors, setForwardDoctors] = useState([]);
  const [forwardDoctorsLoading, setForwardDoctorsLoading] = useState(false);
  const [forwardDoctorsError, setForwardDoctorsError] = useState("");
  const [assigningDoctorId, setAssigningDoctorId] = useState(null);

  // ---------------------------------------------------
  // Get logged-in hospital
  // ---------------------------------------------------

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/hospital/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      console.log("Hospital User from localStorage:", parsedUser);

      setHospital(parsedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/hospital/login");
      return;
    }

    // TODO: replace with actual stats API call
  }, [navigate]);

  // ---------------------------------------------------
  // Common auth headers
  // ---------------------------------------------------

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ---------------------------------------------------
  // Get Hospital ID
  // ---------------------------------------------------

  const getHospitalId = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const hospitalUser = JSON.parse(storedUser);

      const hospitalId =
        hospitalUser?._id ||
        hospitalUser?.id ||
        hospitalUser?.hospitalId;

      console.log("Hospital User:", hospitalUser);
      console.log("Hospital ID:", hospitalId);

      return hospitalId || null;
    } catch (error) {
      console.error("Invalid hospital user:", error);
      return null;
    }
  };

  // A doctor's hospitalId can come back as a populated object
  // ({ _id, hospitalName, ... }) or as a raw id string, depending on the
  // backend. This normalizes both shapes and compares against the given
  // hospitalId, so only doctors belonging to THIS hospital ever render -
  // even if the backend's own filtering is loose or missing.
  const doctorBelongsToHospital = (doctor, hospitalId) => {
    if (!hospitalId) return false;

    const docHospitalId =
      typeof doctor?.hospitalId === "object" && doctor?.hospitalId !== null
        ? doctor.hospitalId._id
        : doctor?.hospitalId;

    return String(docHospitalId) === String(hospitalId);
  };

  // ---------------------------------------------------
  // Logout
  // ---------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/hospital/login");
  };

  // ===================================================
  // DOCTOR SECTION
  // ===================================================

  const fetchDoctors = async () => {
    try {
      const hospitalId = getHospitalId();

      if (!hospitalId) {
        console.error("Hospital ID not found.");

        setDoctorError(
          "Hospital ID nahi mila. Please login again."
        );

        return;
      }

      console.log(
        "Fetching doctors for Hospital ID:",
        hospitalId
      );

      const res = await fetch(
        `${API_BASE}/doctor/all?hospitalId=${encodeURIComponent(
          hospitalId
        )}`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      console.log("Doctors Response:", data);

      if (!res.ok || !data.success) {
        setDoctorError(
          data.message || "Doctors fetch nahi ho paye."
        );

        return;
      }

      setDoctors(
        (data.doctors || []).filter((doc) =>
          doctorBelongsToHospital(doc, hospitalId)
        )
      );
      setDoctorError("");
    } catch (err) {
      console.error("Fetch Doctors Error:", err);

      setDoctorError(
        "Server se doctors fetch nahi ho paye."
      );
    }
  };

  const handleDoctorChange = (e) => {
    setDoctorFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvailableDayChange = (day) => {
    setDoctorFormData((prev) => {
      const currentDays = prev.availableDays || [];

      if (currentDays.includes(day)) {
        return {
          ...prev,
          availableDays: currentDays.filter(
            (item) => item !== day
          ),
        };
      }

      return {
        ...prev,
        availableDays: [...currentDays, day],
      };
    });
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();

    setDoctorError("");
    setDoctorLoading(true);

    try {
      const hospitalId = getHospitalId();

      if (!hospitalId) {
        setDoctorError(
          "Hospital ID localStorage me nahi mila. Please login again."
        );

        setDoctorLoading(false);
        return;
      }

      const doctorData = {
        doctorName: doctorFormData.doctorName,
        qualification: doctorFormData.qualification,
        specialization: doctorFormData.specialization,
        registrationNumber:
          doctorFormData.registrationNumber,

        experience: Number(
          doctorFormData.experience
        ),

        email: doctorFormData.email,
        password: doctorFormData.password,
        phone: doctorFormData.phone,

        department:
          doctorFormData.department || "",

        consultationFee:
          doctorFormData.consultationFee !== ""
            ? Number(
                doctorFormData.consultationFee
              )
            : undefined,

        availableDays:
          doctorFormData.availableDays || [],

        availableTime:
          doctorFormData.availableTime || "",

        hospitalId: hospitalId,
      };

      console.log(
        "Doctor Data Sending to Backend:",
        doctorData
      );

      const res = await fetch(
        `${API_BASE}/doctor/add`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(doctorData),
        }
      );

      const data = await res.json();

      console.log(
        "Add Doctor Response:",
        data
      );

      if (!res.ok || !data.success) {
        setDoctorError(
          data.message ||
            "Doctor add nahi ho paya."
        );

        setDoctorLoading(false);
        return;
      }

      setDoctors((prev) => [
        data.doctor,
        ...prev,
      ]);

      setDoctorFormData({
        doctorName: "",
        qualification: "",
        specialization: "",
        registrationNumber: "",
        experience: "",
        email: "",
        password: "",
        phone: "",
        department: "",
        consultationFee: "",
        availableDays: [],
        availableTime: "",
      });

      setShowDoctorForm(false);
    } catch (err) {
      console.error(
        "Add Doctor Error:",
        err
      );

      setDoctorError(
        "Server se connect nahi ho paya."
      );
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is doctor ko delete karna chahte hain?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/doctor/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      console.log(
        "Delete Doctor Response:",
        data
      );

      if (!res.ok || !data.success) {
        setDoctorError(
          data.message ||
            "Doctor delete nahi ho paya."
        );

        return;
      }

      setDoctors((prev) =>
        prev.filter(
          (doc) => doc._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Doctor Error:",
        err
      );

      setDoctorError(
        "Server se connect nahi ho paya."
      );
    }
  };

  // ===================================================
  // ASHA SECTION
  // ===================================================

  const fetchAshaWorkers = async () => {
    try {
      const hospitalId = getHospitalId();

      if (!hospitalId) {
        console.error(
          "Hospital ID not found."
        );

        setAshaError(
          "Hospital ID nahi mila. Please login again."
        );

        return;
      }

      console.log(
        "Fetching ASHA for Hospital ID:",
        hospitalId
      );

      const res = await fetch(
        `${API_BASE}/asha/all?hospitalId=${encodeURIComponent(
          hospitalId
        )}`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      console.log(
        "ASHA Response:",
        data
      );

      if (!res.ok || !data.success) {
        setAshaError(
          data.message ||
            "ASHA workers fetch nahi ho paye."
        );

        return;
      }

      setAshaWorkers(
        data.ashaWorkers || []
      );

      setAshaError("");
    } catch (err) {
      console.error(
        "Fetch ASHA Error:",
        err
      );

      setAshaError(
        "Server se ASHA workers fetch nahi ho paye."
      );
    }
  };

  const handleAshaChange = (e) => {
    setAshaFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAshaSubmit = async (e) => {
    e.preventDefault();

    setAshaError("");
    setAshaLoading(true);

    try {
      const hospitalId = getHospitalId();

      if (!hospitalId) {
        setAshaError(
          "Hospital ID localStorage me nahi mila. Please login again."
        );

        setAshaLoading(false);
        return;
      }

      const ashaData = {
        ashaName: ashaFormData.ashaName,
        ashaId: ashaFormData.ashaId,
        phone: ashaFormData.phone,
        email: ashaFormData.email || "",
        password: ashaFormData.password,

        village: ashaFormData.village,
        block: ashaFormData.block,
        district: ashaFormData.district,
        state: ashaFormData.state,

        experience:
          ashaFormData.experience !== ""
            ? Number(
                ashaFormData.experience
              )
            : undefined,

        qualification:
          ashaFormData.qualification || "",

        hospitalId: hospitalId,
      };

      console.log(
        "ASHA Data Sending to Backend:",
        ashaData
      );

      const res = await fetch(
        `${API_BASE}/asha/add`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(ashaData),
        }
      );

      const data = await res.json();

      console.log(
        "Add ASHA Response:",
        data
      );

      if (!res.ok || !data.success) {
        setAshaError(
          data.message ||
            "ASHA worker add nahi ho paya."
        );

        setAshaLoading(false);
        return;
      }

      setAshaWorkers((prev) => [
        data.asha,
        ...prev,
      ]);

      setAshaFormData({
        ashaName: "",
        ashaId: "",
        phone: "",
        email: "",
        password: "",
        village: "",
        block: "",
        district: "",
        state: "",
        experience: "",
        qualification: "",
      });

      setShowAshaForm(false);
    } catch (err) {
      console.error(
        "Add ASHA Error:",
        err
      );

      setAshaError(
        "Server se connect nahi ho paya."
      );
    } finally {
      setAshaLoading(false);
    }
  };

  const handleDeleteAsha = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is ASHA worker ko delete karna chahte hain?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/asha/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      console.log(
        "Delete ASHA Response:",
        data
      );

      if (!res.ok || !data.success) {
        setAshaError(
          data.message ||
            "ASHA worker delete nahi ho paya."
        );

        return;
      }

      setAshaWorkers((prev) =>
        prev.filter(
          (worker) =>
            worker._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete ASHA Error:",
        err
      );

      setAshaError(
        "Server se connect nahi ho paya."
      );
    }
  };

  // ===================================================
  // QUEUE MANAGEMENT SECTION
  // ===================================================

  const fetchQueue = async (statusFilter = queueStatusFilter) => {
    setQueueLoading(true);

    try {
      const url = statusFilter
        ? `${API_BASE}/appointments/queue?status=${encodeURIComponent(
            statusFilter
          )}`
        : `${API_BASE}/appointments/queue`;

      console.log("Fetching queue from:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: authHeaders(),
      });

      const data = await res.json();

      console.log("Queue Response:", data);

      if (!res.ok || !data.success) {
        setQueueError(
          data.message || "Queue fetch nahi ho payi."
        );

        return;
      }

      setQueueAppointments(data.appointments || []);
      setQueueError("");
    } catch (err) {
      console.error("Fetch Queue Error:", err);

      setQueueError(
        "Server se queue fetch nahi ho payi."
      );
    } finally {
      setQueueLoading(false);
    }
  };

  const handleQueueStatusFilterChange = (value) => {
    setQueueStatusFilter(value);
    fetchQueue(value);
  };

  const handleUpdateAppointmentStatus = async (id, nextStatus) => {
    setUpdatingAppointmentId(id);

    try {
      const res = await fetch(
        `${API_BASE}/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await res.json();

      console.log("Update Appointment Status Response:", data);

      if (!res.ok || !data.success) {
        setQueueError(
          data.message || "Status update nahi ho paya."
        );

        return;
      }

      // Refresh so ordering + filtered view stay correct
      // (e.g. a completed case should drop out of the active view).
      await fetchQueue(queueStatusFilter);
    } catch (err) {
      console.error("Update Appointment Status Error:", err);

      setQueueError(
        "Server se connect nahi ho paya."
      );
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  // ---------------------------------------------------
  // Forward-to-doctor flow
  // ---------------------------------------------------

  // Opens the "select a doctor" modal for a given queue appointment and
  // loads this hospital's doctors so the hospital can pick one.
  const openForwardModal = async (appt) => {
    setForwardAppointment(appt);
    setShowForwardModal(true);
    setForwardDoctorsError("");
    setForwardDoctorsLoading(true);

    try {
      const hospitalId = getHospitalId();

      if (!hospitalId) {
        setForwardDoctorsError(
          "Hospital ID nahi mila. Please login again."
        );
        return;
      }

      const res = await fetch(
        `${API_BASE}/doctor/all?hospitalId=${encodeURIComponent(
          hospitalId
        )}`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      console.log("Doctors For Forward Response:", data);

      if (!res.ok || !data.success) {
        setForwardDoctorsError(
          data.message || "Doctors fetch nahi ho paye."
        );
        return;
      }

      setForwardDoctors(
        (data.doctors || []).filter((doc) =>
          doctorBelongsToHospital(doc, hospitalId)
        )
      );
    } catch (err) {
      console.error("Fetch Doctors For Forward Error:", err);

      setForwardDoctorsError(
        "Server se doctors fetch nahi ho paye."
      );
    } finally {
      setForwardDoctorsLoading(false);
    }
  };

  const closeForwardModal = () => {
    setShowForwardModal(false);
    setForwardAppointment(null);
    setForwardDoctors([]);
    setForwardDoctorsError("");
  };

  // Assigns the selected doctor to the appointment and moves its status
  // to "forward" in one call, so the patient becomes connected to that doctor.
  const handleAssignDoctor = async (doctor) => {
    if (!forwardAppointment) return;

    setAssigningDoctorId(doctor._id);

    try {
      const res = await fetch(
        `${API_BASE}/appointments/${forwardAppointment._id}/status`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({
            status: "forward",
            doctorId: doctor._id,
          }),
        }
      );

      const data = await res.json();

      console.log("Assign Doctor Response:", data);

      if (!res.ok || !data.success) {
        setForwardDoctorsError(
          data.message || "Doctor assign nahi ho paya."
        );
        return;
      }

      closeForwardModal();

      // Refresh so the queue reflects the new status + assigned doctor.
      await fetchQueue(queueStatusFilter);
    } catch (err) {
      console.error("Assign Doctor Error:", err);

      setForwardDoctorsError(
        "Server se connect nahi ho paya."
      );
    } finally {
      setAssigningDoctorId(null);
    }
  };

  // ---------------------------------------------------
  // Fetch data when section changes
  // ---------------------------------------------------

  useEffect(() => {
    if (activeSection === "manageDoctor") {
      fetchDoctors();
    }

    if (activeSection === "manageAsha") {
      fetchAshaWorkers();
    }

    if (activeSection === "queueManagement") {
      fetchQueue(queueStatusFilter);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  if (!hospital) {
    return null;
  }

  // ===================================================
  // OVERVIEW
  // ===================================================

  const renderOverview = () => (
    <>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-wrap gap-6 items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Hospital Type
          </p>

          <p className="font-medium text-gray-800">
            {hospital.hospitalType ||
              "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Phone
            size={16}
            className="text-gray-400"
          />

          <span>
            {hospital.phone || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin
            size={16}
            className="text-gray-400"
          />

          <span>
            {hospital.address?.city ||
              "N/A"}
            ,{" "}
            {hospital.address?.state ||
              "N/A"}
          </span>
        </div>

        <div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              String(
                hospital.status || ""
              ).toLowerCase() ===
              "approved"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {hospital.status ||
              "pending"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statsConfig.map((stat) => (
          <div
            key={stat.key}
            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4"
          >
            <div
              className={`p-3 rounded-full ${stat.color}`}
            >
              <stat.icon size={22} />
            </div>

            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {stats[stat.key]}
              </p>

              <p className="text-sm text-gray-500">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          Recent Appointments
        </h2>

        <p className="text-sm text-gray-500">
          Abhi koi data available nahi hai.
          Yaha appointments list aayegi.
        </p>
      </div>
    </>
  );

  // ===================================================
  // EMERGENCY
  // ===================================================

  const renderEmergency = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2.5 rounded-full">
          <AlertTriangle
            className="text-red-600"
            size={20}
          />
        </div>

        <h2 className="font-semibold text-gray-800 text-lg">
          Emergency Cases
        </h2>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Yaha active emergency cases dikhenge
        jo hospital ko turant attend karne
        hain.
      </p>

      <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">
          Abhi koi emergency case pending
          nahi hai.
        </p>
      </div>
    </div>
  );

  // ===================================================
  // MANAGE PATIENT
  // ===================================================

  const renderManagePatient = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-full">
            <UserPlus
              className="text-blue-600"
              size={20}
            />
          </div>

          <h2 className="font-semibold text-gray-800 text-lg">
            Manage Patients
          </h2>
        </div>

        <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Add Patient
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Registered patients ki list, unki
        admission details aur treatment status
        yaha manage karein.
      </p>

      <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">
          Abhi koi patient registered nahi hai.
        </p>
      </div>
    </div>
  );

  // ===================================================
  // DOCTOR REFERRAL
  // ===================================================

  const renderDoctorReferral = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2.5 rounded-full">
            <Stethoscope
              className="text-purple-600"
              size={20}
            />
          </div>

          <h2 className="font-semibold text-gray-800 text-lg">
            Manage Doctor Referral
          </h2>
        </div>

        <button className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition">
          New Referral
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Doctors ke referrals track karein —
        kaunse patient kis doctor ko refer kiye
        gaye hain.
      </p>

      <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">
          Abhi koi referral record nahi hai.
        </p>
      </div>
    </div>
  );

  // ===================================================
  // MANAGE DOCTOR
  // ===================================================

  const renderManageDoctor = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-full">
            <Stethoscope
              className="text-indigo-600"
              size={20}
            />
          </div>

          <h2 className="font-semibold text-gray-800 text-lg">
            Manage Doctors
          </h2>
        </div>

        <button
          onClick={() => {
            setDoctorError("");

            setDoctorFormData({
              doctorName: "",
              qualification: "",
              specialization: "",
              registrationNumber: "",
              experience: "",
              email: "",
              password: "",
              phone: "",
              department: "",
              consultationFee: "",
              availableDays: [],
              availableTime: "",
            });

            setShowDoctorForm(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          Add Doctor
        </button>
      </div>

      {doctorError && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {doctorError}
        </div>
      )}

      {doctors.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">
            Abhi koi doctor registered nahi
            hai.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="border border-gray-100 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800">
                    {doc.doctorName}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {doc.specialization} •{" "}
                    {doc.qualification}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Reg. No:{" "}
                    {doc.registrationNumber}{" "}
                    • {doc.experience} yrs exp •{" "}
                    {doc.phone}
                  </p>

                  {doc.email && (
                    <p className="text-xs text-gray-400 mt-1">
                      Email: {doc.email}
                    </p>
                  )}

                  {doc.department && (
                    <p className="text-xs text-gray-400 mt-1">
                      Department:{" "}
                      {doc.department}
                    </p>
                  )}

                  {doc.consultationFee !==
                    undefined &&
                    doc.consultationFee !==
                      null && (
                      <p className="text-xs text-gray-400 mt-1">
                        Consultation Fee: ₹
                        {doc.consultationFee}
                      </p>
                    )}

                  {doc.availableDays &&
                    doc.availableDays.length >
                      0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Available Days:{" "}
                        {doc.availableDays.join(
                          ", "
                        )}
                      </p>
                    )}

                  {doc.availableTime && (
                    <p className="text-xs text-gray-400 mt-1">
                      Available Time:{" "}
                      {doc.availableTime}
                    </p>
                  )}

                  {doc.status && (
                    <span
                      className={`inline-block text-xs px-2.5 py-1 rounded-full mt-2 ${
                        doc.status ===
                        "active"
                          ? "bg-green-100 text-green-700"
                          : doc.status ===
                            "on-leave"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {doc.status}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleDeleteDoctor(
                      doc._id
                    )
                  }
                  className="flex-shrink-0 text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Doctor Modal */}
      {showDoctorForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Add Doctor
              </h3>

              <button
                onClick={() => {
                  setShowDoctorForm(
                    false
                  );
                  setDoctorError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {doctorError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {doctorError}
              </div>
            )}

            <form
              onSubmit={handleDoctorSubmit}
              className="space-y-4"
            >
              {doctorFormFields.map(
                (field) => (
                  <div key={field.name}>
                    <label className="text-sm font-medium text-gray-700">
                      {field.label}

                      {field.required && (
                        <span className="text-red-500">
                          {" "}
                          *
                        </span>
                      )}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={
                        doctorFormData[
                          field.name
                        ] || ""
                      }
                      onChange={
                        handleDoctorChange
                      }
                      placeholder={
                        field.placeholder ||
                        ""
                      }
                      required={
                        field.required
                      }
                      min={
                        field.name ===
                        "experience"
                          ? "0"
                          : undefined
                      }
                      minLength={
                        field.name ===
                        "password"
                          ? 6
                          : undefined
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )
              )}

              {/* Available Days */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Available Days
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={(
                          doctorFormData.availableDays ||
                          []
                        ).includes(day)}
                        onChange={() =>
                          handleAvailableDayChange(
                            day
                          )
                        }
                        className="accent-indigo-600"
                      />

                      <span className="text-sm text-gray-600">
                        {day}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  doctorLoading
                }
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {doctorLoading
                  ? "Adding..."
                  : "Add Doctor"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // ===================================================
  // MANAGE ASHA
  // ===================================================

  const renderManageAsha = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-fuchsia-100 p-2.5 rounded-full">
            <HeartHandshake
              className="text-fuchsia-600"
              size={20}
            />
          </div>

          <h2 className="font-semibold text-gray-800 text-lg">
            Manage ASHA Workers
          </h2>
        </div>

        <button
          onClick={() => {
            setAshaError("");

            setAshaFormData({
              ashaName: "",
              ashaId: "",
              phone: "",
              email: "",
              password: "",
              village: "",
              block: "",
              district: "",
              state: "",
              experience: "",
              qualification: "",
            });

            setShowAshaForm(true);
          }}
          className="flex items-center gap-2 bg-fuchsia-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition"
        >
          <Plus size={16} />
          Add ASHA
        </button>
      </div>

      {ashaError && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          {ashaError}
        </div>
      )}

      {ashaWorkers.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">
            Abhi koi ASHA worker registered
            nahi hai.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ashaWorkers.map(
            (worker) => (
              <div
                key={worker._id}
                className="flex items-center justify-between border border-gray-100 rounded-xl p-4"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {worker.ashaName}
                  </p>

                  <p className="text-xs text-gray-500">
                    ID: {worker.ashaId} •{" "}
                    {worker.phone}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {worker.village},{" "}
                    {worker.block},{" "}
                    {worker.district},{" "}
                    {worker.state}
                  </p>

                  {worker.email && (
                    <p className="text-xs text-gray-400 mt-1">
                      Email:{" "}
                      {worker.email}
                    </p>
                  )}

                  {worker.qualification && (
                    <p className="text-xs text-gray-400 mt-1">
                      Qualification:{" "}
                      {
                        worker.qualification
                      }
                    </p>
                  )}

                  {worker.experience !==
                    undefined &&
                    worker.experience !==
                      null && (
                      <p className="text-xs text-gray-400 mt-1">
                        Experience:{" "}
                        {
                          worker.experience
                        }{" "}
                        years
                      </p>
                    )}

                  {worker.status && (
                    <span
                      className={`inline-block text-xs px-2.5 py-1 rounded-full mt-2 ${
                        worker.status ===
                        "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {worker.status}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleDeleteAsha(
                      worker._id
                    )
                  }
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* Add ASHA Modal */}
      {showAshaForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Add ASHA Worker
              </h3>

              <button
                onClick={() => {
                  setShowAshaForm(
                    false
                  );
                  setAshaError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {ashaError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                {ashaError}
              </div>
            )}

            <form
              onSubmit={handleAshaSubmit}
              className="space-y-4"
            >
              {ashaFormFields.map(
                (field) => (
                  <div key={field.name}>
                    <label className="text-sm font-medium text-gray-700">
                      {field.label}

                      {field.required && (
                        <span className="text-red-500">
                          {" "}
                          *
                        </span>
                      )}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={
                        ashaFormData[
                          field.name
                        ] || ""
                      }
                      onChange={
                        handleAshaChange
                      }
                      placeholder={
                        field.placeholder ||
                        ""
                      }
                      required={
                        field.required
                      }
                      min={
                        field.name ===
                        "experience"
                          ? "0"
                          : undefined
                      }
                      minLength={
                        field.name ===
                        "password"
                          ? 6
                          : undefined
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                  </div>
                )
              )}

              <button
                type="submit"
                disabled={
                  ashaLoading
                }
                className="w-full bg-fuchsia-600 text-white py-2.5 rounded-lg font-medium hover:bg-fuchsia-700 transition disabled:opacity-60"
              >
                {ashaLoading
                  ? "Adding..."
                  : "Add ASHA Worker"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // ===================================================
  // MANAGE MEDICINE
  // ===================================================

  const renderManageMedicine = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2.5 rounded-full">
            <Pill
              className="text-teal-600"
              size={20}
            />
          </div>

          <h2 className="font-semibold text-gray-800 text-lg">
            Manage Medicine
          </h2>
        </div>

        <button className="bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-teal-700 transition">
          Add Medicine
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Medicine stock, expiry aur
        availability status yaha manage karein.
      </p>

      <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">
          Abhi koi medicine record nahi hai.
        </p>
      </div>
    </div>
  );

  // ===================================================
  // QUEUE MANAGEMENT
  // ===================================================

  const renderQueueManagement = () => {
    const highRiskCount = queueAppointments.filter(
      (appt) =>
        appt.severity === "high" ||
        (typeof appt.riskScore === "number" &&
          appt.riskScore >= 0.75)
    ).length;

    return (
      <div className="space-y-6">
        {/* Header + refresh */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2.5 rounded-full">
              <ListOrdered
                className="text-orange-600"
                size={20}
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                Queue Management
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Sabse zyada risk wale patients sabse upar dikhte hain.
              </p>
            </div>
          </div>

          <button
            onClick={() => fetchQueue(queueStatusFilter)}
            disabled={queueLoading}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={queueLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-xs text-gray-500 font-medium">
              In Queue
            </p>
            <p className="text-2xl font-semibold text-gray-800 mt-1">
              {queueAppointments.length}
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <p className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertTriangle size={12} /> High Risk Cases
            </p>
            <p className="text-2xl font-semibold text-red-700 mt-1">
              {highRiskCount}
            </p>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-2">
          {queueStatusFilters.map((filter) => (
            <button
              key={filter.value || "active"}
              onClick={() =>
                handleQueueStatusFilterChange(filter.value)
              }
              className={`text-xs font-medium px-3.5 py-2 rounded-full transition ${
                queueStatusFilter === filter.value
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {queueError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
            {queueError}
          </div>
        )}

        {/* Queue list */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {queueLoading && queueAppointments.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-400">
                Queue load ho rahi hai...
              </p>
            </div>
          ) : queueAppointments.length === 0 ? (
            <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-400">
                Is filter me abhi koi appointment nahi hai.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {queueAppointments.map((appt) => {
                const severityKey =
                  QUEUE_SEVERITY_STYLES[appt.severity]
                    ? appt.severity
                    : "unknown";

                const currentIndex = QUEUE_STATUS_FLOW.indexOf(
                  appt.status
                );

                const nextStatus =
                  currentIndex >= 0 &&
                  currentIndex < QUEUE_STATUS_FLOW.length - 1
                    ? QUEUE_STATUS_FLOW[currentIndex + 1]
                    : null;

                const patientName =
                  appt.fullName ||
                  appt.userId?.fullname ||
                  "Unknown patient";

                const phone =
                  appt.phone || appt.userId?.mobile || "N/A";

                // Assigned doctor may come back under different shapes
                // depending on whether the backend populates the field.
                const assignedDoctorName =
                  appt.doctorName ||
                  appt.doctor?.doctorName ||
                  appt.doctorId?.doctorName ||
                  null;

                return (
                  <div
                    key={appt._id}
                    className="border border-gray-100 rounded-xl p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-800">
                            {patientName}
                          </p>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${QUEUE_SEVERITY_STYLES[severityKey]}`}
                          >
                            {appt.severity || "unknown"}
                          </span>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                              QUEUE_STATUS_STYLES[appt.status] ||
                              QUEUE_STATUS_STYLES.pending
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {appt.disease || "Disease not specified"} •{" "}
                          {phone}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Confidence: {appt.confidence || "N/A"} • Risk
                          Score:{" "}
                          {typeof appt.riskScore === "number"
                            ? appt.riskScore.toFixed(2)
                            : "N/A"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock size={11} />
                          {appt.preferredDate}
                          {appt.preferredTime
                            ? ` • ${appt.preferredTime}`
                            : ""}
                        </p>

                        {appt.matchedSymptoms &&
                          appt.matchedSymptoms.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              Symptoms:{" "}
                              {appt.matchedSymptoms.join(", ")}
                            </p>
                          )}

                        {assignedDoctorName && (
                          <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                            <Stethoscope size={11} />
                            Assigned to Dr. {assignedDoctorName}
                          </p>
                        )}
                      </div>

                      {nextStatus && (
                        <button
                          onClick={() =>
                            nextStatus === "forward"
                              ? openForwardModal(appt)
                              : handleUpdateAppointmentStatus(
                                  appt._id,
                                  nextStatus
                                )
                          }
                          disabled={
                            updatingAppointmentId === appt._id
                          }
                          className="flex-shrink-0 flex items-center gap-1.5 bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                        >
                          {updatingAppointmentId === appt._id ? (
                            "Updating..."
                          ) : nextStatus === "forward" ? (
                            <>
                              <Stethoscope size={13} />
                              Forward to Doctor
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={13} />
                              Mark {nextStatus}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Forward-to-doctor: select doctor modal */}
        {showForwardModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Select Doctor
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {forwardAppointment?.fullName ||
                      forwardAppointment?.userId?.fullname ||
                      "Patient"}{" "}
                    ko doctor ke pass forward karein.
                  </p>
                </div>

                <button
                  onClick={closeForwardModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {forwardDoctorsError && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                  {forwardDoctorsError}
                </div>
              )}

              {forwardDoctorsLoading ? (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-400">
                    Doctors load ho rahe hain...
                  </p>
                </div>
              ) : forwardDoctors.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-sm text-gray-400">
                    Is hospital me abhi koi doctor registered nahi hai.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {forwardDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between gap-4 border border-gray-100 rounded-xl p-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">
                          {doc.doctorName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.specialization} • {doc.qualification}
                        </p>
                        {doc.department && (
                          <p className="text-xs text-gray-400 mt-1">
                            {doc.department}
                          </p>
                        )}
                        {doc.availableTime && (
                          <p className="text-xs text-gray-400 mt-1">
                            {doc.availableTime}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleAssignDoctor(doc)}
                        disabled={assigningDoctorId === doc._id}
                        className="flex-shrink-0 bg-indigo-600 text-white text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        {assigningDoctorId === doc._id
                          ? "Assigning..."
                          : "Select"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===================================================
  // SECTION RENDERERS
  // ===================================================

  const sectionRenderers = {
    overview: renderOverview,
    queueManagement: renderQueueManagement,
    emergency: renderEmergency,
    managePatient: renderManagePatient,
    doctorReferral: renderDoctorReferral,
    manageDoctor: renderManageDoctor,
    manageAsha: renderManageAsha,
    manageMedicine: renderManageMedicine,
  };

  const activeLabel =
    sidebarSections.find(
      (s) =>
        s.key === activeSection
    )?.label;

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="bg-blue-100 p-2 rounded-full">
            <Building2
              className="text-blue-600"
              size={20}
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-semibold text-gray-800 text-sm truncate">
              {hospital.hospitalName}
            </h1>

            <p className="text-xs text-gray-500 truncate">
              {
                hospital.registrationNumber
              }
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarSections.map(
            (section) => (
              <button
                key={section.key}
                onClick={() => {
                  setActiveSection(
                    section.key
                  );

                  setIsSidebarOpen(
                    false
                  );
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeSection ===
                  section.key
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <section.icon
                  size={18}
                />

                {section.label}
              </button>
            )
          )}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() =>
            setIsSidebarOpen(
              false
            )
          }
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
          <button
            onClick={() =>
              setIsSidebarOpen(true)
            }
            className="lg:hidden text-gray-600"
          >
            <Menu size={22} />
          </button>

          <h2 className="font-semibold text-gray-800 text-lg">
            {activeLabel}
          </h2>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {sectionRenderers[
            activeSection
          ]()}
        </main>
      </div>
    </div>
  );
};

export default HospitalDashboard;