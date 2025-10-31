package iuh.fit.se.notification_service.kafka;

import iuh.fit.se.notification_service.dto.JobApprovedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class JobEventProducer {

    private static final String TOPIC = "job-events";

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void sendJobEvent(JobApprovedEvent event) {
        try {
            if (kafkaTemplate != null) {
                kafkaTemplate.send(TOPIC, event);
                System.out.println("✅ Sent JobEvent to Kafka: " + event.getJobTitle());
            } else {
                System.out.println("⚠ Kafka not connected. Simulating event send...");
            }
        } catch (Exception e) {
            System.out.println("⚠ Kafka send failed (stub mode): " + e.getMessage());
        }
    }
}
