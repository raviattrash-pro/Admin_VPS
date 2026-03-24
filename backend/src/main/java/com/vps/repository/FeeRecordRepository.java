package com.vps.repository;

import com.vps.entity.FeeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeeRecordRepository extends JpaRepository<FeeRecord, Long> {
    List<FeeRecord> findByStudentId(Long studentId);
    List<FeeRecord> findByStatus(FeeRecord.PaymentStatus status);
    List<FeeRecord> findByStudentIdAndStatus(Long studentId, FeeRecord.PaymentStatus status);
}
