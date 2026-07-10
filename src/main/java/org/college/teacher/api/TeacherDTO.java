package org.college.teacher.api;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record TeacherDTO(

        UUID id,

        String teacherId,

        String teacherName,

        String teacherEmail,

        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate teacherDateOfBirth,

        String departmentName


) {
}