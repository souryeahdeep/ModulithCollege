package org.college.department.internal;

import org.college.api.ApiResponse;
import org.college.department.api.CreateDepartmentRequest;
import org.college.department.api.DepartmentDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<UUID>>> create(@RequestBody List<CreateDepartmentRequest> createDepartmentRequest) {
        return ResponseEntity.ok(service.create(createDepartmentRequest));
    }

    @GetMapping
    public ResponseEntity<List<Department>> list() {
        return ResponseEntity.ok(service.list());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable UUID id, @RequestBody Department department) {
        return ResponseEntity.ok(service.update(id, department));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

