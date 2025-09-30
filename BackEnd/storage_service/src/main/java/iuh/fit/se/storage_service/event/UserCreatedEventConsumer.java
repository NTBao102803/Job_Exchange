package iuh.fit.se.storage_service.event;

import iuh.fit.se.storage_service.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreatedEventConsumer {

    private final StorageService storageService;

    @KafkaListener(topics = "user-created", groupId = "storage-service")
    public void consume(UserCreatedEvent event) {
        System.out.println("Nhận UserCreatedEvent trong storage-service: " + event);
        storageService.createDefaultFolder(event.getUserId());
    }
}
