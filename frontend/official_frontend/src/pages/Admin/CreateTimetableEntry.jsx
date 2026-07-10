import { useState } from "react";
import { BookOpen, CalendarPlus, CheckCircle2, ChevronDown, Loader2, XCircle } from "lucide-react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

// Adjust these to match the actual TimetableEntryType enum values on the backend.
const ENTRY_TYPES = ["THEORY", "LAB", "TUTORIAL", "SEMINAR"];

const API_URL = "http://localhost:8080/api/timetable";

// ---- Fixed class periods: first period starts at 10:00, each class runs
// 50 minutes, with a 5-minute gap before the next period starts. Adjust
// PERIOD_START / PERIOD_COUNT here if the college's schedule changes. ----
const PERIOD_START = "10:00";
const CLASS_DURATION_MIN = 50;
const GAP_MIN = 5;
const PERIOD_COUNT = 8;

function addMinutes(hhmm, minutesToAdd) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutesToAdd;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function to12Hour(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function generatePeriods() {
  const periods = [];
  let cursor = PERIOD_START;
  for (let i = 0; i < PERIOD_COUNT; i++) {
    const start = cursor;
    const end = addMinutes(start, CLASS_DURATION_MIN);
    periods.push({ start, end });
    cursor = addMinutes(end, GAP_MIN);
  }
  return periods;
}

const PERIODS = generatePeriods();
const START_TIME_OPTIONS = PERIODS.map((p) => p.start);
const END_TIME_OPTIONS = PERIODS.map((p) => p.end);

const initialForm = {
  courseCode: "",
  teacherId: "",
  roomNumber: "",
  branch: "",
  sectionNo: "",
  groupNo: "",
  entryType: "",
  dayOfWeek: "",
  startTime: "",
  endTime: "",
};

const fieldCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100";
const errorFieldCls = "border-rose-400 focus:border-rose-500 focus:ring-rose-100";
const labelCls = "text-xs font-semibold uppercase tracking-wide text-slate-500";

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      {children}
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}

// LocalTime on the backend expects "HH:mm:ss"; <input type="time"> gives "HH:mm".
function toLocalTime(value) {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}

function extractErrorMessage(body, fallback) {
  if (!body) return fallback;
  if (typeof body.message === "string" && body.message.trim()) return body.message;
  return fallback;
}

