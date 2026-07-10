package org.college.timetable.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, UUID> {

    // ---- Conflict checks (used before creating an entry) ----

    @Query("""
        SELECT COUNT(t) > 0 FROM TimetableEntry t
        WHERE t.classroom.roomNumber = :roomNumber
        AND t.dayOfWeek = :dayOfWeek
        AND t.startTime < :endTime
        AND t.endTime > :startTime
    """)
    boolean existsClassroomConflict(@Param("roomNumber") String roomNumber,
                                    @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                    @Param("startTime") LocalTime startTime,
                                    @Param("endTime") LocalTime endTime);

    @Query("""
        SELECT COUNT(t) > 0 FROM TimetableEntry t
        WHERE t.teacher.teacherId = :teacherId
        AND t.dayOfWeek = :dayOfWeek
        AND t.startTime < :endTime
        AND t.endTime > :startTime
    """)
    boolean existsTeacherConflict(@Param("teacherId") String teacherId,
                                  @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                  @Param("startTime") LocalTime startTime,
                                  @Param("endTime") LocalTime endTime);

    // ---- Listing for students ----

    @Query("""
        SELECT t FROM TimetableEntry t
        WHERE t.course.semester = :semester
        AND t.branch = :branch
        AND t.sectionNo = :sectionNo
        ORDER BY t.dayOfWeek, t.startTime
    """)
    List<TimetableEntry> findForStudent(@Param("semester") Integer semester,
                                        @Param("branch") String branch,
                                        @Param("sectionNo") Integer sectionNo);

    // ---- Listing for teachers ----
    // NOTE: teacherId is the teacher's business identifier (String), matching
    // the type used in existsTeacherConflict above — not the entity's UUID
    // primary key. Both query methods must agree on this type or Spring Data
    // will fail to bind the parameter at runtime.

    List<TimetableEntry> findByTeacher_TeacherIdAndDayOfWeekOrderByStartTime(
            String teacherId, DayOfWeek dayOfWeek);

    @Query("""
    SELECT t FROM TimetableEntry t
    WHERE t.branch = :branch
    AND t.sectionNo = :sectionNo
    AND t.dayOfWeek = :dayOfWeek
    AND t.startTime < :endTime
    AND t.endTime > :startTime
    AND (t.groupNo IS NULL OR :groupNo IS NULL OR t.groupNo = :groupNo)
""")
    List<TimetableEntry> findSectionConflicts(@Param("branch") String branch,
                                              @Param("sectionNo") Integer sectionNo,
                                              @Param("groupNo") Integer groupNo,
                                              @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                              @Param("startTime") LocalTime startTime,
                                              @Param("endTime") LocalTime endTime);
}