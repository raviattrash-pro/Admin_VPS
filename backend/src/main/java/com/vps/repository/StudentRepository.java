package com.vps.repository;

import com.vps.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    List<Student> findByClassForAdmission(String classForAdmission);
    List<Student> findByAcademicYear(String academicYear);
}
