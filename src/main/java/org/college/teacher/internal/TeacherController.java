package org.college.teacher.internal;

import org.college.api.ApiResponse;
import org.college.teacher.api.CreateTeacherRequest;
import org.college.teacher.api.TeacherDTO;
import org.college.timetable.api.TimetableEntryDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private static final Logger log =
            LoggerFactory.getLogger(TeacherController.class);

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/{page}")
    public ResponseEntity<ApiResponse<List<TeacherDTO>>> getAllTeachers(
            @PathVariable int page) {

        log.info("Received request to fetch teachers. Page={}", page);

        ApiResponse<List<TeacherDTO>> response =
                teacherService.getTeachers(page);

        log.info("Successfully fetched {} teachers.",
                response.data() != null ? response.data().size() : 0);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<List<String>>> addTeacher(
            @RequestBody List<CreateTeacherRequest> requests) {
        return ResponseEntity.ok(teacherService.addTeacher(requests));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateTeacher(
            @RequestBody TeacherDTO teacherDTO) {

        log.info("Received update request for Teacher ID={}",
                teacherDTO.teacherId());

        try {

            teacherService.updateTeacher(teacherDTO);

            log.info("Teacher {} updated successfully.",
                    teacherDTO.teacherId());

            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("Modified");

        } catch (Exception ex) {

            log.error("Failed to update Teacher {}",
                    teacherDTO.teacherId(), ex);

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Cannot update");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> removeTeacher(
            @RequestParam String teacherId) {

        log.info("Received delete request for Teacher ID={}", teacherId);

        try {

            if (teacherService.removeTeacher(teacherId)) {

                log.info("Teacher {} deleted successfully.", teacherId);

                return ResponseEntity.status(HttpStatus.ACCEPTED)
                        .body("Removed Successfully");
            }

            log.warn("Teacher {} not found.", teacherId);

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Can't Remove Successfully");

        } catch (Exception ex) {

            log.error("Error while deleting Teacher {}",
                    teacherId, ex);

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Unable to remove Teacher");
        }
    }

    @GetMapping("/login")
    public ResponseEntity<TeacherDTO> login(
            @RequestParam String teacherId,
            @RequestParam String password) {

        log.info("Login attempt for Teacher ID={}", teacherId);

        TeacherDTO teacher = teacherService.login(teacherId, password);

        log.info("Login completed for Teacher ID={}", teacherId);

        return ResponseEntity.ok(teacher);
    }

}