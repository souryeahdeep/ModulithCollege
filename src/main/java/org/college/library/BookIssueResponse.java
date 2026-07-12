package org.college.library;

import java.time.LocalDate;
import java.util.UUID;

public record BookIssueResponse(
        UUID id,
        String studentId,
        UUID bookId,
        String bookTitle,
        String isbn,
        IssueType issueType,
        IssueStatus status,
        LocalDate issueDate,
        LocalDate dueDate,
        LocalDate returnDate
) {
    public static BookIssueResponse from(BookIssue issue) {
        return new BookIssueResponse(
                issue.getId(),
                issue.getStudentId(),
                issue.getBook().getId(),
                issue.getBook().getTitle(),
                issue.getBook().getIsbn(),
                issue.getIssueType(),
                issue.getStatus(),
                issue.getIssueDate(),
                issue.getDueDate(),
                issue.getReturnDate()
        );
    }
}
