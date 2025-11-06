package iuh.fit.se.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private Long receiverId;     // ID người nhận
    private String title;        // Tiêu đề
    private String message;      // Nội dung
    private String type;         // Ví dụ: JOB_APPROVED, APPLICATION_SUBMITTED...
    private String createdAt;    // Thời gian gửi (ISO 8601)
}
