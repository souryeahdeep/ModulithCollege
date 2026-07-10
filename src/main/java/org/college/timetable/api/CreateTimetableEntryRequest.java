package org.college.timetable.api;

import org.college.timetable.internal.TimetableEntryType;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record CreateTimetableEntryRequest(
        String courseCode,
        String teacherId,
        String roomNumber,
        String branch,
        Integer sectionNo,
        Integer groupNo,
        TimetableEntryType entryType,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime
) {}
