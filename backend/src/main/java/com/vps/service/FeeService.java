package com.vps.service;

import com.vps.entity.FeeRecord;
import com.vps.entity.Student;
import com.vps.repository.FeeRecordRepository;
import com.vps.repository.StudentRepository;
import com.vps.util.FileStorageUtil;
import com.vps.util.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRecordRepository feeRecordRepository;
    private final StudentRepository studentRepository;
    private final FileStorageUtil fileStorageUtil;
    private final PdfGenerator pdfGenerator;

    /**
     * Student submits online payment with screenshot
     */
    @Transactional
    public FeeRecord submitOnlinePayment(Long studentId, BigDecimal amount, String feeType,
                                          String transactionId, MultipartFile screenshot) throws IOException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String screenshotPath = null;
        if (screenshot != null && !screenshot.isEmpty()) {
            screenshotPath = fileStorageUtil.storeFile(screenshot, "screenshots");
        }

        FeeRecord record = FeeRecord.builder()
                .student(student)
                .amount(amount)
                .feeType(feeType)
                .paymentMode(FeeRecord.PaymentMode.ONLINE)
                .status(FeeRecord.PaymentStatus.PENDING)
                .screenshotPath(screenshotPath)
                .transactionId(transactionId)
                .build();

        return feeRecordRepository.save(record);
    }

    /**
     * Admin records offline payment
     */
    @Transactional
    public FeeRecord recordOfflinePayment(Long studentId, BigDecimal amount, String feeType,
                                           String remarks, String adminName) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        FeeRecord record = FeeRecord.builder()
                .student(student)
                .amount(amount)
                .feeType(feeType)
                .paymentMode(FeeRecord.PaymentMode.OFFLINE)
                .status(FeeRecord.PaymentStatus.VERIFIED)
                .remarks(remarks)
                .verifiedAt(LocalDateTime.now())
                .verifiedBy(adminName)
                .build();

        return feeRecordRepository.save(record);
    }

    /**
     * Admin verifies online payment
     */
    @Transactional
    public FeeRecord verifyPayment(Long feeId, boolean approved, String adminName) {
        FeeRecord record = feeRecordRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));

        record.setStatus(approved ? FeeRecord.PaymentStatus.VERIFIED : FeeRecord.PaymentStatus.REJECTED);
        record.setVerifiedAt(LocalDateTime.now());
        record.setVerifiedBy(adminName);

        return feeRecordRepository.save(record);
    }

    public List<FeeRecord> getStudentFees(Long studentId) {
        return feeRecordRepository.findByStudentId(studentId);
    }

    public List<FeeRecord> getPendingPayments() {
        return feeRecordRepository.findByStatus(FeeRecord.PaymentStatus.PENDING);
    }

    public List<FeeRecord> getAllFees() {
        return feeRecordRepository.findAll();
    }

    /**
     * Generate PDF receipt for a verified payment
     */
    public byte[] generateReceipt(Long feeId) {
        FeeRecord record = feeRecordRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));

        if (record.getStatus() != FeeRecord.PaymentStatus.VERIFIED) {
            throw new RuntimeException("Receipt can only be generated for verified payments");
        }

        Student student = record.getStudent();
        return pdfGenerator.generateFeeReceipt(record, student);
    }
}
