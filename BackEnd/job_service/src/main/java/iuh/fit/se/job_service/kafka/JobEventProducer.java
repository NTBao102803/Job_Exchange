package iuh.fit.se.job_service.kafka;

import iuh.fit.se.job_service.dto.JobApprovedEvent;
import iuh.fit.se.job_service.dto.JobRejectedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "true")
@Slf4j
public class JobEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "job-events";

    public void publishJobApprovedEvent(JobApprovedEvent event) {
        log.info("📤 Sending JobApprovedEvent → Kafka: {}", event);
        kafkaTemplate.send(TOPIC, "jobApproved", event);
        log.info("✅ Sent to topic='{}' key='jobApproved'", TOPIC);
    }

    public void publishJobRejectedEvent(JobRejectedEvent event) {
        log.info("📤 Sending JobRejectedEvent → Kafka: {}", event);
        kafkaTemplate.send(TOPIC, "jobRejected", event);
        log.info("✅ Sent to topic='{}' key='jobRejected'", TOPIC);
    }
}

