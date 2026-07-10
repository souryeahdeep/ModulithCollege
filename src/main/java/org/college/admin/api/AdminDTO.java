package org.college.admin.api;


import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class AdminDTO {
    @EqualsAndHashCode.Include
    private UUID id;
    private String adminId;
    private String name;
    private String password;
}
