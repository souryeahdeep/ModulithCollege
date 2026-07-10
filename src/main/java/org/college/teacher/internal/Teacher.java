package org.college.teacher.internal;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.college.course.internal.Course;
import org.college.department.internal.Department;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@ToString(exclude = {"department"})
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "teacher_id", nullable = false, unique = true)
    private String teacherId;

    @Column(name = "teacher_name", nullable = false)
    private String teacherName;

    @Column(nullable = false)
    private String password;

    @Column(name = "teacher_email")
    private String teacherEmail;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "teacher_date_of_birth")
    private LocalDate teacherDateOfBirth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
}