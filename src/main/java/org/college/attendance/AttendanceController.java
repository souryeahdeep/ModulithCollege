package org.college.attendance;

import org.college.teacher.internal.TeacherService;
import org.college.timetable.api.TimetableEntryResponse;
import org.college.timetable.internal.TimetableEntry;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService=attendanceService;
    }
    public ResponseEntity<byte[]> start(TimetableEntryResponse timetableEntryResponse) throws Exception {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG)
                .body(attendanceService.startAttendance(timetableEntryResponse));
    }
}
