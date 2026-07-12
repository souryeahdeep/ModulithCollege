package org.college.library;

import java.util.UUID;

public record IssueBookRequest(
        String studentId,
        UUID bookId,
        IssueType issueType
) {
}
