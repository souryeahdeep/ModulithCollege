package org.college.admin.internal;

import lombok.Getter;
import lombok.Setter;

public record CreateAdminRequest(
        String name,
        String adminId,
        String password
) {
}
