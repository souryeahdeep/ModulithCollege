package org.college.course.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.college.course.internal.Course;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private UUID courseId;
    private String courseName;
    private String courseCode;   // CT401, AM219 etc.

    // Static factory — converts Course entity → CourseDTO
    public static CourseDTO from(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getCode()
        );
    }
}
