package iuh.fit.se.application_service.kafka;

import iuh.fit.se.application_service.dto.ApplicationSubmittedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
public class ApplicationEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "application-events";

    public void publishApplicationSubmittedEvent(ApplicationSubmittedEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}
