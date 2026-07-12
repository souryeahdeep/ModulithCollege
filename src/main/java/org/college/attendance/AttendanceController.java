package org.college.attendance;

import org.college.api.ApiResponse;
import org.college.timetable.api.TimetableEntryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService=attendanceService;
    }
    @PostMapping("/start")
    public ResponseEntity<byte[]> start( @RequestBody TimetableEntryResponse timetableEntryResponse) throws Exception {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG)
                .body(attendanceService.startAttendance(timetableEntryResponse));
    }
    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<String>> validateAttendance(@RequestBody StudentScanRequest studentScanRequest) throws Exception {
        return ResponseEntity.ok(attendanceService.scanAttendance(studentScanRequest));
    }
}
