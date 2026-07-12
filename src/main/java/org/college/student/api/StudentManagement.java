package org.college.student.api;

import org.college.api.ApiResponse;
import org.college.teacher.api.TeacherDTO;

public interface StudentManagement  {
    boolean exists(String teacherId);

    ApiResponse<String> increaseAttendance(String studentId);
}
