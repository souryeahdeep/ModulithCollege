package org.college.admin.internal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Table(name = "admins")
@Getter
@Setter
@ToString
@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    public UUID id;

    @Column(name="admin_id")
    private String adminId;

    @Column(name="name",nullable = false)
    public String name;

    @Column(name = "password",nullable = false)
    public String password;
}
