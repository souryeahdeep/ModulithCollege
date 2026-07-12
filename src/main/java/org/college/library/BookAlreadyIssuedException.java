package org.college.library;

public class BookAlreadyIssuedException extends RuntimeException {
    public BookAlreadyIssuedException(String message) {
        super(message);
    }
}
