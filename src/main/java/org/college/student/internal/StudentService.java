package org.college.student.internal;

import jakarta.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;
import org.college.api.ApiResponse;
import org.college.student.api.CreateStudentRequest;
import org.college.student.api.StudentDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class StudentService {
    private final StudentRepository studentRepo;
    private final StudentMapper studentMapper;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepo, StudentMapper studentMapper, PasswordEncoder passwordEncoder) {
        this.studentRepo = studentRepo;
        this.studentMapper = studentMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public String addStudent(List<CreateStudentRequest> createStudentRequests) {
        try {
            for(CreateStudentRequest createStudentRequest : createStudentRequests){
                System.out.println(createStudentRequest.getStudentId());
                Student student = studentRepo.save(studentMapper.createStudentRequestToStudent(createStudentRequest));
                System.out.println(student.getId());
            }
            return "Added students";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public Boolean updateStudent(List<StudentDTO> studentDTOList) {
        try {
            for (StudentDTO studentDTO : studentDTOList) {
                studentRepo.deleteByStudentId(studentDTO.getStudentId());
                studentRepo.save(studentMapper.studentDTOToStudent(studentDTO));
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean deleteStudent(String studentId) {
        if (studentRepo.existsByStudentId(studentId)) {
            studentRepo.deleteByStudentId(studentId);
            return true;
        } else {
            return false;
        }

    }

    public List<StudentDTO> fetchStudents(int page) {
        int pageSize = 20;
        int pageNumber = Math.max(page, 1) - 1; // convert to 0-based for PageRequest

        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by("studentId").ascending());
        var pageResult = studentRepo.findAll(pageRequest);

        // safe debug print: only print if a student exists
        List<Student> content = pageResult.getContent();
        content.stream().findFirst().ifPresent(s -> System.out.println(s.getStudentName() + " " + s.getSemester()));

        return content.stream().map(studentMapper::studentToStudentDTO).toList();
    }

    public ApiResponse<StudentDTO> fetchStudent(String studentId, String password) {
        Student student = studentRepo.findByStudentId(studentId);
        if(passwordEncoder.matches(password, student.getPassword())) {
            return new ApiResponse<>(true,"Student logged in successfully",studentMapper.studentToStudentDTO(student));
        }
        return new ApiResponse<>(false,"Student not found in successfully",null);
    }


    public boolean increaseAttendance(String studentId) {
        Student student = studentRepo.findByStudentId(studentId);
        if (student == null) {
            return false;
        } else {
            student.setPresent(student.getPresent() + 1);
            studentRepo.save(student);
            log.info("Attendance Marked Successfully");
        }
        return true;
    }

    public List<StudentDTO> fetchStudentsByBranchAndSem(String branch, Integer sem) {
        return studentRepo.findStudentsByBranch(branch).stream()
                .filter(s -> Objects.equals(s.getSemester(), sem))
                .map(studentMapper::studentToStudentDTO)
                .toList();
    }

    public @Nullable List<StudentDTO> fetchStudentsByBranchSemesterGroupAndSection(String branch, Integer sem, Integer group, Integer section) {
        return Objects.requireNonNull(studentRepo.findByBranchAndGroupAndSectionAndSemester(branch, group, section, sem)).stream().map(studentMapper::studentToStudentDTO).toList();

    }




    public List<StudentDTO> getStudentsWithLowAttendance(Integer attendanceLimit) {
        if (attendanceLimit == null) {
            return Collections.emptyList();
        }

        return studentRepo.findAll().stream()
                .filter(s -> {
                    Integer total = s.getTotalClass();
                    Integer present = s.getPresent();
                    if (present == null) present = 0;
                    // If total is null or zero, treat attendance as 0%
                    if (total == null || total == 0) {
                        return attendanceLimit > 0;
                    }
                    double percent = (present.doubleValue() * 100.0) / total.doubleValue();
                    return percent < attendanceLimit;
                })
                .map(studentMapper::studentToStudentDTO)
                .toList();
    }

    public String deleteAllStudent() {
        studentRepo.deleteAll();
        return "All students have been deleted";
    }
}
