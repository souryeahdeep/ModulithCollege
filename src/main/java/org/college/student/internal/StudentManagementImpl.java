package org.college.student.internal;

import org.college.student.api.StudentManagement;
import org.springframework.stereotype.Service;

@Service
public class StudentManagementImpl implements StudentManagement {
    private final StudentRepository studentRepository;
    private final StudentService studentService;

    public StudentManagementImpl(StudentRepository studentRepository, StudentService studentService) {
        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }

    @Override
    public boolean exists(String studentId){
        return studentRepository.existsByStudentId(studentId);
    }

    @Override
    public boolean increaseAttendance(String studentId) {

        return studentService.increaseAttendance(studentId);
    }
}
