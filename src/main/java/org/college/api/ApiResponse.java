package org.college.api;

public record ApiResponse<T>(

        boolean success,

        String message,

        T data

) {
}
