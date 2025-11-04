package iuh.fit.se.admin_service.controller;

import iuh.fit.se.admin_service.client.AuthClient;
import iuh.fit.se.admin_service.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AuthClient authClient;

    public AdminUserController(AuthClient authClient) {
        this.authClient = authClient;
    }

    @PutMapping("/{id}/lock")
    public ResponseEntity<?> lock(@PathVariable Long id) {
        var resp = authClient.lockUser(id);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}/unlock")
    public ResponseEntity<?> unlock(@PathVariable Long id) {
        var resp = authClient.unlockUser(id);
        return ResponseEntity.ok(resp);
    }
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authClient.getAllUsers().getBody());
    }
}

