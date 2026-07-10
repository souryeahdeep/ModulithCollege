package org.college.timetable.internal;

public class SlotConflictException extends RuntimeException {
    public SlotConflictException(String message) {
        super(message);
    }
}
