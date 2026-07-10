import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Adjust endpoints if your backend differs.
const DEPARTMENT_LIST_ENDPOINT = "http://localhost:8082/department/all";
const COURSE_CREATE_ENDPOINT = "http://localhost:8082/course/add";

const AddCourse = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(true);
  const [deptError, setDeptError] = useState("");

  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [semester, setSemester] = useState("");
  const [credits, setCredits] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDept, setSelectedDept] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      setDeptLoading(true);
      setDeptError("");
      try {
        const response = await fetch(DEPARTMENT_LIST_ENDPOINT);
        const isJson = (response.headers.get("content-type") || "").includes("application/json");
        const data = isJson ? await response.json().catch(() => []) : [];

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load departments.");
        }

        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        setDeptError(err.message || "Failed to load departments.");
      } finally {
        setDeptLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const departmentOptions = useMemo(() => {
    return departments.map((dept) => ({
      id: dept.id || dept.departmentId || dept.code || dept.name,
      label: `${dept.name || dept.departmentName || "Unnamed"}${dept.code ? ` (${dept.code})` : ""}`,
    }));
  }, [departments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!selectedDept) {
      setSubmitError("Please select a department.");
      return;
    }
    if (!courseName.trim() || !courseCode.trim()) {
      setSubmitError("Course name and code are required.");
      return;
    }

    setSubmitLoading(true);

    try {
      const body = {
        courseName: courseName.trim(),
        courseCode: courseCode.trim(),
        departmentId: selectedDept,
        credits: credits ? Number(credits) : null,
      };

      const response = await fetch(COURSE_CREATE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const isJson = (response.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? await response.json().catch(() => ({})) : {};

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create course.");
      }

      setSubmitSuccess("Course created successfully.");
      setCourseName("");
      setCourseCode("");
      setSemester("");
      setCredits("");
      setDescription("");
      setSelectedDept("");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong while creating the course.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Admin</p>
            <h1 className="text-3xl font-bold text-gray-800">Add Course</h1>
            <p className="text-gray-600 mt-1">Attach a course to a department/branch.</p>
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
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
                <p className="text-sm text-gray-600">Select a department to attach the course.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDeptError("");
                  setDeptLoading(true);
                  fetch(DEPARTMENT_LIST_ENDPOINT)
                    .then((res) => {
                      const isJson = (res.headers.get("content-type") || "").includes("application/json");
                      return Promise.all([res, isJson ? res.json().catch(() => []) : []]);
                    })
                    .then(([res, data]) => {
                      if (!res.ok) {
                        throw new Error(data?.message || "Unable to load departments.");
                      }
                      setDepartments(Array.isArray(data) ? data : []);
                    })
                    .catch((err) => setDeptError(err.message || "Failed to load departments."))
                    .finally(() => setDeptLoading(false));
                }}
                className="px-3 py-2 text-xs font-semibold text-indigo-700 border border-indigo-200 bg-white rounded-md hover:border-indigo-300"
                disabled={deptLoading}
              >
                {deptLoading ? "Loading..." : "Reload"}
              </button>
            </div>

            {deptError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {deptError}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-sm text-gray-700">Choose department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                disabled={deptLoading || departmentOptions.length === 0}
              >
                <option value="" disabled>
                  {deptLoading ? "Loading departments..." : "Select department"}
                </option>
                {departmentOptions.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g., Data Structures"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g., CS201"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester (optional)</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credits (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g., 4"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[100px]"
                placeholder="Brief details about the course"
              />
            </div>

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
              disabled={submitLoading || deptLoading || departmentOptions.length === 0}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {submitLoading ? "Submitting..." : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
