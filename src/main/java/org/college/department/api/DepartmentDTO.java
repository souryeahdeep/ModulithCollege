package org.college.department.api;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.college.department.internal.Department;

import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {

    private UUID id;
    private String name;
    private String code;
    private String description;

    // Static factory
    public static DepartmentDTO from(Department department) {
        return new DepartmentDTO(
                department.getId(),
                department.getName(),
                department.getCode(),
                department.getDescription()
        );
    }
}
