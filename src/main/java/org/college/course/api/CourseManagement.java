package org.college.course.api;


import java.util.List;
import java.util.UUID;

public interface CourseManagement {

    CourseDTO findById(UUID id);
}