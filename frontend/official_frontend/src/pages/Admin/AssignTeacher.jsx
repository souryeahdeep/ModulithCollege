import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Endpoints use environment overrides when present.
const ASSIGN_ENDPOINT =
  import.meta.env.VITE_COURSE_ASSIGN || "http://localhost:8082/course/assign";
const COURSES_ENDPOINT = "http://localhost:8082/course";
const DEPARTMENTS_ENDPOINT = "http://localhost:8082/department/all";

const dayOptions = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AssignTeacher = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    {
      teacherId: "",
      courseCode: "",
      stream: "",
      groupNo: "",
      sectionNo: "",
      day: "",
      timing: "",
    },
  ]);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptError, setDeptError] = useState("");
  const credentials = btoa("admin:admin123");

  const fetchCourses = async () => {
    setCourseError("");
    setCourseLoading(true);
    try {
      const response = await fetch(COURSES_ENDPOINT, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${credentials}`
        }
      });
      const isJson = (response.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? await response.json().catch(() => []) : [];
      if (!response.ok) {
        throw new Error(data?.message || "Unable to fetch courses.");
      }
      const list = Array.isArray(data) ? data : [];
      setCourses(list);
    } catch (err) {
      setCourseError(err.message || "Unable to fetch courses.");
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setDeptError("");
    setDeptLoading(true);
    try {
      const response = await fetch(DEPARTMENTS_ENDPOINT, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${credentials}`
        }
      });
      const isJson = (response.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? await response.json().catch(() => []) : [];
      if (!response.ok) {
        throw new Error(data?.message || "Unable to fetch departments.");
      }
      const list = Array.isArray(data) ? data : [];
      setDepartments(list);
    } catch (err) {
      setDeptError(err.message || "Unable to fetch departments.");
    } finally {
      setDeptLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const handleRowChange = (index, field, value) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { teacherId: "", courseCode: "", stream: "", groupNo: "", sectionNo: "", day: "", timing: "" },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!rows.length) {
      setSubmitError("Add at least one class assignment.");
      return;
    }

    const cleaned = rows.map((row) => ({
      teacherId: (row.teacherId || "").trim(),
      courseCode: (row.courseCode || "").trim(),
      stream: (row.stream || "").trim(),
      groupNo: (row.groupNo || "").trim(),
      sectionNo: (row.sectionNo || "").trim(),
      day: row.day || "",
      timing: (row.timing || "").trim(),
    }));

    const invalid = cleaned.find(
      (r) =>
        !r.teacherId || !r.courseCode || !r.stream || !r.groupNo || !r.sectionNo || !r.day || !r.timing
    );

    if (invalid) {
      setSubmitError("All fields are required for every assignment.");
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = cleaned.map((r) => ({
        teacherId: r.teacherId,
        subjectCode: r.courseCode,
        stream: r.stream,
        groupNo: r.groupNo,
        sectionNo: r.sectionNo,
        day: r.day,
        startTime: r.timing,
      }));

      const response = await fetch(ASSIGN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Backend expects a list of ClassEntityDTO
        body: JSON.stringify(payload),
      });

      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json"
      );
      const data = isJson ? await response.json().catch(() => ({})) : {};

      if (!response.ok) {
        throw new Error(data?.message || "Unable to assign teacher to course.");
      }

      setSubmitSuccess("Assignment saved successfully.");
      setRows([
        { teacherId: "", courseCode: "", stream: "", groupNo: "", sectionNo: "", day: "", timing: "" },
      ]);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong while assigning.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-gray-800">
              Assign Teacher to Course
            </h1>
            <p className="text-gray-600 mt-1">
              Link a teacher to a course with schedule details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white rounded-lg shadow-sm hover:border-indigo-300"
          >
            Go Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {rows.map((row, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">Class {index + 1}</h3>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                    <input
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      type="text"
                      value={row.teacherId}
                      onChange={(e) => handleRowChange(index, "teacherId", e.target.value)}
                      placeholder="Enter ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={row.courseCode}
                      onChange={(e) => handleRowChange(index, "courseCode", e.target.value)}
                    >
                      <option value="" disabled>
                        {courseLoading ? "Loading courses..." : "Select course"}
                      </option>
                      {courses.map((course) => (
                        <option key={course.courseCode || course.id} value={course.courseCode}>
                          {course.courseCode || "(no code)"}
                        </option>
                      ))}
                    </select>
                    {courseError && (
                      <p className="text-xs text-red-600 mt-1">{courseError}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                    <select
                      value={row.stream}
                      onChange={(e) => handleRowChange(index, "stream", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="" disabled>
                        {deptLoading ? "Loading streams..." : "Select department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.code || dept.id} value={dept.code}>
                          {dept.code || "(no code)"}
                        </option>
                      ))}
                    </select>
                    {deptError && <p className="text-xs text-red-600 mt-1">{deptError}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <select
                      value={row.day}
                      onChange={(e) => handleRowChange(index, "day", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="" disabled>
                        Select day
                      </option>
                      {dayOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group No</label>
                    <input
                      type="text"
                      value={row.groupNo}
                      onChange={(e) => handleRowChange(index, "groupNo", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="e.g., 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section No</label>
                    <input
                      type="text"
                      value={row.sectionNo}
                      onChange={(e) => handleRowChange(index, "sectionNo", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="e.g., A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timing</label>
                  <input
                    type="time"
                    step="60"
                    value={row.timing}
                    onChange={(e) => handleRowChange(index, "timing", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="e.g., 10:00"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addRow}
              className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-700 rounded-lg font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              Add Another Class
            </button>

            {submitError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
                {submitSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {submitLoading ? "Assigning..." : "Assign Teacher"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTeacher;
