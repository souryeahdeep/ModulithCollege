import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, QrCode, Users } from "lucide-react";

const AllotedClasses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const qrUrlRef = useRef(null);

  // The timetable grid now sends a single clicked entry, not a list.
  const entry = location.state?.entry || null;

  // Blob URLs aren't garbage-collected automatically — revoke the previous
  // one whenever we get a new one, and on unmount.
  useEffect(() => {
    return () => {
      if (qrUrlRef.current) URL.revokeObjectURL(qrUrlRef.current);
    };
  }, []);

  const handleGiveAttendance = async () => {
    if (!entry) return;
    setError("");
    setLoading(true);

    const apiUrl = `http://localhost:8080/api/attendance/start`;

    try {
      // Forward the exact entry the grid gave us, unmodified, as the request body.
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to start attendance.");
      }

      // API returns PNG bytes; convert to a blob URL and show it right here.
      const blob = await response.blob();
      if (qrUrlRef.current) URL.revokeObjectURL(qrUrlRef.current);
      const newQrUrl = URL.createObjectURL(blob);
      qrUrlRef.current = newQrUrl;
      setQrDataUrl(newQrUrl);
    } catch (err) {
      setError(err.message || "Unable to start attendance.");
    } finally {
      setLoading(false);
    }
  };

  if (!entry) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">No class selected</h1>
          <p className="mb-6 text-gray-600">
            Go back to your timetable and click a class block to start attendance for it.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={16} /> Back to timetable
          </button>
        </div>
      </div>
    );
  }

  const cohort = [entry.branch, entry.sectionNo != null ? `Sec ${entry.sectionNo}` : null, entry.groupNo != null ? `G${entry.groupNo}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={16} /> Back to timetable
        </button>

        <h1 className="mb-6 text-3xl font-bold text-gray-800">Start Attendance</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
        )}

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">{entry.courseName || "Class"}</h2>
          {cohort && (
            <p className="mb-1 flex items-center gap-1.5 text-gray-600">
              <Users size={16} /> {cohort}
            </p>
          )}
          <p className="mb-1 flex items-center gap-1.5 text-gray-600">
            <MapPin size={16} /> Room {entry.classroomNo || "N/A"}
          </p>
          <p className="text-gray-600">
            {entry.dayOfWeek || "N/A"} · {entry.startTime || "N/A"} – {entry.endTime || "N/A"}
          </p>

          {qrDataUrl ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <img src={qrDataUrl} alt="Attendance QR code" className="h-56 w-56 rounded-md border border-slate-200 bg-white object-contain" />
              <p className="text-center text-sm text-gray-600">Students can scan this to mark attendance.</p>
              <button
                type="button"
                onClick={handleGiveAttendance}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <QrCode size={16} />
                {loading ? "Refreshing…" : "Regenerate QR"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGiveAttendance}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <QrCode size={18} />
              {loading ? "Starting Attendance..." : "Give Attendance"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllotedClasses;