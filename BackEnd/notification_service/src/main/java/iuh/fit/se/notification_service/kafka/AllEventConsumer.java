package iuh.fit.se.notification_service.kafka;

import iuh.fit.se.notification_service.dto.*;
import iuh.fit.se.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord; // Cần thiết
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AllEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = {"job-events", "application-events"},
            groupId = "notification-group",
            containerFactory = "kafkaListenerContainerFactory"
            // KHÔNG CẦN THÊM CẤU HÌNH NÀO KHÁC
    )
    // ✅ FIX: Thay đổi tham số nhận từ Object event thành ConsumerRecord<String, Object>
    public void consume(ConsumerRecord<String, Object> record) {
        // Lấy giá trị (value) của tin nhắn, đây là DTO đã được Deserialization
        Object event = record.value();

        // Log thông tin Deserialization thành công
        log.info("📥 RECEIVED DTO (Topic: {}): {}", record.topic(), event);
        log.info("📌 Event class = {}", event.getClass().getName());

        // 🛑 XÓA CÁC LOG DEBUG VÀ CÁC ĐOẠN IF LỖI (VÌ KHÔNG CÒN NHẬN ConsumerRecord THÔ)

        // ❌ XÓA: if (event instanceof ConsumerRecord<?, ?> record) { ... }
        // ❌ XÓA: log.warn("⚠ Received ConsumerRecord instead of DTO!");

        if (event instanceof JobApprovedEvent e) {
            log.info("➡ Handling JobApprovedEvent: {}", e.getJobTitle());
            notificationService.handleJobApproved(e);

        } else if (event instanceof JobRejectedEvent e) {
            log.info("➡ Handling JobRejectedEvent: {}", e.getJobTitle());
            notificationService.handleJobRejected(e);

        } else if (event instanceof ApplicationSubmittedEvent e) {
            log.info("➡ Handling ApplicationSubmittedEvent: candidate {}", e.getCandidateName());
            notificationService.handleApplicationSubmitted(e);

        } else if (event instanceof ApplicationStatusChangedEvent e) {
            log.info("➡ Handling ApplicationStatusChangedEvent: status {}", e.getStatus());
            notificationService.handleApplicationStatusChanged(e);

        } else {
            log.error("❌ Unknown event type received: {}", event.getClass().getName());
        }
    }
}