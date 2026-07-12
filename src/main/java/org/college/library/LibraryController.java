package org.college.library;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    // POST /api/library/issue
    // Body: { "studentId": "...", "bookId": "...", "issueType": "SEMESTER" | "TWO_WEEKS" }
    @PostMapping("/issue")
    public ResponseEntity<BookIssueResponse> issueBook(@RequestBody IssueBookRequest request) {
        BookIssueResponse response = libraryService.issueBook(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/library/return/{issueId}
    @PostMapping("/return/{issueId}")
    public ResponseEntity<BookIssueResponse> returnBook(@PathVariable UUID issueId) {
        return ResponseEntity.ok(libraryService.returnBook(issueId));
    }

    // GET /api/library/student/{studentId}/active
    @GetMapping("/student/{studentId}/active")
    public ResponseEntity<List<BookIssueResponse>> getActiveIssues(@PathVariable String studentId) {
        return ResponseEntity.ok(libraryService.getActiveIssuesForStudent(studentId));
    }

    // GET /api/library/student/{studentId}/history
    @GetMapping("/student/{studentId}/history")
    public ResponseEntity<List<BookIssueResponse>> getIssueHistory(@PathVariable String studentId) {
        return ResponseEntity.ok(libraryService.getIssueHistoryForStudent(studentId));
    }

    // GET /api/library/overdue
    @GetMapping("/overdue")
    public ResponseEntity<List<BookIssueResponse>> getOverdueIssues() {
        return ResponseEntity.ok(libraryService.getOverdueIssues());
    }
}
