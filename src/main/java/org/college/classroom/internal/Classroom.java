package org.college.classroom.internal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "classroom",
        uniqueConstraints = @UniqueConstraint(columnNames = {"building", "room_number"})
)
@Getter @Setter
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;      // "101", "LH-3", etc.

    @Column(name = "building")
    private String building;        // optional, nullable if single-building campus

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType roomType;      // LECTURE_HALL, LAB, SEMINAR

    @Column(nullable = false)
    private int capacity;

    @Column(name = "active", nullable = false)
    private boolean active = true;  // false = under maintenance / decommissioned
    // NOT used for slot-level availability

    // getters & setters
}