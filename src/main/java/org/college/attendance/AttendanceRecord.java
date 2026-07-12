package org.college.attendance;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "attendance_record",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"attendanceId", "studentId"})
        }
)
@Getter
@Setter
public class AttendanceRecord {
        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        private UUID attendanceId;
        private String studentId;

        private Double latitude;
        private Double longitude;

        private LocalDateTime scannedAt;


}
