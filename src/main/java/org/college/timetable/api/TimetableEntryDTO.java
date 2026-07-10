package org.college.timetable.api;

import org.college.timetable.internal.TimetableEntryType;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record TimetableEntryDTO(

        Long id,

        Long courseId,
        String courseName,

        String teacherId,
        String teacherName,

        Long classroomId,
        String classroomName,

        Long departmentId,

        Integer sectionNo,
        Integer groupNo,

        TimetableEntryType entryType,

        DayOfWeek dayOfWeek,

        LocalTime startTime,
        LocalTime endTime

) {}