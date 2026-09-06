import React, { useEffect, useMemo, useState } from "react";

const OVERPASS_API = "https://overpass-api.de/api/interpreter";

const SEARCH_RADIUS = 50000; // 50 KM
const MAX_DOCTORS = 50;

const INITIAL_VISIBLE = 10;
const LOAD_MORE_COUNT = 10;

/* =========================================================
   DISTANCE CALCULATION
========================================================= */

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/* =========================================================
   FORMAT DISTANCE
========================================================= */

const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(1)} km`;
};

/* =========================================================
   OWNERSHIP DETECTION
========================================================= */

const getOwnership = (tags = {}) => {
  const values = [
    tags.name,
    tags["name:en"],
    tags.operator,
    tags.owner,
    tags.ownership,
    tags["operator:type"],
    tags["healthcare:type"],
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase().trim());

  const combined = values.join(" ");

  /* -----------------------------------------
     Explicit PRIVATE indicators first
  ----------------------------------------- */

  const privateRegex =
    /\b(private|pvt|pvt\.|corporate|ltd|ltd\.|limited|apollo|fortis|medanta|manipal|narayana|aster|artemis|jaypee|kokilaben|columbia asia)\b/i;

  if (privateRegex.test(combined)) {
    return "Non-Government";
  }

  /* -----------------------------------------
     Government indicators
  ----------------------------------------- */

  const governmentRegex =
    /\b(government|governmental|govt|gov\.|public|municipal|ministry|state government|central government|community health centre|community health center|community healthcare centre|community healthcare center|chc|primary health centre|primary health center|primary healthcare centre|primary healthcare center|phc|sub centre|sub-center|sub center|health sub centre|health sub-center|health sub center|government hospital|govt hospital|gov hospital|district hospital|district medical centre|district medical center|civil hospital|sadar hospital|sub divisional hospital|sub-divisional hospital|sub division hospital|government dispensary|govt dispensary|government clinic|govt clinic|government medical college|govt medical college|government medical college hospital|govt medical college hospital|aiims|esic|esi hospital|employees state insurance|railway hospital|railway health centre|railway health center|army hospital|military hospital|air force hospital|navy hospital|defence hospital|defense hospital|public health centre|public health center|public hospital|state hospital|central hospital)\b/i;

  if (governmentRegex.test(combined)) {
    return "Government";
  }

  /*
    CHC / PHC can sometimes appear in unrelated text.
    Check separately using word boundaries.
  */

  if (/\b(chc|phc)\b/i.test(combined)) {
    return "Government";
  }

  return "Not specified";
};

/* =========================================================
   SPECIALIZATION
========================================================= */

const getSpecialization = (tags = {}) => {
  const speciality =
    tags["healthcare:speciality"] ||
    tags["healthcare:specialty"] ||
    tags.speciality ||
    tags.specialty;

  if (speciality) {
    return String(speciality)
      .split(";")[0]
      .trim()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const name = `${tags.name || ""} ${tags["name:en"] || ""}`.toLowerCase();

  if (name.includes("cardio")) return "Cardiologist";
  if (name.includes("dental")) return "Dentist";
  if (name.includes("skin") || name.includes("derma"))
    return "Dermatologist";
  if (name.includes("eye") || name.includes("ophthal"))
    return "Ophthalmologist";
  if (name.includes("ortho")) return "Orthopedic";
  if (name.includes("child") || name.includes("pediatric"))
    return "Pediatrician";
  if (name.includes("gyne") || name.includes("women"))
    return "Gynecologist";
  if (name.includes("ent")) return "ENT Specialist";
  if (name.includes("neuro")) return "Neurologist";

  return "General";
};

/* =========================================================
   FACILITY TYPE
========================================================= */

const getFacilityType = (tags = {}) => {
  if (tags.amenity === "hospital") {
    return "Hospital";
  }

  if (
    tags.amenity === "clinic" ||
    tags.healthcare === "clinic"
  ) {
    return "Clinic";
  }

  if (
    tags.healthcare === "health_centre" ||
    tags.healthcare === "centre"
  ) {
    return "Health Centre";
  }

  if (
    tags.amenity === "doctors" ||
    tags.healthcare === "doctor"
  ) {
    return "Doctor";
  }

  return "Medical Facility";
};

/* =========================================================
   ADDRESS
========================================================= */

const getAddress = (tags = {}) => {
  const addressParts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:place"],
    tags["addr:neighbourhood"],
    tags["addr:suburb"],
    tags["addr:village"],
    tags["addr:town"],
    tags["addr:city"],
    tags["addr:district"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);

  if (addressParts.length > 0) {
    return addressParts.join(", ");
  }

  return (
    tags.address ||
    tags["contact:address"] ||
    tags["addr:full"] ||
    "Address not available"
  );
};

/* =========================================================
   PHONE
========================================================= */

const getPhone = (tags = {}) => {
  return (
    tags.phone ||
    tags["contact:phone"] ||
    tags["contact:mobile"] ||
    tags.mobile ||
    ""
  );
};

/* =========================================================
   WEBSITE
========================================================= */

const getWebsite = (tags = {}) => {
  return (
    tags.website ||
    tags["contact:website"] ||
    tags.url ||
    ""
  );
};

/* =========================================================
   DIRECTIONS URL
========================================================= */

const getDirectionsUrl = (
  userLocation,
  destinationLat,
  destinationLon
) => {
  if (!userLocation) {
    return `https://www.google.com/maps/search/?api=1&query=${destinationLat},${destinationLon}`;
  }

  return (
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${userLocation.lat},${userLocation.lon}` +
    `&destination=${destinationLat},${destinationLon}` +
    `&travelmode=driving`
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DoctorsNearMe() {
  const [location, setLocation] = useState(null);

  const [doctors, setDoctors] = useState([]);

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [error, setError] = useState("");

  const [specialistFilter, setSpecialistFilter] = useState("All");

  const [ownershipFilter, setOwnershipFilter] = useState("All");

  const [visibleCount, setVisibleCount] =
    useState(INITIAL_VISIBLE);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  /* =========================================================
     GET CURRENT LOCATION
  ========================================================= */

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Your browser does not support location access."
      );

      setLoadingLocation(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        setLocation(currentLocation);
        setLoadingLocation(false);
      },
      (locationError) => {
        console.error(
          "Location error:",
          locationError
        );

        setError(
          "Location permission is required to find doctors near you."
        );

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  }, []);

  /* =========================================================
     FETCH DOCTORS FROM OPENSTREETMAP OVERPASS
  ========================================================= */

  useEffect(() => {
    if (!location) return;

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setError("");

      try {
        const { lat, lon } = location;

        const query = `
[out:json][timeout:90];

(
  node["amenity"="doctors"](around:${SEARCH_RADIUS},${lat},${lon});
  way["amenity"="doctors"](around:${SEARCH_RADIUS},${lat},${lon});
  relation["amenity"="doctors"](around:${SEARCH_RADIUS},${lat},${lon});

  node["healthcare"="doctor"](around:${SEARCH_RADIUS},${lat},${lon});
  way["healthcare"="doctor"](around:${SEARCH_RADIUS},${lat},${lon});
  relation["healthcare"="doctor"](around:${SEARCH_RADIUS},${lat},${lon});

  node["healthcare"="clinic"](around:${SEARCH_RADIUS},${lat},${lon});
  way["healthcare"="clinic"](around:${SEARCH_RADIUS},${lat},${lon});
  relation["healthcare"="clinic"](around:${SEARCH_RADIUS},${lat},${lon});

  node["amenity"="clinic"](around:${SEARCH_RADIUS},${lat},${lon});
  way["amenity"="clinic"](around:${SEARCH_RADIUS},${lat},${lon});

  node["amenity"="hospital"](around:${SEARCH_RADIUS},${lat},${lon});
  way["amenity"="hospital"](around:${SEARCH_RADIUS},${lat},${lon});
  relation["amenity"="hospital"](around:${SEARCH_RADIUS},${lat},${lon});

  node["healthcare"="centre"](around:${SEARCH_RADIUS},${lat},${lon});
  way["healthcare"="centre"](around:${SEARCH_RADIUS},${lat},${lon});

  node["healthcare"="health_centre"](around:${SEARCH_RADIUS},${lat},${lon});
  way["healthcare"="health_centre"](around:${SEARCH_RADIUS},${lat},${lon});
);

out center tags;
`;

        const response = await fetch(
          OVERPASS_API,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
            body: `data=${encodeURIComponent(query)}`,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Overpass API error: ${response.status}`
          );
        }

        const data = await response.json();

        const elements = data.elements || [];

        const processedDoctors = elements
          .map((place) => {
            const tags = place.tags || {};

            const latitude =
              place.lat ?? place.center?.lat;

            const longitude =
              place.lon ?? place.center?.lon;

            if (
              latitude === undefined ||
              longitude === undefined
            ) {
              return null;
            }

            const name =
              tags.name ||
              tags["name:en"] ||
              "Medical Facility";

            const distance = calculateDistance(
              lat,
              lon,
              latitude,
              longitude
            );

            return {
              id: `${place.type}-${place.id}`,

              name,

              lat: latitude,

              lon: longitude,

              distance,

              specialization:
                getSpecialization(tags),

              ownership:
                getOwnership(tags),

              facilityType:
                getFacilityType(tags),

              address:
                getAddress(tags),

              phone:
                getPhone(tags),

              website:
                getWebsite(tags),

              openingHours:
                tags.opening_hours || "",

              emergency:
                tags.emergency || "",

              wheelchair:
                tags.wheelchair || "",

              tags,
            };
          })
          .filter(Boolean);

        /* =====================================================
           REMOVE DUPLICATES
        ===================================================== */

        const uniqueDoctors = [];

        const seen = new Set();

        processedDoctors
          .sort(
            (a, b) =>
              a.distance - b.distance
          )
          .forEach((doctor) => {
            const key =
              `${doctor.name.toLowerCase()}-` +
              `${doctor.lat.toFixed(5)}-` +
              `${doctor.lon.toFixed(5)}`;

            if (!seen.has(key)) {
              seen.add(key);

              uniqueDoctors.push(doctor);
            }
          });

        /* =====================================================
           LIMIT TO 50
        ===================================================== */

        setDoctors(
          uniqueDoctors.slice(
            0,
            MAX_DOCTORS
          )
        );

        setVisibleCount(
          INITIAL_VISIBLE
        );
      } catch (err) {
        console.error(
          "Doctor fetch error:",
          err
        );

        setError(
          "Unable to fetch nearby medical centres. Please try again."
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [location]);

  /* =========================================================
     SPECIALIST LIST
  ========================================================= */

  const specialists = useMemo(() => {
    const list = doctors
      .map(
        (doctor) =>
          doctor.specialization
      )
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(list)
      ).sort(),
    ];
  }, [doctors]);

  /* =========================================================
     FILTER DOCTORS
  ========================================================= */

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (doctor) => {
        const specialistMatch =
          specialistFilter === "All" ||
          doctor.specialization ===
            specialistFilter;

        const ownershipMatch =
          ownershipFilter === "All" ||
          doctor.ownership ===
            ownershipFilter;

        return (
          specialistMatch &&
          ownershipMatch
        );
      }
    );
  }, [
    doctors,
    specialistFilter,
    ownershipFilter,
  ]);

  /* =========================================================
     VISIBLE DOCTORS
  ========================================================= */

  const visibleDoctors =
    filteredDoctors.slice(
      0,
      visibleCount
    );

  /* =========================================================
     OPEN DETAILS
  ========================================================= */

  const openDetails = (doctor) => {
    setSelectedDoctor(doctor);

    document.body.style.overflow =
      "hidden";
  };

  /* =========================================================
     CLOSE DETAILS
  ========================================================= */

  const closeDetails = () => {
    setSelectedDoctor(null);

    document.body.style.overflow =
      "auto";
  };

  /* =========================================================
     LOADING LOCATION
  ========================================================= */

  if (loadingLocation) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#d7e8e1] border-t-[#00674b] rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-xl font-bold text-[#004d37]">
            Getting your location...
          </h2>

          <p className="text-gray-600 mt-2">
            Please allow location access.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !location) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5 text-3xl">
            📍
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Location Required
          </h2>

          <p className="text-gray-600 mt-3">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 px-6 py-3 bg-[#00674b] text-white rounded-xl font-semibold hover:bg-[#004d37] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#fff8f5]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e8f3ef] flex items-center justify-center text-2xl">
                  🩺
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-[#004d37]">
                    Doctors Near Me
                  </h1>

                  <p className="text-gray-600 mt-1">
                    Find doctors, hospitals and
                    health centres near your location
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#e8f3ef] px-5 py-3 rounded-2xl">
              <div className="text-sm text-gray-600">
                Search Radius
              </div>

              <div className="font-bold text-[#00674b] text-lg">
                Within 50 KM
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===================================================
            LOCATION INFO
        =================================================== */}

        {location && (
          <div className="bg-[#e8f3ef] border border-[#cce5dc] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">

            <div className="text-2xl">
              📍
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Your current location
              </p>

              <p className="font-semibold text-[#004d37]">
                {location.lat.toFixed(5)},{" "}
                {location.lon.toFixed(5)}
              </p>
            </div>

          </div>
        )}

        {/* ===================================================
            FILTER SECTION
        =================================================== */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-7">

          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">
              🔎
            </span>

            <h2 className="font-bold text-xl text-[#004d37]">
              Filter Doctors & Centres
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* SPECIALIST */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialist / Doctor Type
              </label>

              <select
                value={specialistFilter}
                onChange={(e) => {
                  setSpecialistFilter(
                    e.target.value
                  );
                  setVisibleCount(
                    INITIAL_VISIBLE
                  );
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00674b]"
              >
                {specialists.map(
                  (specialist) => (
                    <option
                      key={specialist}
                      value={specialist}
                    >
                      {specialist}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* OWNERSHIP */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Centre Type
              </label>

              <select
                value={ownershipFilter}
                onChange={(e) => {
                  setOwnershipFilter(
                    e.target.value
                  );
                  setVisibleCount(
                    INITIAL_VISIBLE
                  );
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00674b]"
              >
                <option value="All">
                  All
                </option>

                <option value="Government">
                  Government
                </option>

                <option value="Non-Government">
                  Non-Government
                </option>

                <option value="Not specified">
                  Not Specified
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loadingDoctors && (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

            <div className="w-12 h-12 border-4 border-[#d7e8e1] border-t-[#00674b] rounded-full animate-spin mx-auto mb-4"></div>

            <h3 className="font-bold text-xl text-[#004d37]">
              Finding nearby doctors...
            </h3>

            <p className="text-gray-600 mt-2">
              Searching medical facilities within
              50 KM.
            </p>

          </div>
        )}

        {/* ===================================================
            ERROR WITH LOCATION AVAILABLE
        =================================================== */}

        {error && location && !loadingDoctors && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            RESULT COUNT
        =================================================== */}

        {!loadingDoctors &&
          !error && (
            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-xl font-bold text-[#004d37]">
                  Nearby Medical Centres
                </h2>

                <p className="text-gray-600 text-sm mt-1">
                  Showing{" "}
                  {visibleDoctors.length}{" "}
                  of{" "}
                  {filteredDoctors.length}{" "}
                  results
                </p>
              </div>

              <div className="hidden sm:block bg-white px-4 py-2 rounded-xl border border-gray-100">
                <span className="font-bold text-[#00674b]">
                  {doctors.length}
                </span>{" "}
                found
              </div>

            </div>
          )}

        {/* ===================================================
            NO RESULT
        =================================================== */}

        {!loadingDoctors &&
          !error &&
          filteredDoctors.length === 0 && (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

              <div className="text-5xl mb-4">
                🏥
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                No medical centre found
              </h3>

              <p className="text-gray-600 mt-2">
                Try changing your filters.
              </p>

            </div>
          )}

        {/* ===================================================
            DOCTOR CARDS
        =================================================== */}

        {!loadingDoctors &&
          !error &&
          visibleDoctors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {visibleDoctors.map(
                (doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition duration-300 overflow-hidden"
                  >

                    {/* CARD HEADER */}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-start gap-3">

                          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#e8f3ef] flex items-center justify-center text-2xl">
                            🏥
                          </div>

                          <div>
                            <h3 className="font-bold text-lg text-[#004d37] line-clamp-2">
                              {doctor.name}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {doctor.facilityType}
                            </p>
                          </div>

                        </div>

                        {/* OWNERSHIP */}

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            doctor.ownership ===
                            "Government"
                              ? "bg-green-100 text-green-700"
                              : doctor.ownership ===
                                "Non-Government"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {doctor.ownership}
                        </span>

                      </div>

                      {/* SPECIALIZATION */}

                      <div className="flex items-center gap-2 mt-5">
                        <span className="text-lg">
                          👨‍⚕️
                        </span>

                        <span className="text-gray-700 font-medium">
                          {doctor.specialization}
                        </span>
                      </div>

                      {/* DISTANCE */}

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-lg">
                          📍
                        </span>

                        <span className="text-gray-700">
                          {formatDistance(
                            doctor.distance
                          )}{" "}
                          away
                        </span>
                      </div>

                      {/* ADDRESS */}

                      <div className="flex items-start gap-2 mt-3">
                        <span className="text-lg">
                          🏠
                        </span>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {doctor.address}
                        </p>
                      </div>

                    </div>

                    {/* CARD ACTIONS */}

                    <div className="border-t border-gray-100 p-4 bg-gray-50">

                      <button
                        onClick={() =>
                          openDetails(
                            doctor
                          )
                        }
                        className="w-full py-3 rounded-xl bg-[#00674b] text-white font-semibold hover:bg-[#004d37] transition"
                      >
                        View Details
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        {/* ===================================================
            SHOW MORE
        =================================================== */}

        {!loadingDoctors &&
          !error &&
          visibleCount <
            filteredDoctors.length && (
            <div className="text-center mt-8">

              <button
                onClick={() =>
                  setVisibleCount(
                    (previous) =>
                      previous +
                      LOAD_MORE_COUNT
                  )
                }
                className="px-7 py-3.5 bg-white border-2 border-[#00674b] text-[#00674b] rounded-xl font-bold hover:bg-[#00674b] hover:text-white transition"
              >
                Show More Doctors
              </button>

            </div>
          )}

        {/* ===================================================
            ALL RESULTS SHOWN
        =================================================== */}

        {!loadingDoctors &&
          !error &&
          filteredDoctors.length > 0 &&
          visibleCount >=
            filteredDoctors.length && (
            <p className="text-center text-sm text-gray-500 mt-8">
              You have reached the end of the
              available results.
            </p>
          )}

      </div>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeDetails}
        >

          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-start justify-between gap-4">

              <div className="flex items-start gap-4">

                <div className="w-14 h-14 rounded-2xl bg-[#e8f3ef] flex items-center justify-center text-3xl shrink-0">
                  🏥
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#004d37]">
                    {selectedDoctor.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {
                      selectedDoctor.facilityType
                    }
                  </p>
                </div>

              </div>

              <button
                onClick={closeDetails}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl"
              >
                ✕
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6">

              {/* OWNERSHIP */}

              <div className="flex flex-wrap gap-2 mb-6">

                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    selectedDoctor.ownership ===
                    "Government"
                      ? "bg-green-100 text-green-700"
                      : selectedDoctor.ownership ===
                        "Non-Government"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedDoctor.ownership}
                </span>

                <span className="px-3 py-1.5 rounded-full bg-[#e8f3ef] text-[#00674b] text-sm font-semibold">
                  {
                    selectedDoctor.specialization
                  }
                </span>

              </div>

              {/* DETAILS */}

              <div className="space-y-4">

                {/* SPECIALIST */}

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                  <div className="text-2xl">
                    👨‍⚕️
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Specialist
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {
                        selectedDoctor.specialization
                      }
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                  <div className="text-2xl">
                    📍
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Address
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {
                        selectedDoctor.address
                      }
                    </p>
                  </div>

                </div>

                {/* DISTANCE */}

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                  <div className="text-2xl">
                    📏
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Distance
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {formatDistance(
                        selectedDoctor.distance
                      )}{" "}
                      from your location
                    </p>
                  </div>

                </div>

                {/* PHONE */}

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                  <div className="text-2xl">
                    📞
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Mobile / Phone
                    </p>

                    {selectedDoctor.phone ? (
                      <a
                        href={`tel:${selectedDoctor.phone}`}
                        className="font-semibold text-[#00674b] mt-1 block hover:underline break-all"
                      >
                        {
                          selectedDoctor.phone
                        }
                      </a>
                    ) : (
                      <p className="text-gray-500 mt-1">
                        Phone number not available
                      </p>
                    )}
                  </div>

                </div>

                {/* WEBSITE */}

                {selectedDoctor.website && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                    <div className="text-2xl">
                      🌐
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Website
                      </p>

                      <a
                        href={
                          selectedDoctor.website.startsWith(
                            "http"
                          )
                            ? selectedDoctor.website
                            : `https://${selectedDoctor.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#00674b] mt-1 block hover:underline break-all"
                      >
                        {
                          selectedDoctor.website
                        }
                      </a>
                    </div>

                  </div>
                )}

                {/* OPENING HOURS */}

                {selectedDoctor.openingHours && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                    <div className="text-2xl">
                      🕒
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Opening Hours
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {
                          selectedDoctor.openingHours
                        }
                      </p>
                    </div>

                  </div>
                )}

                {/* EMERGENCY */}

                {selectedDoctor.emergency && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">

                    <div className="text-2xl">
                      🚑
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Emergency
                      </p>

                      <p className="font-semibold text-gray-800 mt-1 capitalize">
                        {
                          selectedDoctor.emergency
                        }
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

                {/* CALL */}

                {selectedDoctor.phone && (
                  <a
                    href={`tel:${selectedDoctor.phone}`}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#00674b] text-white font-bold hover:bg-[#004d37] transition"
                  >
                    📞 Call Now
                  </a>
                )}

                {/* DIRECTIONS */}

                <a
                  href={getDirectionsUrl(
                    location,
                    selectedDoctor.lat,
                    selectedDoctor.lon
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#00668a] text-white font-bold hover:bg-[#004f69] transition"
                >
                  🗺️ Get Directions
                </a>

              </div>

              {/* MAP SEARCH FALLBACK */}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedDoctor.lat},${selectedDoctor.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-4 text-sm font-semibold text-[#00674b] hover:underline"
              >
                Open this location in Google Maps
              </a>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}