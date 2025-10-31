package iuh.fit.se.job_service.kafka;

import iuh.fit.se.job_service.dto.JobApprovedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class JobEventProducer {

//    private static final String TOPIC = "job-events";
//
//    @Autowired(required = false)
//    private KafkaTemplate<String, Object> kafkaTemplate;
    public void publishJobApprovedEvent(JobApprovedEvent event) {
        // ⚠️ Stub tạm
        System.out.println("🧩 [STUB] Kafka Producer - would send event: " + event);
        // kafkaTemplate.send("job-approved-topic", event);
    }

//    public void sendJobApprovedEvent(JobApprovedEvent event) {
//        try {
//            if (kafkaTemplate != null) {
//                kafkaTemplate.send(TOPIC, event);
//                System.out.println("✅ [Kafka] Sent job approved event for jobId=" + event.getJobId());
//            } else {
//                System.out.println("⚠ [Kafka stub] Kafka not connected, skipping send.");
//            }
//        } catch (Exception e) {
//            System.out.println("⚠ [Kafka stub] Failed to send event: " + e.getMessage());
//        }
//    }
}
