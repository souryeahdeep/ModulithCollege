package org.college.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AttendanceRecordRepo
            extends JpaRepository<AttendanceRecord, UUID> {

        boolean existsByAttendanceIdAndStudentId(
                UUID attendanceId,
                String studentId
        );
    }


