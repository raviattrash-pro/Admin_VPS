package com.vps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class VpsApplication {
    public static void main(String[] args) {
        SpringApplication.run(VpsApplication.class, args);
    }
}
