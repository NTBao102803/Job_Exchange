package iuh.fit.se.admin_service.client;

import iuh.fit.se.admin_service.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;

@FeignClient(name = "auth-service", path = "/api/admin")
public interface AuthClient {
    @PutMapping("/users/{id}/lock")
    UserResponse lockUser(@PathVariable("id") Long id);

    @PutMapping("/users/{id}/unlock")
    UserResponse unlockUser(@PathVariable("id") Long id);

    @GetMapping("/users/all")
    ResponseEntity<List<UserResponse>> getAllUsers();
}