package org.college.attendance;

import org.college.timetable.api.TimetableEntryDTO;
import org.college.timetable.api.TimetableEntryResponse;
import org.college.timetable.internal.TimetableEntry;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AttendanceService {
    private final AttendanceSessionRepository attendanceSessionRepository;
    private final QrJwtUtil qrJwtUtil;
    private final QrCodeGenerator qrCodeGenerator;
    public AttendanceService(AttendanceSessionRepository attendanceSessionRepository, QrJwtUtil qrJwtUtil, QrCodeGenerator qrCodeGenerator) {
        this.attendanceSessionRepository = attendanceSessionRepository;
        this.qrJwtUtil = qrJwtUtil;
        this.qrCodeGenerator = qrCodeGenerator;
    }
    public byte[] startAttendance(TimetableEntryResponse timetableEntryDTO) throws Exception {
        UUID attendanceId = UUID.randomUUID();
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime expiry = start.plusMinutes(10);
        AttendanceSession session = new AttendanceSession();
        session.setAttendanceId(attendanceId);
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
        return qrCodeGenerator.generateQrCode(token);

    }
}
