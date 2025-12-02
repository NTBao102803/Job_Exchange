package iuh.fit.se.notification_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.*;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConfig {

    // 1. ✅ ĐỌC GIÁ TRỊ TỪ BIẾN MÔI TRƯỜNG: Đảm bảo là kafka:9092
    @Value("${spring.kafka.bootstrap-servers:kafka:9092}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        // FIX: Sử dụng biến đã inject thay vì hard-code
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(ProducerFactory<String, Object> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }

    // ================= CONSUMER CONFIG (FIXED) =================
    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();

        // 🛑 FIX LỖI CUỐI CÙNG: Thay thế "localhost:9092" bằng biến môi trường
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

        props.put(ConsumerConfig.GROUP_ID_CONFIG, "notification-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        // ✅ FIX Deserialization (Ánh xạ FQN từ Producer sang Consumer)
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        props.put(JsonDeserializer.TYPE_MAPPINGS,
                // Ánh xạ các DTO từ gói của Job Service
                "iuh.fit.se.job_service.dto.JobApprovedEvent:iuh.fit.se.notification_service.dto.JobApprovedEvent," +
                        "iuh.fit.se.job_service.dto.JobRejectedEvent:iuh.fit.se.notification_service.dto.JobRejectedEvent," +
                        // Ánh xạ các DTO từ gói của Application Service
                        "iuh.fit.se.application_service.dto.ApplicationSubmittedEvent:iuh.fit.se.notification_service.dto.ApplicationSubmittedEvent," +
                        "iuh.fit.se.application_service.dto.ApplicationStatusChangedEvent:iuh.fit.se.notification_service.dto.ApplicationStatusChangedEvent"
        );

        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory(
            ConsumerFactory<String, Object> consumerFactory,
            KafkaTemplate<String, Object> kafkaTemplate) {

        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);

        // Bắt lỗi Deserialization
        factory.setCommonErrorHandler(new DefaultErrorHandler(
                new DeadLetterPublishingRecoverer(kafkaTemplate),
                new FixedBackOff(1000L, 3)
        ));

        return factory;
    }

    // Khai báo Topics (để Kafka tự động tạo nếu chưa có)
    @Bean
    public NewTopic jobEvents() {
        return TopicBuilder.name("job-events").build();
    }

    @Bean
    public NewTopic applicationEvents() {
        return TopicBuilder.name("application-events").build();
    }
}