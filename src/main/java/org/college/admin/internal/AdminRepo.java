package org.college.admin.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AdminRepo extends JpaRepository<Admin, UUID> {
    Admin findByNameAndPassword(String name, String password);

    Admin findByName(String name);

    Admin findByNameAndAdminId(String name, String s);

    Admin findByAdminId(String adminId);
}
