package org.college.timetable.internal;

import jakarta.persistence.*;
import lombok.*;
import org.college.classroom.internal.Classroom;
import org.college.course.internal.Course;
import org.college.teacher.internal.Teacher;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(
        name = "timetable_entries",
        uniqueConstraints = {
                // Same classroom can't have two classes at the same time on the same day
                @UniqueConstraint(columnNames = {"classroom_id", "day_of_week", "start_time"}),
                // Same teacher can't teach two classes at the same time on the same day
                @UniqueConstraint(columnNames = {"teacher_id",  "day_of_week", "start_time"}),
                // Same section cannot have two classes at the same time on the same day
                @UniqueConstraint(columnNames = {"branch", "section_no", "group_no", "day_of_week", "start_time"})
        }
)
@Getter
@Setter
public class TimetableEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "teacher_id",
            referencedColumnName = "teacher_id"
    )
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    @Column(name = "branch")
    private String branch;

    @Column(name = "section_no")
    private Integer sectionNo;

    @Column(name = "group_no")
    private Integer groupNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false)
    private TimetableEntryType entryType;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

}