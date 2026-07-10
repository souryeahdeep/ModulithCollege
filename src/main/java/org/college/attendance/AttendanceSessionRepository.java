package org.college.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, UUID> {
}
