package org.college.library;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * One student's checkout of one book. studentId is stored as a plain
 * String (matching how student identifiers are used elsewhere in this
 * system) rather than a foreign key to a Student entity, since the
 * library service doesn't own student data.
 */
@Entity
@Table(name = "book_issues")
public class BookIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String studentId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueType issueType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    // Null while the book is still out.
    private LocalDate returnDate;

    protected BookIssue() {
        // JPA
    }

    public BookIssue(String studentId, Book book, IssueType issueType, LocalDate issueDate, LocalDate dueDate) {
        this.studentId = studentId;
        this.book = book;
        this.issueType = issueType;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.status = IssueStatus.ISSUED;
    }

    public UUID getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public Book getBook() {
        return book;
    }

    public IssueType getIssueType() {
        return issueType;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public void setStatus(IssueStatus status) {
        this.status = status;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void markReturned(LocalDate returnDate) {
        this.returnDate = returnDate;
        this.status = IssueStatus.RETURNED;
    }

    public boolean isActive() {
        return returnDate == null;
    }
}
