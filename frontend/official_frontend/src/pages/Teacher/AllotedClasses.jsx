import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AllotedClasses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingClassId, setLoadingClassId] = useState(null);
  const [error, setError] = useState("");

  const classes = location.state?.classes || [];
  console.log(classes);

  const handleGiveAttendance = async (cls) => {
    setError("");
    const classIdentifier =
      cls?.id ||
      `${cls?.stream || "stream"}-${cls?.groupNo || "group"}-${
        cls?.sectionNo || "section"
      }`;
    setLoadingClassId(classIdentifier);

    const apiUrl = `http://localhost:8081/teacher/start`;
    console.log(apiUrl);
     
    // Build request payload expected by the API when starting attendance.
    const payload = {
      stream: cls.streamCode || cls.stream,
      teacherId: cls.teacherId,
      subjectCode: cls.subjectCode || cls.classId,
      sectionNo: cls.sectionNo,
      groupNo: cls.groupNo,
      day: cls.day,
      startTime: cls.startTime,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log(response);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to fetch attendance data.");
      }

      // API returns PNG bytes; convert to a blob URL for the attendance page.
      const blob = await response.blob();
      const qrDataUrl = URL.createObjectURL(blob);

      navigate("/report", {
        state: {
          classData: cls,
          attendance: {
            token: null,
            qrDataUrl,
            expiresAt: null,
            raw: null,
          },
        },
      });
    } catch (err) {
      setError(err.message || "Unable to fetch attendance data.");
    } finally {
      setLoadingClassId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Alloted Classes
        </h1>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {classes.length === 0 ? (
          <p className="text-gray-600">No classes alloted.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {cls.streamCode || "Class Name"}
                </h2>
                <p className="text-gray-600">
                  Subject: {cls.subjectCode || "N/A"}
                </p>
                <p className="text-gray-600">
                  Section: {cls.sectionNo || "N/A"}
                </p>
                <p className="text-gray-600">Group : {cls.groupNo || "N/A"}</p>
                <p className="text-gray-600">Time: {cls.startTime || "N/A"}</p>
                <button
                  type="button"
                  onClick={() => handleGiveAttendance(cls)}
                  className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                  disabled={
                    loadingClassId ===
                    (cls?.id ||
                      `${cls?.streamCode || "stream"}-${
                        cls?.groupNo || "group"
                      }-${cls?.sectionNo || "section"}`)
                  }
                >
                  {loadingClassId ===
                  (cls?.id ||
                    `${cls?.streamCode || "stream"}-${
                      cls?.groupNo || "group"
                    }-${cls?.sectionNo || "section"}`)
                    ? "Fetching Attendance..."
                    : "Give Attendance"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllotedClasses;
