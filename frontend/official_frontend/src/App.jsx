import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Teacher/TeacherLogin";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TeacherForm from "./pages/Admin/TeacherForm";
import UpdateTeacher from "./pages/Admin/UpdateTeacher";
import DeleteTeacher from "./pages/Admin/DeleteTeacher";
import FetchTeachers from "./pages/Admin/FetchTeachers";
import StudentForm from "./pages/Admin/StudentForm";
import UpdateStudent from "./pages/Admin/UpdateStudent";
import AllotedClasses from "./pages/Teacher/AllotedClasses";
import DeleteStudent from "./pages/Admin/DeleteStudent";
import FetchStudents from "./pages/Admin/FetchStudents";
import ChangePassword from "./pages/Teacher/ChangePassword";
import AddDepartment from "./pages/Admin/AddDepartment";
import AddCourse from "./pages/Admin/AddCourse";
import AssignTeacher from "./pages/Admin/AssignTeacher";
import AddClass from "./pages/Admin/AddClass";
import SmartAttendanceInsights from "./pages/Admin/SmartAttendanceInsights";
import CreateTimetableEntry from "./pages/Admin/CreateTimetableEntry";
import TeacherTimetable from "./pages/Teacher/TeacherTimetable";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/teacher-form" element={<TeacherForm />} />
        <Route path="/update-teacher" element={<UpdateTeacher />} />
        <Route path="/delete-teacher" element={<DeleteTeacher />} />
        <Route path="/fetch-teacher" element={<FetchTeachers />} />

        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/update-student" element={<UpdateStudent />} />
        <Route path="/delete-student" element={<DeleteStudent />} />
        <Route path="/fetch-student" element={<FetchStudents />} />
        
        <Route path="/teacher-login" element={<Login />} />
        <Route path="/teacher-change-password" element={<ChangePassword />} />
        <Route path="/department-create" element={<AddDepartment />} />
        <Route path="/course-add" element={<AddCourse />} />
        <Route path="/course-assign" element={<AssignTeacher />} />
        <Route path="/classrooms" element={<AddClass />} />
        <Route path="/smart-attendance" element={<SmartAttendanceInsights />} />
        <Route path="/timetable" element={<CreateTimetableEntry />} />
        <Route path="/teachertimetable" element={<TeacherTimetable />} />
                <Route path="/alloted-classes" element={<AllotedClasses />} />

      </Routes>
    </BrowserRouter>
  );
}
