package org.college.course.api;

public record CreateCourseRequest(

        String code,
        String name,
        Integer credits,
        Integer semester,
        String branch

) {}
