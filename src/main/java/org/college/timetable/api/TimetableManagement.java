package org.college.timetable.api;

import org.college.api.ApiResponse;

import java.util.List;

public interface TimetableManagement {
    ApiResponse<TimetableEntryDTO> createEntry(CreateTimetableEntryRequest request);


    ApiResponse<TimetableEntryDTO> update(Long id, TimetableUpdateRequest request);

    ApiResponse<TimetableEntryDTO> publish(Long id);

    ApiResponse<TimetableEntryDTO> unpublish(Long id);

    ApiResponse<List<TimetableEntryDTO>> list();

    ApiResponse<TimetableEntryDTO> getById(Long id);

    ApiResponse<List<TimetableEntryDTO>> getByTeacher(String teacherId);

    ApiResponse<List<TimetableEntryDTO>> getByStudent(Long departmentId, int semester, Integer sectionNo);

    ApiResponse<List<TimetableEntryDTO>> getByClassroom(Long classroomId);


    void delete(Long id);
}

