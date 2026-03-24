package com.vps.repository;

import com.vps.entity.PaymentConfig;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentConfigRepository extends JpaRepository<PaymentConfig, Long> {
}
