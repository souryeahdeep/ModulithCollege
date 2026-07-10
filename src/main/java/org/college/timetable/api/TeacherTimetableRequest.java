package org.college.timetable.api;

import java.time.DayOfWeek;
import java.util.UUID;

public record TeacherTimetableRequest(
        String teacherId,
        DayOfWeek dayOfWeek
) {}

