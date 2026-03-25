package com.vps.service;

import com.vps.entity.PaymentConfig;
import com.vps.repository.PaymentConfigRepository;
import com.vps.util.FileStorageUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PaymentConfigService {

    private final PaymentConfigRepository paymentConfigRepository;
    private final FileStorageUtil fileStorageUtil;

    public PaymentConfigService(PaymentConfigRepository paymentConfigRepository, FileStorageUtil fileStorageUtil) {
        this.paymentConfigRepository = paymentConfigRepository;
        this.fileStorageUtil = fileStorageUtil;
    }

    public PaymentConfig getConfig() {
        return paymentConfigRepository.findAll().stream().findFirst()
                .orElse(PaymentConfig.builder().upiId("").build());
    }

    public PaymentConfig updateConfig(String upiId, String accountHolderName, String bankName,
                                       MultipartFile qrCode) throws IOException {
        PaymentConfig config = paymentConfigRepository.findAll().stream().findFirst()
                .orElse(new PaymentConfig());

        config.setUpiId(upiId);
        config.setAccountHolderName(accountHolderName);
        config.setBankName(bankName);

        if (qrCode != null && !qrCode.isEmpty()) {
            if (config.getQrCodePath() != null) {
                fileStorageUtil.deleteFile(config.getQrCodePath());
            }
            config.setQrCodePath(fileStorageUtil.storeFile(qrCode, "payment"));
        }

        return paymentConfigRepository.save(config);
    }
}
