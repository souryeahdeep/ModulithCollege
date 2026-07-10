package org.college.student.internal;


import org.college.student.api.CreateStudentRequest;
import org.college.student.api.StudentDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class StudentMapperImpl implements StudentMapper {
    private final PasswordEncoder passwordEncoder;

    public StudentMapperImpl(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public StudentDTO studentToStudentDTO(Student student) {
        if (student == null) {
            return null;
        }

        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setId(student.getId());
        studentDTO.setStudentName(student.getStudentName());
        studentDTO.setPassword(student.getPassword());
        studentDTO.setStudentId(student.getStudentId());
        studentDTO.setGroup(student.getGroup());
        studentDTO.setSection(student.getSection());
        studentDTO.setTotalClass(student.getTotalClass());
        studentDTO.setPresent(student.getPresent());
        studentDTO.setBranch(student.getBranch());
        studentDTO.setSemester(student.getSemester());
        studentDTO.setRollNo(student.getRollNo());
        studentDTO.setRegistrationNo(student.getRegistrationNo());
        studentDTO.setPresentAddress(student.getPresentAddress());
        studentDTO.setCity(student.getCity());
        studentDTO.setPin(student.getPin());
        studentDTO.setMobileNo(student.getMobileNo());
        studentDTO.setDateOfBirth(student.getDateOfBirth());
        studentDTO.setBloodGroup(student.getBloodGroup());

        return studentDTO;
    }

    @Override
    public Student studentDTOToStudent(StudentDTO studentDTO) {
        if (studentDTO == null) {
            return null;
        }

        Student student = new Student();
        student.setStudentName(studentDTO.getStudentName());
        student.setStudentId(studentDTO.getStudentId());
        student.setGroup(studentDTO.getGroup());
        student.setSection(studentDTO.getSection());
        student.setTotalClass(studentDTO.getTotalClass());
        student.setPresent(studentDTO.getPresent());
        student.setBranch(studentDTO.getBranch());
        student.setSemester(studentDTO.getSemester());
        student.setRollNo(studentDTO.getRollNo());
        student.setRegistrationNo(studentDTO.getRegistrationNo());
        student.setPresentAddress(studentDTO.getPresentAddress());
        student.setCity(studentDTO.getCity());
        student.setPin(studentDTO.getPin());
        student.setMobileNo(studentDTO.getMobileNo());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setBloodGroup(studentDTO.getBloodGroup());

        return student;
    }

    @Override
    public Student createStudentRequestToStudent(CreateStudentRequest request) {
        Student student = new Student();
                student.setStudentName(request.getStudentName());
                student.setStudentId(request.getStudentId());
                student.setPassword(passwordEncoder.encode(request.getPassword()));
                student.setGroup(request.getGroup());
                student.setSection(request.getSection());
                student.setSemester(request.getSemester());
                student.setBranch(request.getBranch());
                student.setRollNo(request.getRollNo());
                student.setRegistrationNo(request.getRegistrationNo());
                student.setPresentAddress(request.getPresentAddress());
                student.setCity(request.getCity());
                student.setPin(request.getPin());
                student.setMobileNo(request.getMobileNo());
                student.setDateOfBirth(request.getDateOfBirth());
                student.setBloodGroup(request.getBloodGroup());
                student.setTotalClass(0);
                student.setPresent(0);
                return student;
    }
}
