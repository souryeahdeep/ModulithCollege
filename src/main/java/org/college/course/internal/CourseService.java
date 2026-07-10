package org.college.course.internal;

import org.college.course.api.CreateCourseRequest;
import org.college.department.internal.Department;
import org.college.department.internal.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CourseService {

    private final CourseRepository repository;
    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public boolean create(List<CreateCourseRequest> courses) {
        for (CreateCourseRequest course : courses) {
            Course newCourse = new Course();
            newCourse.setCode(course.code());
            newCourse.setName(course.name());
            newCourse.setCredits(course.credits());
            newCourse.setBranch(course.branch());
            newCourse.setSemester(course.semester());
            repository.save(newCourse);
        }
        return true;
    }

    public Course update(UUID id, Course update) {
        return repository.findById(id).map(c -> {
            c.setName(update.getName());
            c.setCode(update.getCode());
            c.setCredits(update.getCredits());
            c.setBranch(update.getBranch());
            return repository.save(c);
        }).orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));
    }

    public Course getById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));
    }

    public List<Course> list() {
        return repository.findAll();
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}

