package iuh.fit.se.auth_service.controller;

import iuh.fit.se.auth_service.dto.UserResponse;
import iuh.fit.se.auth_service.model.User;
import iuh.fit.se.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ADMIN')") // bảo vệ endpoint cho admin
public class AdminUserController {
    @Autowired
    private AuthService authService;

    @PutMapping("/{id}/lock")
    public ResponseEntity<UserResponse> lockUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.lockUser(id));
    }

    @PutMapping("/{id}/unlock")
    public ResponseEntity<UserResponse> unlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.unlockUser(id));
    }
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }
}

