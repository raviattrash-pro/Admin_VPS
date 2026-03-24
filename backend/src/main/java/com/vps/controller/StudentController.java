package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.dto.StudentRequest;
import com.vps.entity.Student;
import com.vps.entity.User;
import com.vps.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // Admin: Create new student (admission)
    @PostMapping("/admin/students")
    public ResponseEntity<?> createStudent(
            @ModelAttribute StudentRequest request,
            @RequestParam(value = "birthCertificate", required = false) MultipartFile birthCert,
            @RequestParam(value = "transferCertificate", required = false) MultipartFile transferCert,
            @RequestParam(value = "reportCard", required = false) MultipartFile reportCard,
            @RequestParam(value = "photograph", required = false) MultipartFile photograph,
            @RequestParam(value = "proofOfResidence", required = false) MultipartFile proofOfResidence) {
        try {
            Map<String, Object> result = studentService.createStudent(request, birthCert, transferCert,
                    reportCard, photograph, proofOfResidence);
            return ResponseEntity.ok(ApiResponse.success("Student admitted successfully. Username: "
                    + result.get("username") + ", Default Password: 123456", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin: Get all students
    @GetMapping("/admin/students")
    public ResponseEntity<?> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students fetched", students));
    }

    // Admin: Get student by ID
    @GetMapping("/admin/students/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        try {
            Student student = studentService.getStudentById(id);
            return ResponseEntity.ok(ApiResponse.success("Student fetched", student));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin: Update student
    @PutMapping("/admin/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentRequest request) {
        try {
            Student student = studentService.updateStudent(id, request);
            return ResponseEntity.ok(ApiResponse.success("Student updated", student));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin: Delete student
    @DeleteMapping("/admin/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok(ApiResponse.success("Student deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Student: Get own profile
    @GetMapping("/students/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal User user) {
        try {
            Student student = studentService.getStudentByUserId(user.getId());
            return ResponseEntity.ok(ApiResponse.success("Profile fetched", student));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
