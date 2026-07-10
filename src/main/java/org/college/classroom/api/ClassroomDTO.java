package org.college.classroom.api;

import org.college.classroom.internal.Classroom;
import org.college.classroom.internal.RoomType;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public record ClassroomDTO(

        UUID id,

        String roomNumber,

        RoomType roomType,

        int capacity,

        boolean active) {
    public static ClassroomDTO from(Classroom classroom) {
        return new ClassroomDTO(classroom.getId()
        ,classroom.getRoomNumber(), classroom.getRoomType(),classroom.getCapacity(),classroom.isActive());
    }
}
