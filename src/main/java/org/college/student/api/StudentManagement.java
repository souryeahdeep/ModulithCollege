package org.college.student.api;

import org.college.teacher.api.TeacherDTO;

public interface StudentManagement  {
    boolean exists(String teacherId);

    boolean increaseAttendance(String studentId);
}
