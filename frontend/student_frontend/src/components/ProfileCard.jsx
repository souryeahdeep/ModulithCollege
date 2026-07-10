import { User } from "lucide-react";
export default function ProfileCard({ studentName, studentId }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Full Name
          </p>
          <p className="text-gray-900 font-medium mt-1">
            {studentName || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
