package org.college.library;

/**
 * How long a book is checked out for. The due date is derived from this
 * at issue time — see LibraryService#calculateDueDate.
 */
public enum IssueType {
    SEMESTER,
    TWO_WEEKS
}
