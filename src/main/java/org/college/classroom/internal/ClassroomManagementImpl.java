package org.college.classroom.internal;

import lombok.RequiredArgsConstructor;
import org.college.classroom.api.ClassroomDTO;
import org.college.classroom.api.ClassroomManagement;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassroomManagementImpl implements ClassroomManagement {
   private final ClassroomRepository classroomRepository;
    @Override
    public ClassroomDTO findById(UUID classroomId) {
        Classroom classroom =
                classroomRepository.findById(classroomId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Classroom not found"
                                ));
        return ClassroomDTO.from(classroom);
    }
}
