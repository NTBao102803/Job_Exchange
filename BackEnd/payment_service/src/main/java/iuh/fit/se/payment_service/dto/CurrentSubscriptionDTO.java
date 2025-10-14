package iuh.fit.se.payment_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CurrentSubscriptionDTO {
    private String planName;
    private Double price;
    private Integer durationDays;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status;
}
