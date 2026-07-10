import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProfileCard from "../components/ProfileCard";
import GroupCard from "../components/GroupCard";
import SectionCard from "../components/SectionCard";
import IdCard from "../components/IdCard";
import BranchCard from "../components/BranchCard";
import AttendanceStats from "../components/AttendanceStats";

// Helper function to resolve nested properties with multiple fallbacks
const resolveValue = (details, paths, fallback = "N/A") => {
  for (const path of paths) {
    const keys = path.split(".");
    let value = details;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }

    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return fallback;
};

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    studentName,
    studentId,
    details: initialDetails,
    token: tokenFromState,
  } = location.state || {};

  const [studentDetails, setStudentDetails] = useState(initialDetails);

  // Resolve token
  const token =
    tokenFromState ||
    studentDetails?.token ||
    window.localStorage.getItem("studentToken");

  // Extract fields from details using helper
  const totalClass = resolveValue(studentDetails || {}, ["data.totalClass"]);

  const resolvePresentFromDetails = () => {
    const presentValue = resolveValue(
      studentDetails || {},
      ["data.present"],
      null
    );

    const numericPresent = Number(presentValue);
    return Number.isFinite(numericPresent) ? numericPresent : "N/A";
  };

  const [currentPresent, setCurrentPresent] = useState(() => {
    if (studentId) {
      try {
        const storedValue = window.sessionStorage.getItem(
          `attendance-present-${studentId}`
        );
        if (storedValue !== null) {
          const parsed = Number(storedValue);
          if (Number.isFinite(parsed)) return parsed;
        }
      } catch (error) {
        console.warn("Unable to read present count from storage", error);
      }
    }
    return resolvePresentFromDetails();
  });

  const [usedScanValues, setUsedScanValues] = useState(() => {
    if (studentId) {
      try {
        const stored = window.sessionStorage.getItem(
          `attendance-used-scans-${studentId}`
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (error) {
        console.warn("Unable to read used scan list", error);
      }
    }
    return [];
  });

  const group = resolveValue(studentDetails || {}, ["group", "data.group"]);
  const section = resolveValue(studentDetails || {}, [
    "section",
    "data.section",
  ]);
  const branch = resolveValue(studentDetails || {}, [
    "branch",
    "data.branch",
    "data.branchName",
    "data.branch_name",
    "department",
    "data.department",
  ]);

  // Sync currentPresent with details updates
  useEffect(() => {
    const latest = resolvePresentFromDetails();
    if (latest !== "N/A" && latest !== currentPresent) {
      setCurrentPresent(latest);
    }
  }, [studentDetails]);

  // Persist token
  useEffect(() => {
    if (token) {
      try {
        window.localStorage.setItem("studentToken", token);
      } catch (error) {
        console.warn("Unable to persist student token", error);
      }
    }
  }, [token]);

  // Persist present count
  useEffect(() => {
    if (studentId && currentPresent !== undefined && currentPresent !== null) {
      try {
        window.sessionStorage.setItem(
          `attendance-present-${studentId}`,
          String(currentPresent)
        );
      } catch (error) {
        console.warn("Unable to persist present count", error);
      }
    }
  }, [currentPresent, studentId]);

  // Persist used scans
  useEffect(() => {
    if (studentId) {
      try {
        window.sessionStorage.setItem(
          `attendance-used-scans-${studentId}`,
          JSON.stringify(usedScanValues)
        );
      } catch (error) {
        console.warn("Unable to persist used scan list", error);
      }
    }
  }, [usedScanValues, studentId]);

  // Calculate attendance percentage
  const parsedTotalClasses = Number(totalClass);
  const parsedPresent = Number(currentPresent);
  const attendancePercent =
    Number.isFinite(parsedTotalClasses) &&
    parsedTotalClasses > 0 &&
    Number.isFinite(parsedPresent)
      ? Math.round((parsedPresent / parsedTotalClasses) * 100)
      : null;

  const handleLogout = () => {
    navigate("/");
  };

  const refreshStudentDetails = async () => {
    if (!studentName || !studentId) return;

    try {
      const response = await fetch(
        `http://localhost:8080/student/login?name=${encodeURIComponent(
          studentName.trim()
        )}&id=${studentId.trim()}`,
        { method: "GET" }
      );

      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json"
      );
      const data = isJson ? await response.json().catch(() => ({})) : {};

      if (!response.ok) {
        throw new Error(data?.message || "Unable to refresh details.");
      }

      setStudentDetails(data);

      const latestPresent = Number(data?.student?.present);
      if (Number.isFinite(latestPresent)) {
        setCurrentPresent(latestPresent);
      }
    } catch (error) {
      console.error("Failed to refresh student details", error);
    }
  };

  const handleScanSuccess = async () => {
    // Optimistically update present count for instant feedback
    setCurrentPresent((prev) => {
      const numeric = Number(prev);
      return Number.isFinite(numeric) ? numeric + 1 : 1;
    });

    await refreshStudentDetails();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header
        studentName={studentName}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            View your profile and academic details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <ProfileCard studentName={studentDetails?.data?.studentName || studentName} studentId={studentId} />

          {/* ID Card */}
          <IdCard studentId={studentId} />

          {/* Group Card */}
          <GroupCard group={group} />

          {/* Section Card */}
          <SectionCard section={section} />

          {/* Branch Card */}
          <BranchCard branch={branch} />
        </div>

        {/* Attendance Stats */}
        <AttendanceStats
          totalClass={studentDetails?.data?.totalClass}
          currentPresent={currentPresent}
          attendancePercent={attendancePercent}
        />

      </main>
    </div>
  );
}
