package org.college.attendance;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.college.timetable.internal.TimetableEntryType;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "attendance_session")
public class AttendanceSession {
    @Id
    private UUID attendanceId;
    private String courseCode;
    private String courseName;
    private String teacherName;
    private String classroomNo;
    private String branch;
    private Integer sectionNo;
    private Integer groupNo;
    private TimetableEntryType entryType;
    private DayOfWeek dayOfWeek;
    private LocalDateTime startTime;
    private LocalDateTime expiryTime;
}

