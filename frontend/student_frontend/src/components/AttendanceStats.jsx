import { BookOpen, CheckCircle } from "lucide-react";

export default function AttendanceStats({
  totalClass,
  currentPresent,
  attendancePercent,
}) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Classes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Total Classes
          </h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{totalClass}</p>
      </div>

      {/* Present */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Present</h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{currentPresent}</p>
      </div>

      {/* Attendance Percentage */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="text-amber-600 font-bold text-sm">%</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Attendance</h2>
        </div>
        <p
          className={`text-3xl font-bold ${
            attendancePercent !== null && attendancePercent < 75
              ? "text-red-600"
              : "text-gray-900"
          }`}
        >
          {attendancePercent !== null ? `${attendancePercent}%` : "N/A"}
        </p>
      </div>
    </div>
  );
}
