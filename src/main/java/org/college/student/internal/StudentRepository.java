package org.college.student.internal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    Student findByStudentIdAndStudentName(String id, String name);

    List<Student> findStudentsByBranch(String branch);

    List<Student> findByBranchAndGroupAndSectionAndSemester(String branch, Integer group, Integer section, Integer sem);

    void deleteByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    Student findByStudentId(String studentId);
}