package org.college.department.api;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDepartmentRequest {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;          // "CS", "EE", "AM"

    private String description;   // optional
}
