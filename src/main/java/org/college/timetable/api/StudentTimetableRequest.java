package org.college.timetable.api;

import java.util.UUID;

public record StudentTimetableRequest(
        Integer semester,
        String branch,
        Integer sectionNo
) {}
