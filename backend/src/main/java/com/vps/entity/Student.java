package com.vps.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== Personal Profile =====
    @Column(unique = true)
    private String studentId; // Auto-generated: VPS-YYYYMMDD-XXXX

    @Column(nullable = false)
    private String fullName;

    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private String motherTongue;
    private String category; // ST/SC/OBC/EWS/Gen
    private String bloodGroup;
    private String aadhaarOrSamagraId;

    // ===== Parent/Guardian Information =====
    private String parentName;
    private String parentOccupation;
    private String parentAddress;
    private String parentMobile;
    private String parentEmail;

    // ===== Academic History =====
    private String lastSchoolAttended;
    private String board; // CBSE/ICSE/State
    private String previousGrade;
    private String marksObtained;

    // ===== Admission Details =====
    private String classForAdmission;
    private String academicYear;
    private String admissionType; // New/Transfer/Re-admission

    // ===== Medical Information =====
    private String knownAllergies;
    private String medicalConditions;
    private String emergencyContact;

    // ===== Miscellaneous =====
    private String siblingsInSchool;
    private Boolean transportRequired;
    private String languagePreferences;

    // ===== Document Paths =====
    private String birthCertificatePath;
    private String transferCertificatePath;
    private String reportCardPath;
    private String photographPath;
    private String proofOfResidencePath;

    // ===== Relationships =====
    @ToString.Exclude
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
