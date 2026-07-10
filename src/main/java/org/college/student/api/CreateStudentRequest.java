package org.college.student.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStudentRequest {

    private String studentName;

    private String studentId;

    private String password;

    private Integer group;

    private Integer section;

    private Integer semester;

    private String branch;

    private Long rollNo;

    private String registrationNo;

    private String presentAddress;

    private String city;

    private Integer pin;

    private String mobileNo;

    private String dateOfBirth;

    private String bloodGroup;
}
