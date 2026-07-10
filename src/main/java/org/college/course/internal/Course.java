package org.college.course.internal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.college.department.internal.Department;

import java.util.UUID;

@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(nullable = false, unique = true)
    private String code;// CT401, M(CSE)201
    private String name;// Operating System, Engineering Mathematice - II
    private Integer credits;// 3, 2
    private Integer semester;// 4, 2
    private String branch;
}

