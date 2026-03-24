package com.vps.dto;

import lombok.Data;

@Data
public class StudentRequest {
    // Personal
    private String fullName;
    private String dateOfBirth; // DD/MM/YYYY
    private String gender;
    private String nationality;
    private String motherTongue;
    private String category;
    private String bloodGroup;
    private String aadhaarOrSamagraId;

    // Parent
    private String parentName;
    private String parentOccupation;
    private String parentAddress;
    private String parentMobile;
    private String parentEmail;

    // Academic
    private String lastSchoolAttended;
    private String board;
    private String previousGrade;
    private String marksObtained;

    // Admission
    private String classForAdmission;
    private String academicYear;
    private String admissionType;

    // Medical
    private String knownAllergies;
    private String medicalConditions;
    private String emergencyContact;

    // Misc
    private String siblingsInSchool;
    private Boolean transportRequired;
    private String languagePreferences;
}
