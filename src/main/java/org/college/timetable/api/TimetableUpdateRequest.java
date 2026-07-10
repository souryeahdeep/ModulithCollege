package org.college.timetable.api;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record TimetableUpdateRequest(
        Long courseId,
        String teacherId,
        Long classroomId,
        Long departmentId,
        Integer sectionNo,
        Integer groupNo,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        int semester,
        String entryType,
        boolean locked
) {
}

