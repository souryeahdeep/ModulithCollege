package org.college.timetable.internal;

import org.college.api.ApiResponse;
import org.college.timetable.api.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService service) {
        this.timetableService = service;
    }
    /// Accessed by Admins
    @PostMapping
    public ResponseEntity<ApiResponse<TimetableEntryResponse>> create(@RequestBody CreateTimetableEntryRequest request) {
        return ResponseEntity.ok(timetableService.createEntry(request));
    }
    /// ACCESSED BY STUDENTS
    @PostMapping("/student")
    public ResponseEntity<ApiResponse<List<TimetableEntryResponse>>> getForStudent(@RequestBody StudentTimetableRequest request) {
        return ResponseEntity.ok(timetableService.getStudentTimetable(request));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<TimetableEntryResponse>>> getAll(){
        return ResponseEntity.ok(timetableService.getTimetable());
    }

    ///  ACCESSED BY TEACHER
    @PostMapping("/teacher")
    public ResponseEntity<ApiResponse<List<TimetableEntryResponse>>> getForTeacher(@RequestBody TeacherTimetableRequest request) {
        return ResponseEntity.ok(timetableService.getTeacherTimetable(request));
    }
}

