package iuh.fit.se.job_service.kafka;

import iuh.fit.se.job_service.dto.JobApprovedEvent;
import iuh.fit.se.job_service.dto.JobRejectedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
public class JobEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "job-events";

    public void publishJobApprovedEvent(JobApprovedEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }

    public void publishJobRejectedEvent(JobRejectedEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}
