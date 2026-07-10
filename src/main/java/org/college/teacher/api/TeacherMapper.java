package org.college.teacher.api;

import org.college.teacher.internal.Teacher;

import lombok.RequiredArgsConstructor;
import org.college.course.internal.Course;
import org.college.course.internal.CourseRepository;
import org.college.department.internal.Department;
import org.college.department.internal.DepartmentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TeacherMapper {

    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    /*
     * ENTITY -> DTO
     */
    public TeacherDTO toDTO(Teacher teacher) {

        return new TeacherDTO(

                teacher.getId(),

                teacher.getTeacherId(),

                teacher.getTeacherName(),

                teacher.getTeacherEmail(),

                teacher.getTeacherDateOfBirth(),

                teacher.getDepartment().getName()
        );
    }

    /*
     * REQUEST -> ENTITY
     */
    public Teacher toEntity(CreateTeacherRequest request) {

        Department department =
                departmentRepository.findByName(request.departmentName());
        Teacher teacher = new Teacher();

        teacher.setTeacherId(request.teacherId());

        teacher.setTeacherName(request.teacherName());

        teacher.setPassword(
                passwordEncoder.encode(request.password())
        );

        teacher.setTeacherEmail(request.teacherEmail());

        teacher.setTeacherDateOfBirth(
                request.teacherDateOfBirth()
        );

        teacher.setDepartment(department);


        return teacher;
    }
}