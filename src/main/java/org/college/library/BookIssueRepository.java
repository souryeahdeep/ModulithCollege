package org.college.library;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface BookIssueRepository extends JpaRepository<BookIssue, UUID> {

    // All issues (active + returned) for a student.
    List<BookIssue> findByStudentId(String studentId);

    // Only the books a student currently has out.
    List<BookIssue> findByStudentIdAndReturnDateIsNull(String studentId);

    // Used to block issuing the same book to the same student twice
    // while they already have an active copy out.
    boolean existsByStudentIdAndBook_IdAndReturnDateIsNull(String studentId, UUID bookId);

    // Everything still out and past its due date — feeds a scheduled
    // overdue sweep, or an on-demand overdue report.
    List<BookIssue> findByReturnDateIsNullAndDueDateBefore(LocalDate date);
}
