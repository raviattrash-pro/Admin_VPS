package com.vps.service;

import com.vps.dto.StudentRequest;
import com.vps.entity.Student;
import com.vps.entity.User;
import com.vps.repository.StudentRepository;
import com.vps.repository.UserRepository;
import com.vps.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageUtil fileStorageUtil;

    private static final DateTimeFormatter DOB_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Transactional
    public Map<String, Object> createStudent(StudentRequest req,
                                              MultipartFile birthCert,
                                              MultipartFile transferCert,
                                              MultipartFile reportCard,
                                              MultipartFile photograph,
                                              MultipartFile proofOfResidence) throws IOException {
        // Auto-generate unique student ID: VPS-YYYYMMDD-XXXX
        String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = studentRepository.count() + 1;
        String studentId = String.format("VPS-%s-%04d", dateStr, count);

        // Use Aadhaar / Samagra ID as username for login
        String username = req.getAadhaarOrSamagraId();
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Aadhaar / Samagra ID is required to be used as username");
        }

        // Ensure uniqueness
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("A student with this Aadhaar / Samagra ID already exists");
        }

        // Create user account with default password 123456
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode("123456"))
                .fullName(req.getFullName())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        // Create student profile
        Student student = Student.builder()
                .studentId(studentId)
                .fullName(req.getFullName())
                .dateOfBirth(req.getDateOfBirth() != null && !req.getDateOfBirth().isEmpty()
                        ? LocalDate.parse(req.getDateOfBirth(), DOB_FORMAT) : null)
                .gender(req.getGender())
                .nationality(req.getNationality())
                .motherTongue(req.getMotherTongue())
                .category(req.getCategory())
                .bloodGroup(req.getBloodGroup())
                .aadhaarOrSamagraId(req.getAadhaarOrSamagraId())
                .parentName(req.getParentName())
                .parentOccupation(req.getParentOccupation())
                .parentAddress(req.getParentAddress())
                .parentMobile(req.getParentMobile())
                .parentEmail(req.getParentEmail())
                .lastSchoolAttended(req.getLastSchoolAttended())
                .board(req.getBoard())
                .previousGrade(req.getPreviousGrade())
                .marksObtained(req.getMarksObtained())
                .classForAdmission(req.getClassForAdmission())
                .academicYear(req.getAcademicYear())
                .admissionType(req.getAdmissionType())
                .knownAllergies(req.getKnownAllergies())
                .medicalConditions(req.getMedicalConditions())
                .emergencyContact(req.getEmergencyContact())
                .siblingsInSchool(req.getSiblingsInSchool())
                .transportRequired(req.getTransportRequired())
                .languagePreferences(req.getLanguagePreferences())
                .user(user)
                .build();

        // Handle file uploads
        if (birthCert != null && !birthCert.isEmpty()) {
            student.setBirthCertificatePath(fileStorageUtil.storeFile(birthCert, "documents"));
        }
        if (transferCert != null && !transferCert.isEmpty()) {
            student.setTransferCertificatePath(fileStorageUtil.storeFile(transferCert, "documents"));
        }
        if (reportCard != null && !reportCard.isEmpty()) {
            student.setReportCardPath(fileStorageUtil.storeFile(reportCard, "documents"));
        }
        if (photograph != null && !photograph.isEmpty()) {
            student.setPhotographPath(fileStorageUtil.storeFile(photograph, "photos"));
        }
        if (proofOfResidence != null && !proofOfResidence.isEmpty()) {
            student.setProofOfResidencePath(fileStorageUtil.storeFile(proofOfResidence, "documents"));
        }

        student = studentRepository.save(student);

        Map<String, Object> result = new HashMap<>();
        result.put("student", student);
        result.put("username", username);
        result.put("defaultPassword", "123456");

        log.info("✅ Student created: {} with username: {}", student.getFullName(), username);
        return result;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found for this user"));
    }

    @Transactional
    public Student updateStudent(Long id, StudentRequest req) {
        Student student = getStudentById(id);

        student.setFullName(req.getFullName());
        if (req.getDateOfBirth() != null && !req.getDateOfBirth().isEmpty()) {
            student.setDateOfBirth(LocalDate.parse(req.getDateOfBirth(), DOB_FORMAT));
        }
        student.setGender(req.getGender());
        student.setNationality(req.getNationality());
        student.setMotherTongue(req.getMotherTongue());
        student.setCategory(req.getCategory());
        student.setBloodGroup(req.getBloodGroup());
        student.setAadhaarOrSamagraId(req.getAadhaarOrSamagraId());
        student.setParentName(req.getParentName());
        student.setParentOccupation(req.getParentOccupation());
        student.setParentAddress(req.getParentAddress());
        student.setParentMobile(req.getParentMobile());
        student.setParentEmail(req.getParentEmail());
        student.setLastSchoolAttended(req.getLastSchoolAttended());
        student.setBoard(req.getBoard());
        student.setPreviousGrade(req.getPreviousGrade());
        student.setMarksObtained(req.getMarksObtained());
        student.setClassForAdmission(req.getClassForAdmission());
        student.setAcademicYear(req.getAcademicYear());
        student.setAdmissionType(req.getAdmissionType());
        student.setKnownAllergies(req.getKnownAllergies());
        student.setMedicalConditions(req.getMedicalConditions());
        student.setEmergencyContact(req.getEmergencyContact());
        student.setSiblingsInSchool(req.getSiblingsInSchool());
        student.setTransportRequired(req.getTransportRequired());
        student.setLanguagePreferences(req.getLanguagePreferences());

        // Update user full name too
        if (student.getUser() != null) {
            student.getUser().setFullName(req.getFullName());
            userRepository.save(student.getUser());
        }

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        if (student.getUser() != null) {
            userRepository.delete(student.getUser());
        }
        studentRepository.delete(student);
    }
}
