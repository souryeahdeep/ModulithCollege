package org.college.timetable.internal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.college.api.ApiResponse;
import org.college.classroom.internal.Classroom;
import org.college.classroom.internal.ClassroomRepository;
import org.college.course.internal.Course;
import org.college.course.internal.CourseRepository;
import org.college.teacher.internal.Teacher;
import org.college.teacher.internal.TeacherRepository;
import org.college.timetable.api.*;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimetableService {

    private final TimetableEntryRepository timetableEntryRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;

    @Transactional
    public ApiResponse<TimetableEntryResponse> createEntry(CreateTimetableEntryRequest request) {
        log.debug("Creating timetable entry: {}", request);

        if (!request.startTime().isBefore(request.endTime())) {
            return new ApiResponse<>(false, "startTime must be before endTime", null);
        }

        // Resolve referenced entities first so a bad/typo'd id gives a clean
        // "not found" response instead of a NullPointerException later.
        Course course = courseRepository.findByCode(request.courseCode());
        if (course == null) {
            return new ApiResponse<>(false, "Course not found: " + request.courseCode(), null);
        }

        Teacher teacher = teacherRepository.findTeacherByTeacherId(request.teacherId());
        if (teacher == null) {
            return new ApiResponse<>(false, "Teacher not found: " + request.teacherId(), null);
        }

        Classroom classroom = classroomRepository.findByRoomNumber(request.roomNumber());
        if (classroom == null) {
            return new ApiResponse<>(false, "Classroom not found: " + request.roomNumber(), null);
        }
        if (!classroom.isActive()) {
            return new ApiResponse<>(false, "Classroom is not active: " + request.roomNumber(), null);
        }

        if (!isClassroomAvailable(request.roomNumber(), request.dayOfWeek(), request.startTime(), request.endTime())) {
            return new ApiResponse<>(false, "Classroom already booked in this slot", null);
        }

        boolean teacherBusy = timetableEntryRepository.existsTeacherConflict(
                request.teacherId(), request.dayOfWeek(),
                request.startTime(), request.endTime());

        if (teacherBusy) {
            return new ApiResponse<>(false, "Teacher is already booked in this slot", null);
        }
        // section/group conflict check
        List<TimetableEntry> sectionConflicts = timetableEntryRepository.findSectionConflicts(
                request.branch(), request.sectionNo(), request.groupNo(),
                request.dayOfWeek(), request.startTime(), request.endTime());

        if (!sectionConflicts.isEmpty()) {
            TimetableEntry clash = sectionConflicts.getFirst();
            String groupLabel = request.groupNo() != null ? "Group " + request.groupNo() + " of " : "";
            String message = String.format(
                    "%sSection %d (%s) already has %s scheduled %s–%s on %s",
                    groupLabel, request.sectionNo(), request.branch(),
                    clash.getCourse().getName(), clash.getStartTime(), clash.getEndTime(), clash.getDayOfWeek());
            return new ApiResponse<>(false, message, null);
        }

        TimetableEntry entry = new TimetableEntry();
        entry.setCourse(course);
        entry.setTeacher(teacher);
        entry.setClassroom(classroom);
        entry.setBranch(request.branch());
        entry.setSectionNo(request.sectionNo());
        entry.setGroupNo(request.groupNo());
        entry.setEntryType(request.entryType());
        entry.setDayOfWeek(request.dayOfWeek());
        entry.setStartTime(request.startTime());
        entry.setEndTime(request.endTime());

        TimetableEntry saved = timetableEntryRepository.save(entry);
        return new ApiResponse<>(true, "Entry Saved in Timetable", toResponse(saved));
    }

    public ApiResponse<List<TimetableEntryResponse>> getStudentTimetable(StudentTimetableRequest request) {
        return new ApiResponse<>(true, "Found the Time Table", timetableEntryRepository
                .findForStudent(request.semester(), request.branch(), request.sectionNo())
                .stream()
                .map(this::toResponse)
                .toList());
    }

    public boolean isClassroomAvailable(String roomNumber, DayOfWeek day, LocalTime start, LocalTime end) {
        Classroom room = classroomRepository.findByRoomNumber(roomNumber);
        if (room == null || !room.isActive()) {
            return false; // not found, or under maintenance — never bookable
        }

        return !timetableEntryRepository.existsClassroomConflict(roomNumber, day, start, end);
    }

    public ApiResponse<List<TimetableEntryResponse>> getTeacherTimetable(TeacherTimetableRequest request) {
        return new ApiResponse<>(true, "Found the Timetable", timetableEntryRepository
                .findByTeacher_TeacherIdAndDayOfWeekOrderByStartTime(
                        request.teacherId(), request.dayOfWeek())
                .stream()
                .map(this::toResponse)
                .toList());
    }

    private TimetableEntryResponse toResponse(TimetableEntry e) {
        return new TimetableEntryResponse(
                e.getId(),
                e.getCourse().getCode(),
                e.getCourse().getName(),
                e.getTeacher().getTeacherName(),
                e.getClassroom().getRoomNumber(),
                e.getBranch(),
                e.getSectionNo(),
                e.getGroupNo(),
                e.getEntryType(),
                e.getDayOfWeek(),
                e.getStartTime(),
                e.getEndTime()
        );
    }

    public ApiResponse<List<TimetableEntryResponse>> getTimetable() {
        return new ApiResponse<>(true,"ALL TIMETABLE",timetableEntryRepository.findAll().stream().map(this::toResponse).toList());

    }
}