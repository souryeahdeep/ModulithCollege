package org.college.teacher.internal;

import lombok.RequiredArgsConstructor;
import org.college.teacher.api.TeacherDTO;
import org.college.teacher.api.TeacherManagement;
import org.college.teacher.api.TeacherMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherManagementImpl implements TeacherManagement {

    private final TeacherRepository teacherRepository;

    private final TeacherMapper teacherMapper;

    @Override
    public TeacherDTO findTeacherByTeacherId(String teacherId) {

        Teacher teacher =
                teacherRepository.findTeacherByTeacherId(teacherId);

        if (teacher == null) {
            throw new RuntimeException(
                    "Teacher not found with id: " + teacherId
            );
        }

        return teacherMapper.toDTO(teacher);
    }
}