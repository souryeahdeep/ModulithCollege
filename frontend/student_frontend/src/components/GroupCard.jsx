import { Users } from "lucide-react";
export default function GroupCard({ group }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Group</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Group Number
          </p>
          <p className="text-gray-900 font-medium mt-1 text-2xl">{group}</p>
        </div>
      </div>
    </div>
  );
}
