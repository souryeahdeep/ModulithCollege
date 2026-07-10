package org.college.student.api;

import lombok.*;

import java.util.UUID;


@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDTO {
    private String studentName;
    private UUID id;
    @EqualsAndHashCode.Include
    private String studentId;
    private String password;
    private Integer group;
    private Integer section;
    private Integer totalClass;
    private Integer present;
    private String branch;
    private Integer semester;
    @EqualsAndHashCode.Include
    private Long rollNo;
    @EqualsAndHashCode.Include
    private String registrationNo;
    private String presentAddress;
    private String city;
    private Integer pin;
    private String mobileNo;
    private String dateOfBirth;
    private String bloodGroup;

}
