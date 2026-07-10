package org.college.student.internal;


import org.college.api.ApiResponse;
import org.college.student.api.CreateStudentRequest;
import org.college.student.api.StudentDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RequestMapping("/student")
@RestController
public class StudentController {
    private final StudentService studentService;
    StudentController(StudentService studentService){
        this.studentService=studentService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addStudent(@RequestBody List<CreateStudentRequest> createStudentRequests) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addStudent(createStudentRequests));
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllStudent() {
        return ResponseEntity.ok().body(studentService.deleteAllStudent());
    }


    @DeleteMapping("/delete")
    public ResponseEntity<Boolean> deleteStudent(@RequestParam String id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.deleteStudent(id));
    }


    // APIs used by Teacher and Admin
    // GET /student/get?branch=...&semester=...
    @GetMapping(value = "/get", params = {"branch", "semester"})
    public ResponseEntity<List<StudentDTO>> getAllStudents(@RequestParam String branch, @RequestParam Integer semester) {
        return ResponseEntity.ok().body(studentService.fetchStudentsByBranchAndSem(branch, semester));
    }

    // GET /student/get?branch=...&year=...&group=...&section=...
    @GetMapping(value = "/get")
    public ResponseEntity<List<StudentDTO>> getAllStudents(@RequestParam String branch,
                                                           @RequestParam Integer sem,
                                                           @RequestParam Integer group,
                                                           @RequestParam Integer section) {
        return ResponseEntity.ok().body(studentService.fetchStudentsByBranchSemesterGroupAndSection(branch, sem, group, section));
    }

    @GetMapping(value = "/getStudentsWithLowAttendance")
    public ResponseEntity<List<StudentDTO>> getStudentsWithLowAttendance(@RequestParam Integer attendanceLimit) {
        return ResponseEntity.ok().body(studentService.getStudentsWithLowAttendance(attendanceLimit));
    }

    @GetMapping(value = "/login")
    public ResponseEntity<ApiResponse<StudentDTO>> login(@RequestParam String studentId, @RequestParam String password) {
        return ResponseEntity.ok().body(studentService.fetchStudent(studentId,password));
    }

    @GetMapping("/{page}")
    public ResponseEntity<List<StudentDTO>> getAllStudents(@PathVariable int page) {
        return ResponseEntity.ok().body(studentService.fetchStudents(page));
    }


    // APIs used by Admin and Student
    @PutMapping("/update")
    public ResponseEntity<Boolean> updateStudent(@RequestBody List<StudentDTO> studentDTOS) {
        return ResponseEntity.ok().body(studentService.updateStudent(studentDTOS));

    }


    //APIs used by Teacher
    @PostMapping("/increase-attendance")
    public ResponseEntity<Boolean> increaseAttendance(@RequestParam String studentId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.increaseAttendance(studentId));
    }



}

