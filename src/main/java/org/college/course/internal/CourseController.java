package org.college.course.internal;

import org.college.course.api.CreateCourseRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Boolean> create(@RequestBody List<CreateCourseRequest> courses) {
        return ResponseEntity.ok(service.create(courses));
    }

    @GetMapping
    public ResponseEntity<List<Course>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable UUID id, @RequestBody Course course) {
        return ResponseEntity.ok(service.update(id, course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

