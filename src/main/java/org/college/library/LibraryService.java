package org.college.library;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class LibraryService {

    // How long a semester loan runs for. Adjust to match the actual academic
    // calendar, or replace with a lookup against a semester/term table if
    // the exact end date varies by term rather than being a fixed offset.
    private static final int SEMESTER_LOAN_MONTHS = 6;
    private static final int TWO_WEEK_LOAN_WEEKS = 2;

    private final BookRepository bookRepository;
    private final BookIssueRepository bookIssueRepository;

    public LibraryService(BookRepository bookRepository, BookIssueRepository bookIssueRepository) {
        this.bookRepository = bookRepository;
        this.bookIssueRepository = bookIssueRepository;
    }

    @Transactional
    public BookIssueResponse issueBook(IssueBookRequest request) {
        Book book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new ResourceNotFoundException("No book found with id " + request.bookId()));

        if (!book.hasAvailableCopy()) {
            throw new BookNotAvailableException("No available copies of \"" + book.getTitle() + "\" right now.");
        }

        boolean alreadyHasCopy = bookIssueRepository
                .existsByStudentIdAndBook_IdAndReturnDateIsNull(request.studentId(), request.bookId());
        if (alreadyHasCopy) {
            throw new BookAlreadyIssuedException(
                    "Student " + request.studentId() + " already has an active copy of \"" + book.getTitle() + "\".");
        }

        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = calculateDueDate(request.issueType(), issueDate);

        BookIssue issue = new BookIssue(request.studentId(), book, request.issueType(), issueDate, dueDate);
        book.setAvailableCopies(book.getAvailableCopies() - 1);

        bookRepository.save(book);
        BookIssue saved = bookIssueRepository.save(issue);

        return BookIssueResponse.from(saved);
    }

    @Transactional
    public BookIssueResponse returnBook(UUID issueId) {
        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("No book issue found with id " + issueId));

        if (!issue.isActive()) {
            // Already returned — treat as idempotent rather than erroring,
            // so a retried request doesn't fail.
            return BookIssueResponse.from(issue);
        }

        issue.markReturned(LocalDate.now());

        Book book = issue.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        BookIssue saved = bookIssueRepository.save(issue);
        return BookIssueResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<BookIssueResponse> getActiveIssuesForStudent(String studentId) {
        return bookIssueRepository.findByStudentIdAndReturnDateIsNull(studentId).stream()
                .map(BookIssueResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookIssueResponse> getIssueHistoryForStudent(String studentId) {
        return bookIssueRepository.findByStudentId(studentId).stream()
                .map(BookIssueResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookIssueResponse> getOverdueIssues() {
        return bookIssueRepository.findByReturnDateIsNullAndDueDateBefore(LocalDate.now()).stream()
                .map(BookIssueResponse::from)
                .toList();
    }

    // Flags currently-active issues past their due date as OVERDUE.
    // Intended to be called from a scheduled job (e.g. @Scheduled, once a
    // day) rather than on every read, so status is a persisted fact rather
    // than being recomputed on every query.
    @Transactional
    public void markOverdueIssues() {
        List<BookIssue> overdue = bookIssueRepository.findByReturnDateIsNullAndDueDateBefore(LocalDate.now());
        for (BookIssue issue : overdue) {
            issue.setStatus(IssueStatus.OVERDUE);
        }
        bookIssueRepository.saveAll(overdue);
    }

    LocalDate calculateDueDate(IssueType issueType, LocalDate issueDate) {
        return switch (issueType) {
            case SEMESTER -> issueDate.plusMonths(SEMESTER_LOAN_MONTHS);
            case TWO_WEEKS -> issueDate.plusWeeks(TWO_WEEK_LOAN_WEEKS);
        };
    }
}
