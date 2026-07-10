package org.college.classroom.internal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService service;

    public ClassroomController(ClassroomService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Boolean> create(@RequestBody List<Classroom> classrooms) {
        return ResponseEntity.ok(service.create(classrooms));
    }

    @GetMapping
    public ResponseEntity<List<Classroom>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classroom> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classroom> update(@PathVariable UUID id, @RequestBody Classroom classroom) {
        return ResponseEntity.ok(service.update(id, classroom));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

