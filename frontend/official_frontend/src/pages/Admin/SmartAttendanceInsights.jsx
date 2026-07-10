import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SmartAttendanceInsights = () => {
  const navigate = useNavigate();
  const [attendanceLimit, setAttendanceLimit] = useState(80);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchStudentsWithLowAttendance = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const credentials = btoa("admin:admin123");
      const response = await fetch(
        `http://localhost:8082/admin/student/getStudentsWithLowAttendance?attendanceLimit=${attendanceLimit}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      const errorMessage = err instanceof SyntaxError
        ? "Invalid JSON response from server. The API endpoint may not be properly configured."
        : err.message || "Failed to fetch students";
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = (present, total) => {
    return ((present / total) * 100).toFixed(2);
  };

  const getAttendanceColor = (present, total) => {
    const percentage = (present / total) * 100;
    if (percentage < 60) return "bg-red-50 text-red-700";
    if (percentage < 75) return "bg-orange-50 text-orange-700";
    if (percentage < 85) return "bg-yellow-50 text-yellow-700";
    return "bg-green-50 text-green-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
              Analytics
            </p>
            <h1 className="text-3xl font-bold text-gray-800">
              Smart Attendance Insights
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor students with attendance below the specified threshold
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

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-8">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label
                htmlFor="attendanceLimit"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Attendance Limit (%)
              </label>
              <input
                id="attendanceLimit"
                type="number"
                min="0"
                max="100"
                value={attendanceLimit}
                onChange={(e) => setAttendanceLimit(Number(e.target.value))}
                placeholder="Enter attendance limit"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Shows students with attendance below this percentage
              </p>
            </div>

            <button
              onClick={fetchStudentsWithLowAttendance}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Fetching..." : "Fetch Students"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Students with Attendance Below {attendanceLimit}%
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {students.length} student{students.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading students...</p>
                </div>
              </div>
            ) : students.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    No students found with attendance below {attendanceLimit}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Great! All students have good attendance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Student Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Branch
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Group/Section
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Attendance
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                        Contact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const attendance = calculateAttendancePercentage(
                        student.present,
                        student.totalClass
                      );
                      return (
                        <tr
                          key={index}
                          className="border-b border-slate-100 hover:bg-slate-50 transition"
                        >
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {student.studentName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Roll No: {student.rollNo}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm font-medium text-gray-700">
                              {student.studentId}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                              {student.branch}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            G{student.group} / S{student.section}
                          </td>
                          <td className="px-4 py-4">
                            <div
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getAttendanceColor(
                                student.present,
                                student.totalClass
                              )}`}
                            >
                              {attendance}%
                              <span className="text-xs font-normal ml-1">
                                ({student.present}/{student.totalClass})
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-700">
                              <p>{student.mobileNo}</p>
                              <p className="text-xs text-gray-500">
                                {student.city}
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            {students.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {students.filter(
                      (s) =>
                        (s.present / s.totalClass) * 100 < 60
                    ).length}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Warning</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {students.filter(
                      (s) =>
                        (s.present / s.totalClass) * 100 >= 60 &&
                        (s.present / s.totalClass) * 100 < 75
                    ).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Caution</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {students.filter(
                      (s) =>
                        (s.present / s.totalClass) * 100 >= 75 &&
                        (s.present / s.totalClass) * 100 < 85
                    ).length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Near Limit</p>
                  <p className="text-2xl font-bold text-green-600">
                    {students.filter(
                      (s) =>
                        (s.present / s.totalClass) * 100 >= 85 &&
                        (s.present / s.totalClass) * 100 <= 100
                    ).length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartAttendanceInsights;
