package org.college.classroom.api;

import java.util.UUID;

public interface ClassroomManagement {

    ClassroomDTO findById(UUID classroomId);
}
