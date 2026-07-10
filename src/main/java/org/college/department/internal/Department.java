package org.college.department.internal;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "department")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;// Computer Science and engineering

    private String code;// CSE

    private String description;

}

