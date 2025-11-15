package iuh.fit.se.payment_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDTO {
    private Long id;
    private Long recruiterId;
    private String planName;
    private Double planPrice;
    private Integer planDurationDays;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status;
}
