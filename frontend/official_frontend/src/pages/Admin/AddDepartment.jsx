import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_ENDPOINT = "http://localhost:8082/department/add"; // Adjust if your backend differs.
const FETCH_ENDPOINT = "http://localhost:8082/department/all";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [departments, setDepartments] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
        const credentials = btoa("admin:admin123");

  const fetchDepartments = async () => {
    setListError("");
    setListLoading(true);
    try {
      const response = await fetch(FETCH_ENDPOINT, {
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
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setListError(err.message || "Unable to fetch departments.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!departmentName.trim() || !departmentCode.trim()) {
      setError("Department name and code are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify({
          name: departmentName.trim(),
          code: departmentCode.trim(),
          description: description.trim() || null,
        }),
      });

      const isJson = (response.headers.get("content-type") || "").includes("application/json");
      const data = isJson ? await response.json().catch(() => ({})) : {};

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create department.");
      }

      setSuccess("Department created successfully.");
      setDepartmentName("");
      setDepartmentCode("");
      setDescription("");
      fetchDepartments();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Admin</p>
            <h1 className="text-3xl font-bold text-gray-800">Create Department</h1>
            <p className="text-gray-600 mt-1">Add a new department and basic metadata.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white rounded-lg shadow-sm hover:border-indigo-300"
          >
            Go Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name
              </label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Code
              </label>
              <input
                type="text"
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., CSE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[100px]"
                placeholder="Brief details about the department"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Create Department"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Existing Departments</h2>
            <button
              type="button"
              onClick={fetchDepartments}
              className="px-3 py-2 text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white rounded-lg shadow-sm hover:border-indigo-300 disabled:opacity-60"
              disabled={listLoading}
            >
              {listLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {listError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
              {listError}
            </div>
          )}

          <div className="space-y-3">
            {listLoading && <p className="text-sm text-gray-600">Loading departments...</p>}
            {!listLoading && departments.length === 0 && (
              <p className="text-sm text-gray-600">No departments found.</p>
            )}
            {!listLoading &&
              departments.map((dept) => (
                <div
                  key={`${dept.id || dept.code || dept.name}`}
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{dept.name || "Unnamed"}</p>
                    <p className="text-xs text-gray-600">Code: {dept.code || "N/A"}</p>
                    {dept.description && (
                      <p className="text-xs text-gray-600 mt-1">{dept.description}</p>
                    )}
                  </div>
                  {dept.id && (
                    <span className="text-xs font-semibold text-gray-500">ID: {dept.id}</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
