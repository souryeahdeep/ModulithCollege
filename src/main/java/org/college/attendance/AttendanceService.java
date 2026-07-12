package org.college.attendance;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.college.api.ApiResponse;
import org.college.student.api.StudentManagement;
import org.college.student.internal.StudentRepository;
import org.college.timetable.api.TimetableEntryResponse;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AttendanceService {
    private final AttendanceSessionRepository attendanceSessionRepository;
    private final QrJwtUtil qrJwtUtil;
    private final QrCodeGenerator qrCodeGenerator;
    private final AttendanceRecordRepo attendanceRecordRepo;
    private final StudentRepository studentRepository;
    private final StudentManagement studentManagement;
    public AttendanceService(AttendanceSessionRepository attendanceSessionRepository, QrJwtUtil qrJwtUtil, QrCodeGenerator qrCodeGenerator, AttendanceRecordRepo attendanceRecordRepo, StudentRepository studentRepository, StudentManagement studentManagement) {
        this.attendanceSessionRepository = attendanceSessionRepository;
        this.qrJwtUtil = qrJwtUtil;
        this.qrCodeGenerator = qrCodeGenerator;
        this.attendanceRecordRepo = attendanceRecordRepo;
        this.studentRepository = studentRepository;
        this.studentManagement = studentManagement;
    }



    public byte[] startAttendance(TimetableEntryResponse timetableEntryDTO) throws Exception {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime expiry = start.plusMinutes(10);
        AttendanceSession session = new AttendanceSession();
        session.setStartTime(start);
        session.setExpiryTime(expiry);
        session.setClassroomNo(timetableEntryDTO.classroomNo());
        session.setBranch(timetableEntryDTO.branch());
        session.setCourseCode(timetableEntryDTO.courseCode());
        session.setCourseName(timetableEntryDTO.courseName());
        session.setDayOfWeek(timetableEntryDTO.dayOfWeek());
        session.setGroupNo(timetableEntryDTO.groupNo());
        session.setSectionNo(timetableEntryDTO.sectionNo());
        session.setTeacherName(timetableEntryDTO.teacherName());
        attendanceSessionRepository.save(session);
        String token=qrJwtUtil.generateQrToken(session);
        System.out.println("token:"+token);
        return qrCodeGenerator.generateQrCode(token);

    }

    public ApiResponse<String> scanAttendance(
            StudentScanRequest request)                 {
        System.out.println(request);

        Claims claims = qrJwtUtil.validate(request.qrToken());

        AttendanceSession session = attendanceSessionRepository.findById(UUID.fromString(claims.get("attendanceId").toString()))
                .orElseThrow(() -> new RuntimeException("Invalid attendance session"));

        if (LocalDateTime.now().isAfter(session.getExpiryTime())) {
            log.info("Attendance session has expired");
            return new ApiResponse<>(true,"Attendance session has expired",null);
        }
        log.info("Attendance session has been found");
        if (attendanceRecordRepo.existsByAttendanceIdAndStudentId(UUID.fromString(claims.get("attendanceId").toString()), request.studentId())) {
            log.info("Attendance has already been scan");
            return new ApiResponse<>(true,"Attendance already been scanned",null);
        }
        log.info("Attendance session has been scan");
        if (!studentRepository.existsByStudentId(request.studentId())) {
            log.info("Student not found");
            return new ApiResponse<>(false,"Student not found",null);
        }
        log.info("Student is found");
        AttendanceRecord record = new AttendanceRecord();
        record.setAttendanceId(UUID.fromString(claims.get("attendanceId").toString()));
        record.setStudentId(request.studentId());
        record.setLatitude(request.latitude());
        record.setLongitude(request.longitude());
        record.setScannedAt(LocalDateTime.now());

        attendanceRecordRepo.save(record);
        return studentManagement.increaseAttendance(request.studentId());
    }
}
