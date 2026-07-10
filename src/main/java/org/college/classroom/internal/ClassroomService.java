package org.college.classroom.internal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ClassroomService {

    private final ClassroomRepository repository;

    public ClassroomService(ClassroomRepository repository) {
        this.repository = repository;
    }

    public Boolean create(List<Classroom> classrooms) {
        for (Classroom classroom : classrooms) {
            repository.save(classroom);
        }
        return true;
    }

    public Classroom update(UUID id, Classroom update) {
        return repository.findById(id).map(c -> {
            c.setRoomType(update.getRoomType());
            c.setCapacity(update.getCapacity());
            return repository.save(c);
        }).orElseThrow(() -> new IllegalArgumentException("Classroom not found: " + id));
    }

    public Classroom getById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Classroom not found: " + id));
    }

    public List<Classroom> list() {
        return repository.findAll();
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}

