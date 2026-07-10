import { IdCard as IdCardIcon } from "lucide-react";

export default function IdCard({ studentId }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <IdCardIcon className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Identification</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Student ID
          </p>
          <p className="text-gray-900 font-medium mt-1 font-mono">
            {studentId}
          </p>
        </div>
      </div>
    </div>
  );
}
