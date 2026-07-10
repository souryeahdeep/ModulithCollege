package org.college.admin.internal;

import org.college.admin.api.AdminDTO;
import org.college.admin.api.ChangePasswordRequest;
import org.college.admin.api.LoginRequest;
import org.college.api.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/admin")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminDTO>> adminLogin(
            @RequestBody LoginRequest loginRequest) {

        log.info("Received login request for Admin ID: {}",
                loginRequest.adminId());

        ApiResponse<AdminDTO> response = adminService.login(loginRequest);

        log.info("Completed login request for Admin ID: {}. Success={}",
                loginRequest.adminId(),
                response.success());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<AdminDTO>>> getAllAdmin() {

        log.info("Received request to fetch all admins.");

        ApiResponse<List<AdminDTO>> response = adminService.fetchAllAdmin();

        log.info("Returning {} admin records.",
                response.data() != null ? response.data().size() : 0);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<AdminDTO>> addAdmin(
            @RequestBody CreateAdminRequest request) {

        log.info("Received request to create Admin {}",
                request.adminId());

        ApiResponse<AdminDTO> response = adminService.addAdmin(request);

        log.info("Finished create admin request. Success={}",
                response.success());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestBody ChangePasswordRequest request) {

        log.info("Received password change request for Admin ID: {}",
                request.adminId());

        ApiResponse<String> response = adminService.changePassword(request);

        log.info("Password change completed for Admin ID: {}. Success={}",
                request.adminId(),
                response.success());

        return ResponseEntity.ok(response);
    }
}