export default function CreateTimetableEntryPage() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: "success" | "error", message }

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
  };

  // Picking a start time auto-fills the matching period's end time (the user
  // can still change it independently afterwards if needed).
  const handleStartTimeChange = (e) => {
    const start = e.target.value;
    const matchedPeriod = PERIODS.find((p) => p.start === start);
    setForm((f) => ({ ...f, startTime: start, endTime: matchedPeriod ? matchedPeriod.end : f.endTime }));
    setFieldErrors((fe) => ({ ...fe, startTime: undefined, endTime: undefined }));
  };

  function validate() {
    const errors = {};
    const required = ["courseCode", "teacherId", "roomNumber", "branch", "sectionNo", "entryType", "dayOfWeek", "startTime", "endTime"];
    required.forEach((key) => {
      if (form[key] === "" || form[key] === null || form[key] === undefined) {
        errors[key] = "Required";
      }
    });
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      errors.endTime = "End time must be after start time";
    }
    if (form.sectionNo !== "" && Number(form.sectionNo) <= 0) {
      errors.sectionNo = "Must be a positive number";
    }
    if (form.groupNo !== "" && Number(form.groupNo) <= 0) {
      errors.groupNo = "Must be a positive number";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      courseCode: form.courseCode.trim(),
      teacherId: form.teacherId.trim(),
      roomNumber: form.roomNumber.trim(),
      branch: form.branch.trim(),
      sectionNo: Number(form.sectionNo),
      groupNo: form.groupNo === "" ? null : Number(form.groupNo),
      entryType: form.entryType,
      dayOfWeek: form.dayOfWeek,
      startTime: toLocalTime(form.startTime),
      endTime: toLocalTime(form.endTime),
    };

    try {
      setSubmitting(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let body = null;
      try {
        body = await response.json();
      } catch {
        // no JSON body — fine, we'll fall back to status text
      }

      if (!response.ok) {
        setBanner({ type: "error", message: extractErrorMessage(body, `Request failed (${response.status})`) });
        return;
      }

      if (body && body.success === false) {
        setBanner({ type: "error", message: body.message || "Could not create the entry." });
        return;
      }

      setBanner({ type: "success", message: (body && body.message) || "Timetable entry created." });
      setForm(initialForm);
    } catch (networkError) {
      console.error("Network error:", networkError);
      setBanner({ type: "error", message: "Could not reach the server. Is the backend running?" },);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6" style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900">
            <CalendarPlus size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">New Timetable Entry</h1>
            <p className="text-sm text-slate-500">Fill in the details below to add a class to the timetable.</p>
          </div>
        </div>

        {banner && (
          <div
            className={`mb-5 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              banner.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {banner.type === "success" ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            ) : (
              <XCircle size={18} className="mt-0.5 shrink-0" />
            )}
            <span>{banner.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-4 text-sm font-medium text-slate-600">
            <BookOpen size={16} className="text-amber-600" /> Course &amp; assignment
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Course code" error={fieldErrors.courseCode}>
              <input
                className={`${fieldCls} ${fieldErrors.courseCode ? errorFieldCls : ""}`}
                type="text"
                placeholder="CS501"
                value={form.courseCode}
                onChange={update("courseCode")}
              />
            </Field>

            <Field label="Teacher ID" error={fieldErrors.teacherId}>
              <input
                className={`${fieldCls} ${fieldErrors.teacherId ? errorFieldCls : ""}`}
                type="text"
                placeholder="JIS/CST/AH"
                value={form.teacherId}
                onChange={update("teacherId")}
              />
            </Field>

            <Field label="Room number" error={fieldErrors.roomNumber}>
              <input
                className={`${fieldCls} ${fieldErrors.roomNumber ? errorFieldCls : ""}`}
                type="text"
                placeholder="101"
                value={form.roomNumber}
                onChange={update("roomNumber")}
              />
            </Field>

            <Field label="Branch" error={fieldErrors.branch}>
              <input
                className={`${fieldCls} ${fieldErrors.branch ? errorFieldCls : ""}`}
                type="text"
                placeholder="CST"
                value={form.branch}
                onChange={update("branch")}
              />
            </Field>
          </div>

          <div className="mb-5 mt-7 flex items-center gap-2 border-b border-slate-100 pb-4 text-sm font-medium text-slate-600">
            <ChevronDown size={16} className="text-amber-600" /> Section &amp; type
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Section no." error={fieldErrors.sectionNo}>
              <input
                className={`${fieldCls} ${fieldErrors.sectionNo ? errorFieldCls : ""}`}
                type="number"
                min="1"
                placeholder="1"
                value={form.sectionNo}
                onChange={update("sectionNo")}
              />
            </Field>

            <Field label="Group no. (optional)" error={fieldErrors.groupNo}>
              <input
                className={`${fieldCls} ${fieldErrors.groupNo ? errorFieldCls : ""}`}
                type="number"
                min="1"
                placeholder="—"
                value={form.groupNo}
                onChange={update("groupNo")}
              />
            </Field>

            <Field label="Entry type" error={fieldErrors.entryType}>
              <select
                className={`${fieldCls} ${fieldErrors.entryType ? errorFieldCls : ""}`}
                value={form.entryType}
                onChange={update("entryType")}
              >
                <option value="" disabled>Select type</option>
                {ENTRY_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mb-5 mt-7 flex items-center gap-2 border-b border-slate-100 pb-4 text-sm font-medium text-slate-600">
            <CalendarPlus size={16} className="text-amber-600" /> Day &amp; time
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Day of week" error={fieldErrors.dayOfWeek}>
              <select
                className={`${fieldCls} ${fieldErrors.dayOfWeek ? errorFieldCls : ""}`}
                value={form.dayOfWeek}
                onChange={update("dayOfWeek")}
              >
                <option value="" disabled>Select day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </Field>

            <Field label="Start time" error={fieldErrors.startTime}>
              <select
                className={`${fieldCls} ${fieldErrors.startTime ? errorFieldCls : ""}`}
                value={form.startTime}
                onChange={handleStartTimeChange}
              >
                <option value="" disabled>Select period</option>
                {START_TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{to12Hour(t)}</option>
                ))}
              </select>
            </Field>

            <Field label="End time" error={fieldErrors.endTime}>
              <select
                className={`${fieldCls} ${fieldErrors.endTime ? errorFieldCls : ""}`}
                value={form.endTime}
                onChange={update("endTime")}
              >
                <option value="" disabled>Select period</option>
                {END_TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{to12Hour(t)}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setFieldErrors({});
                setBanner(null);
              }}
              className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-md bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Creating…" : "Create entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}