package org.college.student.internal;


import org.college.student.api.CreateStudentRequest;
import org.college.student.api.StudentDTO;

public interface StudentMapper {
    StudentDTO studentToStudentDTO(Student student);
    Student studentDTOToStudent(StudentDTO studentDTO);

    Student createStudentRequestToStudent(CreateStudentRequest studentDTO);
}
