package org.college.admin.internal;

import org.college.admin.api.ChangePasswordRequest;
import org.college.admin.api.AdminDTO;
import org.college.admin.api.LoginRequest;
import org.college.api.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final AdminRepo adminRepo;
    private final AdminMapper adminMapper;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepo adminRepo,
                        AdminMapper adminMapper,
                        PasswordEncoder passwordEncoder) {
        this.adminRepo = adminRepo;
        this.adminMapper = adminMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiResponse<List<AdminDTO>> fetchAllAdmin() {

        log.info("Fetching all admins.");

        List<AdminDTO> adminsDTOs = adminRepo.findAll()
                .stream()
                .map(adminMapper::adminToAdminDTO)
                .toList();

        log.info("Successfully fetched {} admins.", adminsDTOs.size());

        return new ApiResponse<>(true,"Fetched all admins.", adminsDTOs);
    }

    public ApiResponse<AdminDTO> addAdmin(CreateAdminRequest request) {

        log.info("Creating admin with Admin ID: {}", request.adminId());

        try {

            Admin admin = adminMapper.createAdminRequestToAdmin(request);

            admin.setPassword(passwordEncoder.encode(admin.getPassword()));

            Admin saved = adminRepo.save(admin);

            log.info("Admin {} created successfully.", saved.getAdminId());

            return new ApiResponse<>(
                    true,
                    "Added Admin",
                    adminMapper.adminToAdminDTO(saved)
            );

        } catch (Exception ex) {

            log.error("Failed to create admin with ID {}", request.adminId(), ex);

            throw ex;
        }
    }

    public ApiResponse<String> changePassword(ChangePasswordRequest request) {

        log.info("Password change requested for Admin ID {}", request.adminId());

        Admin admin = adminRepo.findByNameAndAdminId(
                request.name(),
                request.adminId()
        );

        if (admin == null) {

            log.warn("Password change failed. Admin {} not found.",
                    request.adminId());

            return new ApiResponse<>(
                    false,
                    "ADMIN DOES NOT EXIST",
                    null
            );
        }

        if (!passwordEncoder.matches(request.oldPassword(), admin.getPassword())) {

            log.warn("Incorrect old password for Admin {}",
                    request.adminId());

            return new ApiResponse<>(
                    false,
                    "PASSWORD DOES NOT MATCH",
                    null
            );
        }

        admin.setPassword(passwordEncoder.encode(request.newPassword()));

        adminRepo.save(admin);

        log.info("Password changed successfully for Admin {}",
                request.adminId());

        return new ApiResponse<>(
                true,
                "Changed Password",
                null
        );
    }

    public ApiResponse<AdminDTO> login(LoginRequest request) {

        log.info("Login attempt for Admin ID {}", request.adminId());

        Admin admin = adminRepo.findByAdminId(request.adminId());

        if (admin == null) {

            log.warn("Login failed. Admin {} not found.",
                    request.adminId());

            return new ApiResponse<>(
                    false,
                    "Admin does not exist",
                    null
            );
        }

        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {

            log.warn("Invalid password for Admin {}",
                    request.adminId());

            return new ApiResponse<>(
                    false,
                    "Wrong Password",
                    null
            );
        }

        log.info("Admin {} logged in successfully.",
                request.adminId());

        return new ApiResponse<>(
                true,
                "Log in Successful",
                adminMapper.adminToAdminDTO(admin)
        );
    }
}