import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CLASSROOM_ADD_ENDPOINT = "http://localhost:8082/classroom";
const CLASSROOM_LIST_ENDPOINT = "http://localhost:8082/classroom/available";

const ROOM_TYPES = [
  "CLASSROOM",
  "LAB",
];

const AddClass = () => {
  const navigate = useNavigate();

  // Form state
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [available, setAvailable] = useState(true);

  // Submission state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // List state
  const [classrooms, setClassrooms] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  const fetchClassrooms = async () => {
    setListError("");
    setListLoading(true);
    try {
      const credentials = btoa("admin:admin123");
      const response = await fetch(CLASSROOM_LIST_ENDPOINT, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${credentials}`
        }
      });
      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json"
      );
      const data = isJson ? await response.json().catch(() => []) : [];

      if (!response.ok) {
        throw new Error(data?.message || "Unable to fetch classrooms.");
      }

      setClassrooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setListError(err.message || "Unable to fetch classrooms.");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!roomNumber.trim()) {
      setSubmitError("Room number is required.");
      return;
    }

    if (!roomType) {
      setSubmitError("Please select a room type.");
      return;
    }

    const roomNum = parseInt(roomNumber);
    if (isNaN(roomNum) || roomNum <= 0) {
      setSubmitError("Room number must be a valid positive number.");
      return;
    }

    setSubmitLoading(true);

    try {
      const body = {
        roomNumber: roomNum,
        roomType: roomType,
        available: available,
      };

      const credentials = btoa("admin:admin123");
      const response = await fetch(CLASSROOM_ADD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`
        },
        body: JSON.stringify(body),
      });

      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json"
      );
      const data = isJson ? await response.json().catch(() => ({})) : {};

      if (!response.ok) {
        throw new Error(data?.message || "Unable to create classroom.");
      }

      setSubmitSuccess("Class Added Successfully");
      setRoomNumber("");
      setRoomType("");
      setAvailable(true);
      fetchClassrooms();
    } catch (err) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-gray-800">Create Classroom</h1>
            <p className="text-gray-600 mt-1">Add a new classroom with room details.</p>
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
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g., 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type <span className="text-red-500">*</span>
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Select a room type</option>
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="available" className="ml-3 text-sm text-gray-700 cursor-pointer">
                  Room is available
                </label>
              </div>
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
              disabled={submitLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {submitLoading ? "Creating..." : "Create Classroom"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Existing Classrooms</h2>
            <button
              type="button"
              onClick={fetchClassrooms}
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
            {listLoading && <p className="text-sm text-gray-600">Loading classrooms...</p>}
            {!listLoading && classrooms.length === 0 && (
              <p className="text-sm text-gray-600">No classrooms found.</p>
            )}
            {!listLoading &&
              classrooms.map((classroom) => (
                <div
                  key={classroom.id || classroom.roomNumber}
                  className="p-4 border border-gray-200 rounded-lg flex justify-between items-center hover:border-indigo-200 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Room #{classroom.roomNumber}
                    </p>
                    <p className="text-xs text-gray-600">
                      Type: <span className="font-medium">{classroom.roomType}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          classroom.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {classroom.available ? "Available" : "Not Available"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        classroom.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {classroom.available ? "✓ Active" : "✗ Inactive"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClass;
