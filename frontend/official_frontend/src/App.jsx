import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/TeacherLogin";
import AllotedClasses from "./pages/AllotedClasses";
import LandingPage from "./pages/LandingPage";
import TeacherForm from "./pages/TeacherForm";
import AdminLogin from "./pages/AdminLogin";
import AtttendancePage from "./pages/AtttendancePage";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateTeacher from "./pages/UpdateTeacher";
import DeleteTeacher from "./pages/DeleteTeacher";
import FetchTeachers from "./pages/FetchTeachers";
import StudentForm from "./pages/StudentForm";
import UpdateStudent from "./pages/UpdateStudent";
import DeleteStudent from "./pages/DeleteStudent";
import FetchStudents from "./pages/FetchStudents";
import AddDepartment from "./pages/AddDepartment";
import AddCourse from "./pages/AddCourse";
import AssignTeacher from "./pages/AssignTeacher";
import SmartAttendanceInsights from "./pages/SmartAttendanceInsights";
import AddClass from "./pages/AddClass";
import CreateTimetableEntry from "./pages/CreateTimetableEntry";
import TeacherTimetable from "./pages/TeacherTimetable";
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
        <Route path="/alloted-classes" element={<AllotedClasses />} />
        <Route path="/report" element={<AtttendancePage />} />
        <Route path="/department-create" element={<AddDepartment />} />
        <Route path="/course-add" element={<AddCourse />} />
        <Route path="/course-assign" element={<AssignTeacher />} />
        <Route path="/classrooms" element={<AddClass />} />
        <Route path="/smart-attendance" element={<SmartAttendanceInsights />} />
        <Route path="/timetable" element={<CreateTimetableEntry />} />
        <Route path="/teachertimetable" element={<TeacherTimetable />} />
      </Routes>
    </BrowserRouter>
  );
}
