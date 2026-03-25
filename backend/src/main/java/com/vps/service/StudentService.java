package com.vps.service;

import com.vps.dto.StudentRequest;
import com.vps.entity.Student;
import com.vps.entity.User;
import com.vps.repository.StudentRepository;
import com.vps.repository.UserRepository;
import com.vps.util.FileStorageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
public class StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentService.class);

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageUtil fileStorageUtil;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, FileStorageUtil fileStorageUtil) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageUtil = fileStorageUtil;
    }

    private static final DateTimeFormatter DOB_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Transactional
    @CacheEvict(value = "students", allEntries = true)
    public Map<String, Object> createStudent(StudentRequest req,
                                               MultipartFile birthCert,
                                               MultipartFile transferCert,
                                               MultipartFile reportCard,
                                               MultipartFile photograph,
                                               MultipartFile proofOfResidence) throws IOException {
        String dateStr = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = studentRepository.count() + 1;
        String studentId = String.format("VPS-%s-%04d", dateStr, count);

        String username = req.getAadhaarOrSamagraId();
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Aadhaar / Samagra ID is required to be used as username");
        }

        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("A student with this Aadhaar / Samagra ID already exists");
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode("123456"))
                .fullName(req.getFullName())
                .role(User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

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

    @Cacheable("students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Cacheable(value = "student", key = "#id")
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found for this user"));
    }

    @Transactional
    @CacheEvict(value = {"students", "student"}, allEntries = true)
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

        if (student.getUser() != null) {
            student.getUser().setFullName(req.getFullName());
            userRepository.save(student.getUser());
        }

        return studentRepository.save(student);
    }

    @CacheEvict(value = {"students", "student"}, allEntries = true)
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        if (student.getUser() != null) {
            userRepository.delete(student.getUser());
        }
        studentRepository.delete(student);
    }
}
