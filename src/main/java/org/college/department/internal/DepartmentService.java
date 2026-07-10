package org.college.department.internal;

import org.college.api.ApiResponse;
import org.college.department.api.CreateDepartmentRequest;
import org.college.department.api.DepartmentDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DepartmentService {

    private final DepartmentRepository repository;

    public DepartmentService(DepartmentRepository repository) {
        this.repository = repository;
    }

    public ApiResponse<List<UUID>> create(List<CreateDepartmentRequest> createDepartmentRequests) {
        List<UUID> departments = new ArrayList<>();
        for (CreateDepartmentRequest createDepartmentRequest : createDepartmentRequests) {
            Department department=new  Department();
            department.setName(createDepartmentRequest.getName());
            department.setDescription(createDepartmentRequest.getDescription());
            department.setCode(createDepartmentRequest.getCode());
            Department saved =    repository.save(department);
            departments.add(department.getId());
        }
        return new ApiResponse<>(true,"success",departments);
    }

    public Department update(UUID id, Department update) {
        return repository.findById(id).map(d -> {
            d.setName(update.getName());
            d.setCode(update.getCode());
            d.setDescription(update.getDescription());
            return repository.save(d);
        }).orElseThrow(() -> new IllegalArgumentException("Department not found: " + id));
    }

    public Department getById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Department not found: " + id));
    }

    public List<Department> list() {
        return repository.findAll();
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}

