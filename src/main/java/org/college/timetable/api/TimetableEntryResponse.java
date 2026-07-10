package org.college.timetable.api;

import org.college.timetable.internal.TimetableEntryType;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public record TimetableEntryResponse(
        UUID id,
        String courseCode,
        String courseName,
        String teacherName,
        String classroomNo,
        String branch,
        Integer sectionNo,
        Integer groupNo,
        TimetableEntryType entryType,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime
) {}
