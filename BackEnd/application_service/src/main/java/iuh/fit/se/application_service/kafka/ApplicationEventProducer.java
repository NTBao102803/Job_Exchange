package iuh.fit.se.application_service.kafka;

import iuh.fit.se.application_service.dto.ApplicationStatusChangedEvent;
import iuh.fit.se.application_service.dto.ApplicationSubmittedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationEventProducer {

    private static final String TOPIC = "application-events";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendApplicationSubmittedEvent(ApplicationSubmittedEvent event) {
        // Key có thể là applicationSubmitted (dễ phân biệt ở Consumer)
        kafkaTemplate.send(TOPIC, "applicationSubmitted", event);
        log.info("✅ Sent ApplicationSubmittedEvent to Kafka: CandidateId={}", event.getCandidateId());
    }

    public void sendApplicationStatusChangedEvent(ApplicationStatusChangedEvent event) {
        // Key có thể là applicationStatusChanged
        kafkaTemplate.send(TOPIC, "applicationStatusChanged", event);
        log.info("✅ Sent ApplicationStatusChangedEvent to Kafka: Status={}, JobTitle={}",
                event.getStatus(), event.getJobTitle());
    }
}