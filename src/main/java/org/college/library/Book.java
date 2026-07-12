package org.college.library;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "books")
@Setter
@Getter
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Setter
    @Column(nullable = false)
    private String title;

    @Setter
    @Column(nullable = false)
    private String author;

    @Column(nullable = false, unique = true)
    private String isbn;

    @Column(nullable = false)
    private Integer totalCopies;

    // Decremented on issue, incremented on return. Kept on the entity
    // (rather than computed on the fly) so availability checks are a
    // single-row read instead of a count query over book_issues.
    @Column(nullable = false)
    private Integer availableCopies;

    protected Book() {
        // JPA
    }

    public Book(String title, String author, String isbn, Integer totalCopies) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
    }
}
