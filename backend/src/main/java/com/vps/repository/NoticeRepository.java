package com.vps.repository;

import com.vps.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByActiveTrueOrderByCreatedAtDesc();
    List<Notice> findAllByOrderByCreatedAtDesc();
}
