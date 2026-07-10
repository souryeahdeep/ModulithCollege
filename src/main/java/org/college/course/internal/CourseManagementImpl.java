package org.college.course.internal;

import lombok.RequiredArgsConstructor;
import org.college.course.api.CourseDTO;
import org.college.course.api.CourseManagement;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
class CourseManagementImpl implements CourseManagement {

    private final CourseRepository courseRepository;

    CourseManagementImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseDTO findById(UUID id) {
        Course course = courseRepository.findById(id).get();
        return CourseDTO.from(course);
    }

}
