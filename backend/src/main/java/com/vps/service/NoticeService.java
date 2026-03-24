package com.vps.service;

import com.vps.entity.Notice;
import com.vps.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public List<Notice> getActiveNotices() {
        return noticeRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notice updateNotice(Long id, Notice updated) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        notice.setTitle(updated.getTitle());
        notice.setContent(updated.getContent());
        notice.setCategory(updated.getCategory());
        notice.setPriority(updated.getPriority());
        notice.setActive(updated.getActive());
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}
