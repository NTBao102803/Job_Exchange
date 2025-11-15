package iuh.fit.se.message_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "storage-service", path = "/api/storage")
public interface StorageClient {
    @GetMapping("/avatar-url")
    public String getAvatarUrl(@RequestParam Long userId);
}
