import React from "react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "Teachers",
    description: "Create and maintain teacher records.",
    accentBg: "bg-indigo-50",
    accentText: "text-indigo-600",
    actions: [
      { label: "Add Teacher", path: "/teacher-form" },
      { label: "Update Teacher", path: "/update-teacher" },
      { label: "Delete Teacher", path: "/delete-teacher" },
      { label: "Fetch Teacher", path: "/fetch-teacher" },
    ],
  },
 
  {
    title: "Department & Course Management",
    description: "Create departments, add courses, and assign teachers to courses.",
    accentBg: "bg-amber-50",
    accentText: "text-amber-600",
    actions: [
      { label: "Create Department", path: "/department-create" },
      { label: "Add Course", path: "/course-add" },
      { label: "Assign Teacher to Course", path: "/course-assign" },
      { label: "Create Classrooms", path: "/classrooms" },
    ],
  },
  {
    title: "Student Analytics",
    description: "Monitor student attendance and performance insights.",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    actions: [
      { label: "Low Attendance Insights", path: "/smart-attendance" },
      { label: "View All Students", path: "/fetch-student" },
    ],
  },
   {
    title: "Timetable Management",
    description: "Create and manage class timetables.",
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    actions: [
      { label: "Create Timetable Entry", path: "/timetable" },
      { label: "View All Students", path: "/fetch-student" },
    ],
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action.path) {
      navigate(action.path);
      return;
    }
    window.alert(`${action.label} - wire this action to its route or API.`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">
              Admin
            </p>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Quick actions for managing teachers, students, departments, and courses.
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

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${section.accentBg} ${section.accentText} font-bold`}
                  aria-hidden
                >
                  {section.title.charAt(0)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {section.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleAction(action)}
                    className="w-full px-4 py-3 text-sm font-semibold text-gray-800 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
