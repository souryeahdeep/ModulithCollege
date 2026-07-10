package org.college.teacher.internal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.college.api.ApiResponse;
import org.college.course.api.CourseDTO;
import org.college.teacher.api.CreateTeacherRequest;
import org.college.teacher.api.TeacherDTO;
import org.college.teacher.api.TeacherLoginDetails;
import org.college.teacher.api.TeacherMapper;
import org.college.timetable.api.TimetableEntryDTO;
import org.college.timetable.internal.TimetableEntryRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepo;
    private final TeacherMapper teacherMapper;
    private final PasswordEncoder passwordEncoder;
    private final TimetableEntryRepository timetableRepo;

    /*
     * Add Teacher
     */
    public ApiResponse<List<String>> addTeacher(List<CreateTeacherRequest> request) {
        List<String> alreadyCreatedTeacherIds = new ArrayList<>();
        for (CreateTeacherRequest request1 : request) {
            log.info("Attempting to create teacher with ID {}", request1.teacherId());
            if (teacherRepo.existsByTeacherId(request1.teacherId())) {
                alreadyCreatedTeacherIds.add(request1.teacherId());
                log.warn("Teacher {} already exists.", request1.teacherId());
            }
            try{
                teacherRepo.save(teacherMapper.toEntity(request1));
            }catch(Exception e){
                return new ApiResponse<>(false,"ERROR OCCURRED",null);
            }
            log.info("Teacher {} created successfully.", request1.teacherId());
        }
        return new ApiResponse<>(true,"SUCCESS",alreadyCreatedTeacherIds);
    }
    /*
     * Get Teachers
     */
    public ApiResponse<List<TeacherDTO>> getTeachers(int page) {

        log.info("Fetching teachers. Page={}", page);

        PageRequest pageable = PageRequest.of(page - 1, 5);

        List<TeacherDTO> teachers = teacherRepo.findAll(pageable)
                .stream()
                .map(teacherMapper::toDTO)
                .toList();

        log.info("Fetched {} teachers.", teachers.size());

        return new ApiResponse<>(true, "Fetched All Teachers", teachers);
    }
    /*
     * Delete Teacher
     */
    public boolean removeTeacher(String teacherId) {

        log.info("Removing teacher {}", teacherId);

        Teacher teacher =
                teacherRepo.findTeacherByTeacherId(teacherId);

        if (teacher == null) {

            log.warn("Teacher {} not found.", teacherId);

            return false;
        }

        teacherRepo.deleteByTeacherId(teacherId);

        log.info("Teacher {} removed successfully.", teacherId);

        return true;
    }
    /*
     * Change Password
     */
    public boolean changePassword(
            String teacherId,
            String oldPassword,
            String newPassword
    ) {

        log.info("Password change requested for {}", teacherId);

        Teacher teacher =
                teacherRepo.findTeacherByTeacherId(teacherId);

        if (teacher == null) {

            log.warn("Teacher {} not found.", teacherId);

            return false;
        }

        if (!passwordEncoder.matches(oldPassword, teacher.getPassword())) {

            log.warn("Incorrect old password for {}", teacherId);

            return false;
        }

        teacher.setPassword(passwordEncoder.encode(newPassword));

        teacherRepo.save(teacher);

        log.info("Password changed successfully for {}", teacherId);

        return true;
    }
    /*
     * Login Check
     */
    public boolean exists(TeacherLoginDetails loginDetails) {

        log.info("Authenticating teacher {}", loginDetails.getTeacherId());

        Teacher teacher =
                teacherRepo.findTeacherByTeacherId(
                        loginDetails.getTeacherId());

        if (teacher == null) {

            log.warn("Teacher {} not found.",
                    loginDetails.getTeacherId());

            return false;
        }

        boolean authenticated =
                passwordEncoder.matches(
                        loginDetails.getPassword(),
                        teacher.getPassword());

        if (authenticated) {

            log.info("Authentication successful for {}",
                    loginDetails.getTeacherId());

        } else {

            log.warn("Authentication failed for {}",
                    loginDetails.getTeacherId());
        }

        return authenticated;
    }
    public void updateTeacher(TeacherDTO teacherDTO) {

        log.info("Updating teacher {}",
                teacherDTO.teacherId());

        // update logic

        log.info("Teacher {} updated successfully.",
                teacherDTO.teacherId());
    }

    public TeacherDTO login(String teacherId, String password) {

        log.info("Login attempt for teacher {}", teacherId);

        Teacher teacher =
                teacherRepo.findTeacherByTeacherId(teacherId);

        if (teacher == null) {

            log.warn("Teacher {} not found.", teacherId);

            return null;
        }

        if (!passwordEncoder.matches(password, teacher.getPassword())) {

            log.warn("Invalid password for {}", teacherId);

            return null;
        }

        log.info("Teacher {} logged in successfully.", teacherId);

        return teacherMapper.toDTO(teacher);
    }
}