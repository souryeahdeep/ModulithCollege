package org.college.teacher.internal;

import org.college.department.internal.Department;
import org.college.timetable.api.TimetableEntryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, UUID> {
    Teacher findByTeacherNameAndTeacherId(String name, String oldPassword);

    Teacher findTeacherByTeacherId(String id);
    List<Teacher> findByDepartment(Department department);
    List<Teacher> findByDepartmentId(Long departmentId);  // no join needed in caller


    boolean existsByTeacherId(String teacherId);

    void deleteByTeacherId(String teacherId);

    List<TimetableEntryDTO> findByTeacherId(String teacherId);
}

