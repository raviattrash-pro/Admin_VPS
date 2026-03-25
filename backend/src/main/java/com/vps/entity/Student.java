package com.vps.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String studentId;

    @Column(nullable = false)
    private String fullName;

    private LocalDate dateOfBirth;
    private String gender;
    private String nationality;
    private String motherTongue;
    private String category;
    private String bloodGroup;
    private String aadhaarOrSamagraId;

    private String parentName;
    private String parentOccupation;
    private String parentAddress;
    private String parentMobile;
    private String parentEmail;

    private String lastSchoolAttended;
    private String board;
    private String previousGrade;
    private String marksObtained;

    private String classForAdmission;
    private String academicYear;
    private String admissionType;

    private String knownAllergies;
    private String medicalConditions;
    private String emergencyContact;

    private String siblingsInSchool;
    private Boolean transportRequired;
    private String languagePreferences;

    private String birthCertificatePath;
    private String transferCertificatePath;
    private String reportCardPath;
    private String photographPath;
    private String proofOfResidencePath;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Student() {}

    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getMotherTongue() { return motherTongue; }
    public void setMotherTongue(String motherTongue) { this.motherTongue = motherTongue; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAadhaarOrSamagraId() { return aadhaarOrSamagraId; }
    public void setAadhaarOrSamagraId(String aadhaarOrSamagraId) { this.aadhaarOrSamagraId = aadhaarOrSamagraId; }
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }
    public String getParentOccupation() { return parentOccupation; }
    public void setParentOccupation(String parentOccupation) { this.parentOccupation = parentOccupation; }
    public String getParentAddress() { return parentAddress; }
    public void setParentAddress(String parentAddress) { this.parentAddress = parentAddress; }
    public String getParentMobile() { return parentMobile; }
    public void setParentMobile(String parentMobile) { this.parentMobile = parentMobile; }
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public String getLastSchoolAttended() { return lastSchoolAttended; }
    public void setLastSchoolAttended(String lastSchoolAttended) { this.lastSchoolAttended = lastSchoolAttended; }
    public String getBoard() { return board; }
    public void setBoard(String board) { this.board = board; }
    public String getPreviousGrade() { return previousGrade; }
    public void setPreviousGrade(String previousGrade) { this.previousGrade = previousGrade; }
    public String getMarksObtained() { return marksObtained; }
    public void setMarksObtained(String marksObtained) { this.marksObtained = marksObtained; }
    public String getClassForAdmission() { return classForAdmission; }
    public void setClassForAdmission(String classForAdmission) { this.classForAdmission = classForAdmission; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getAdmissionType() { return admissionType; }
    public void setAdmissionType(String admissionType) { this.admissionType = admissionType; }
    public String getKnownAllergies() { return knownAllergies; }
    public void setKnownAllergies(String knownAllergies) { this.knownAllergies = knownAllergies; }
    public String getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public String getSiblingsInSchool() { return siblingsInSchool; }
    public void setSiblingsInSchool(String siblingsInSchool) { this.siblingsInSchool = siblingsInSchool; }
    public Boolean getTransportRequired() { return transportRequired; }
    public void setTransportRequired(Boolean transportRequired) { this.transportRequired = transportRequired; }
    public String getLanguagePreferences() { return languagePreferences; }
    public void setLanguagePreferences(String languagePreferences) { this.languagePreferences = languagePreferences; }
    public String getBirthCertificatePath() { return birthCertificatePath; }
    public void setBirthCertificatePath(String birthCertificatePath) { this.birthCertificatePath = birthCertificatePath; }
    public String getTransferCertificatePath() { return transferCertificatePath; }
    public void setTransferCertificatePath(String transferCertificatePath) { this.transferCertificatePath = transferCertificatePath; }
    public String getReportCardPath() { return reportCardPath; }
    public void setReportCardPath(String reportCardPath) { this.reportCardPath = reportCardPath; }
    public String getPhotographPath() { return photographPath; }
    public void setPhotographPath(String photographPath) { this.photographPath = photographPath; }
    public String getProofOfResidencePath() { return proofOfResidencePath; }
    public void setProofOfResidencePath(String proofOfResidencePath) { this.proofOfResidencePath = proofOfResidencePath; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", studentId='" + studentId + '\'' +
                ", fullName='" + fullName + '\'' +
                '}';
    }

    public static class StudentBuilder {
        private String studentId;
        private String fullName;
        private LocalDate dateOfBirth;
        private String gender;
        private String nationality;
        private String motherTongue;
        private String category;
        private String bloodGroup;
        private String aadhaarOrSamagraId;
        private String parentName;
        private String parentOccupation;
        private String parentAddress;
        private String parentMobile;
        private String parentEmail;
        private String lastSchoolAttended;
        private String board;
        private String previousGrade;
        private String marksObtained;
        private String classForAdmission;
        private String academicYear;
        private String admissionType;
        private String knownAllergies;
        private String medicalConditions;
        private String emergencyContact;
        private String siblingsInSchool;
        private Boolean transportRequired;
        private String languagePreferences;
        private User user;

        public StudentBuilder studentId(String studentId) { this.studentId = studentId; return this; }
        public StudentBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public StudentBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public StudentBuilder gender(String gender) { this.gender = gender; return this; }
        public StudentBuilder nationality(String nationality) { this.nationality = nationality; return this; }
        public StudentBuilder motherTongue(String motherTongue) { this.motherTongue = motherTongue; return this; }
        public StudentBuilder category(String category) { this.category = category; return this; }
        public StudentBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public StudentBuilder aadhaarOrSamagraId(String aadhaarOrSamagraId) { this.aadhaarOrSamagraId = aadhaarOrSamagraId; return this; }
        public StudentBuilder parentName(String parentName) { this.parentName = parentName; return this; }
        public StudentBuilder parentOccupation(String parentOccupation) { this.parentOccupation = parentOccupation; return this; }
        public StudentBuilder parentAddress(String parentAddress) { this.parentAddress = parentAddress; return this; }
        public StudentBuilder parentMobile(String parentMobile) { this.parentMobile = parentMobile; return this; }
        public StudentBuilder parentEmail(String parentEmail) { this.parentEmail = parentEmail; return this; }
        public StudentBuilder lastSchoolAttended(String lastSchoolAttended) { this.lastSchoolAttended = lastSchoolAttended; return this; }
        public StudentBuilder board(String board) { this.board = board; return this; }
        public StudentBuilder previousGrade(String previousGrade) { this.previousGrade = previousGrade; return this; }
        public StudentBuilder marksObtained(String marksObtained) { this.marksObtained = marksObtained; return this; }
        public StudentBuilder classForAdmission(String classForAdmission) { this.classForAdmission = classForAdmission; return this; }
        public StudentBuilder academicYear(String academicYear) { this.academicYear = academicYear; return this; }
        public StudentBuilder admissionType(String admissionType) { this.admissionType = admissionType; return this; }
        public StudentBuilder knownAllergies(String knownAllergies) { this.knownAllergies = knownAllergies; return this; }
        public StudentBuilder medicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; return this; }
        public StudentBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public StudentBuilder siblingsInSchool(String siblingsInSchool) { this.siblingsInSchool = siblingsInSchool; return this; }
        public StudentBuilder transportRequired(Boolean transportRequired) { this.transportRequired = transportRequired; return this; }
        public StudentBuilder languagePreferences(String languagePreferences) { this.languagePreferences = languagePreferences; return this; }
        public StudentBuilder user(User user) { this.user = user; return this; }

        public Student build() {
            Student student = new Student();
            student.setStudentId(studentId);
            student.setFullName(fullName);
            student.setDateOfBirth(dateOfBirth);
            student.setGender(gender);
            student.setNationality(nationality);
            student.setMotherTongue(motherTongue);
            student.setCategory(category);
            student.setBloodGroup(bloodGroup);
            student.setAadhaarOrSamagraId(aadhaarOrSamagraId);
            student.setParentName(parentName);
            student.setParentOccupation(parentOccupation);
            student.setParentAddress(parentAddress);
            student.setParentMobile(parentMobile);
            student.setParentEmail(parentEmail);
            student.setLastSchoolAttended(lastSchoolAttended);
            student.setBoard(board);
            student.setPreviousGrade(previousGrade);
            student.setMarksObtained(marksObtained);
            student.setClassForAdmission(classForAdmission);
            student.setAcademicYear(academicYear);
            student.setAdmissionType(admissionType);
            student.setKnownAllergies(knownAllergies);
            student.setMedicalConditions(medicalConditions);
            student.setEmergencyContact(emergencyContact);
            student.setSiblingsInSchool(siblingsInSchool);
            student.setTransportRequired(transportRequired);
            student.setLanguagePreferences(languagePreferences);
            student.setUser(user);
            return student;
        }
    }
}
