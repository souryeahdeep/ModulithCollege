package org.college.admin.api;

public record ChangePasswordRequest(
        String name,
        String adminId,
        String oldPassword,
        String newPassword

) {}
