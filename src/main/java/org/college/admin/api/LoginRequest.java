package org.college.admin.api;

public record LoginRequest(
        String name,
        String adminId,
        String password

) {
}
