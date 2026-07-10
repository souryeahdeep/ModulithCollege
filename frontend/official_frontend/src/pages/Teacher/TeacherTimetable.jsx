import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle, Bell, BookOpen, CalendarX2, Clock, Loader2, MapPin, RefreshCw, Users } from "lucide-react";

const DAY_ORDER = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const GRID_DAYS = [
  { key: "MONDAY", label: "Mon" },
  { key: "TUESDAY", label: "Tue" },
  { key: "WEDNESDAY", label: "Wed" },
  { key: "THURSDAY", label: "Thu" },
  { key: "FRIDAY", label: "Fri" },
  { key: "SATURDAY", label: "Sat" },
];

const GRID_DAY_START = "09:00";
const GRID_DAY_END = "18:00";

// Matches the backend's entry_type check constraint (THEORY, LAB). Any value
// outside this list falls back to the default style rather than crashing.
const ENTRY_STYLES = {
  THEORY: { tab: "bg-indigo-600", fill: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-300", abbr: "THEORY" },
  LAB: { tab: "bg-emerald-600", fill: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-300", abbr: "LAB" },
};
const DEFAULT_ENTRY_STYLE = { tab: "bg-slate-600", fill: "bg-slate-50", text: "text-slate-800", border: "border-slate-300", abbr: "CLASS" };

function toMinutes(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
}

const gridDayStartMin = toMinutes(GRID_DAY_START);
const gridTotalRows = Math.round((toMinutes(GRID_DAY_END) - gridDayStartMin) / 30);
const rowOf = (t) => Math.round((toMinutes(t) - gridDayStartMin) / 30) + 2;
const spanOf = (start, end) => Math.max(1, Math.round((toMinutes(end) - toMinutes(start)) / 30));

function hourTicks() {
  const ticks = [];
  let m = gridDayStartMin;
  while (m <= toMinutes(GRID_DAY_END)) {
    const h = Math.floor(m / 60);
    ticks.push({ row: Math.round((m - gridDayStartMin) / 30) + 2, label: `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "a" : "p"}` });
    m += 60;
  }
  return ticks;
}

function todayKey() {
  const map = { 1: "MONDAY", 2: "TUESDAY", 3: "WEDNESDAY", 4: "THURSDAY", 5: "FRIDAY", 6: "SATURDAY" };
  return map[new Date().getDay()] || null;
}

// The backend takes a single day per request (TeacherTimetableRequest has a
// scalar `dayOfWeek`, not a list), so a full week means one call per grid
// day, fired in parallel and merged into one flat list.
async function fetchTeacherTimetable({ teacherId }) {
  console.log("fetchTeacherTimetable: teacherId:", teacherId);
  const results = await Promise.all(
    GRID_DAYS.map(async (d) => {
      const response = await fetch(`http://localhost:8080/api/timetable/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, dayOfWeek: d.key }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${d.label} timetable: ${response.status}`);
      }

      const data = await response.json();
      const entries = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      // Backend already stamps dayOfWeek on each entry, but fall back to the
      // day we requested in case a given entry omits it.
      return entries.map((e) => ({ ...e, dayOfWeek: e.dayOfWeek || d.key }));
    })
  );

  return results.flat();
}

function getDayIndex(dayOfWeek) {
  const index = DAY_ORDER.indexOf(dayOfWeek);
  return index === -1 ? DAY_ORDER.length : index;
}

function WeeklyGrid({ entries }) {
  const ticks = hourTicks();
  const today = todayKey();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-white py-20 text-center">
        <CalendarX2 className="text-slate-300" size={36} />
        <p className="font-serif text-lg text-slate-600">No classes scheduled</p>
        <p className="max-w-xs text-sm text-slate-400">Nothing came back for this teacher this week — try refreshing.</p>
      </div>
    );
  }
  console.log(entries);
  

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <div
        className="grid min-w-[880px]"
        style={{ gridTemplateColumns: "64px repeat(6, 1fr)", gridTemplateRows: `44px repeat(${gridTotalRows}, 1.75rem)` }}
      >
        <div className="sticky left-0 z-20 flex items-center justify-center border-b border-r border-slate-200 bg-slate-50" style={{ gridColumn: 1, gridRow: 1 }}>
          <Bell size={14} className="text-amber-600" />
        </div>

        {GRID_DAYS.map((d, i) => (
          <div
            key={d.key}
            className={`flex items-center justify-center gap-1.5 border-b border-r border-slate-200 font-serif text-sm tracking-wide ${
              d.key === today ? "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-700"
            }`}
            style={{ gridColumn: i + 2, gridRow: 1 }}
          >
            {d.label}
            {d.key === today && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
          </div>
        ))}

        {ticks.map((t, i) => (
          <div
            key={i}
            className="sticky left-0 z-10 border-r border-t border-slate-200 bg-slate-50 pr-2 text-right font-mono text-[10px] text-slate-400"
            style={{ gridColumn: 1, gridRow: `${t.row} / span 1` }}
          >
            <span className="relative -top-2 block">{t.label}</span>
          </div>
        ))}    
        {GRID_DAYS.map((d, i) =>
          Array.from({ length: gridTotalRows }).map((_, r) => (
            <div
              key={`${d.key}-bg-${r}`}
              className={`border-r border-t ${r % 2 === 0 ? "border-slate-200" : "border-slate-100"} ${d.key === today ? "bg-amber-50/40" : ""}`}
              style={{ gridColumn: i + 2, gridRow: r + 2 }}
            />
          ))
        )}
        {entries.map((e) => {
          const dayIndex = GRID_DAYS.findIndex((d) => d.key === e.dayOfWeek);
          if (dayIndex === -1 || !e.startTime || !e.endTime) return null;
          const style = ENTRY_STYLES[e.entryType] || DEFAULT_ENTRY_STYLE;
          const cohort = [e.branch, e.courseCode ,e.classroomNo,e.sectionNo != null ? `Sec ${e.sectionNo}` : null].filter(Boolean).join(" · ");

          return (
            <div
              key={e.id ?? `${e.courseName}-${e.dayOfWeek}-${e.startTime}`}
              className={`relative m-0.5 flex flex-col overflow-hidden rounded-md border ${style.border} ${style.fill} shadow-sm`}
              style={{ gridColumn: dayIndex + 2, gridRow: `${rowOf(e.startTime)} / span ${spanOf(e.startTime, e.endTime)}` }}
              title={`${e.courseName} · ${cohort} · Room ${e.classroomNo}`}
            >
              <div className={`flex items-center justify-between px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${style.tab}`}>
                <span>{style.abbr}</span>
                {e.groupNo != null && <span className="opacity-80">G{e.groupNo}</span>}
              </div>
              <div className={`flex flex-1 flex-col justify-center gap-0.5 px-1.5 py-0.5 ${style.text}`}>
                <span className="truncate text-[11px] font-semibold leading-tight">{e.courseName}</span>
                {cohort && (
                  <span className="flex items-center gap-1 truncate text-[10px] leading-tight opacity-90">
                    <Users size={9} /> {cohort}
                  </span>
                )}
                <span className="flex items-center gap-1 truncate font-mono text-[9px] leading-tight opacity-75">
                  <MapPin size={9} /> {e.classroomNo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
      {Object.entries(ENTRY_STYLES).map(([key, s]) => (
        <span key={key} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-sm ${s.tab}`} />
          {key.charAt(0) + key.slice(1).toLowerCase()}
        </span>
      ))}
    </div>
  );
}

export default function TeacherTimetablePage() {
  const location = useLocation();

  const {
    teacherName: teacherNameFromState,
    teacherId: teacherIdFromState,
    details: initialDetails,
    token: tokenFromState,
  } = location.state || {};
  
  // location.state can arrive empty on the very first navigation (e.g. the
  // sending page passed a stale/undefined value before its own state
  // finished updating). Fall back to a cached copy in sessionStorage so the
  // page still renders correctly instead of silently showing nothing until
  // the user navigates again.
  const readCachedSession = () => {
    try {
      const raw = sessionStorage.getItem("teacherSession");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const [session, setSession] = useState(() => {
    if (initialDetails) {
      return { details: initialDetails, teacherName: teacherNameFromState, teacherId: teacherIdFromState, token: tokenFromState };
    }
    return readCachedSession();
  });

  const teacherDetails = session?.details;
  const teacherId = session?.teacherId ?? teacherDetails?.data?.teacherId;
  const teacherName = teacherNameFromState ?? teacherDetails?.data?.teacherName;
  console.log("TeacherTimetablePage: teacherId:", teacherId, "teacherName:", teacherName, "details:", teacherDetails);
  // Whenever a real, non-empty location.state shows up (including on a
  // later render, e.g. after the sending page's state finished updating),
  // adopt it and cache it for next time.
  useEffect(() => {
    if (initialDetails) {
      const next = { details: initialDetails, teacherName: teacherNameFromState, teacherId: teacherIdFromState, token: tokenFromState };
      setSession(next);
      try {
        sessionStorage.setItem("teacherSession", JSON.stringify(next));
      } catch {
        // sessionStorage unavailable (private mode, etc.) — safe to ignore
      }
    }
  }, [initialDetails, teacherNameFromState, teacherIdFromState, tokenFromState]);

  const [timetableResponse, setTimetableResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTimetable = useCallback(async () => {
    // Guard: don't call the API (and don't crash) if we don't actually
    // have a teacherId yet.
    if (!teacherId) {
      setTimetableResponse([]);
      setError("Missing teacher id. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const entries = await fetchTeacherTimetable({ teacherId });
      setTimetableResponse(entries);
    } catch (fetchError) {
      setTimetableResponse([]);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  const sortedEntries = useMemo(() => {
    return [...timetableResponse].sort((left, right) => {
      const dayDiff = getDayIndex(left.dayOfWeek) - getDayIndex(right.dayOfWeek);
      if (dayDiff !== 0) return dayDiff;
      return String(left.startTime || "").localeCompare(String(right.startTime || ""));
    });
  }, [timetableResponse]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-amber-50 to-orange-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 shadow-lg shadow-slate-950/20">
              <BookOpen size={20} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Teacher Timetable</h1>
              <p className="text-sm text-slate-600">
                {teacherName ? `Welcome, ${teacherName}` : "Fetches and prints the timetable entries returned by the backend."}
                {teacherId ? ` (${teacherId})` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={loadTimetable}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </header>

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Couldn't load the timetable</p>
              <p className="text-rose-600">{error}</p>
            </div>
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            {loading ? "Loading…" : `${sortedEntries.length} ${sortedEntries.length === 1 ? "class" : "classes"} this week`}
          </div>
          <Legend />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-20 text-center text-slate-500 shadow-sm">
            <Loader2 size={32} className="animate-spin text-amber-500" />
            <p className="text-sm">Fetching timetable…</p>
          </div>
        ) : (
          <WeeklyGrid entries={sortedEntries} />
        )}

        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} /> Grid spans {GRID_DAY_START}–{GRID_DAY_END}, Monday through Saturday. One request is sent per day (backend takes a single day per call).
        </p>
      </div>
    </div>
  );
}