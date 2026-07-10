package org.college.admin.internal;

import org.college.admin.api.AdminDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {

    public Admin adminDTOToAdmin(AdminDTO adminDTO) {
        Admin admin = new Admin();
        admin.setId(adminDTO.getId());
        admin.setName(adminDTO.getName());
        return admin;
    }
    public AdminDTO adminToAdminDTO(Admin admin) {
        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setName(admin.getName());
        adminDTO.setAdminId(admin.getAdminId());
        return adminDTO;
    }

    public Admin createAdminRequestToAdmin(CreateAdminRequest createAdminRequest) {
        Admin admin = new Admin();
        admin.setName(createAdminRequest.name());
        admin.setPassword(createAdminRequest.password());
        admin.setAdminId(createAdminRequest.adminId());
        return admin;

    }
}
