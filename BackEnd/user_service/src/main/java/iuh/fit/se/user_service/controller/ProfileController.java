package iuh.fit.se.user_service.controller;

import iuh.fit.se.user_service.dto.ProfileDto;
import iuh.fit.se.user_service.dto.ProfileRequest;
import iuh.fit.se.user_service.model.Profile;
import iuh.fit.se.user_service.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("myProfileController")
@RequestMapping("/api/user")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.createProfile(request));
    }

    // 🔹 Lấy profile theo userId (test bằng Postman)
    @GetMapping("/{id}")
    public ResponseEntity<Profile> getMyProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getMyProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long id,
                                                 @RequestBody ProfileDto profileDto) {
        Profile updatedProfile = profileService.updateProfile(id, profileDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
    }

    @GetMapping
    public ResponseEntity<List<Profile>> getAll() {
        return ResponseEntity.ok(profileService.getAllMyProfiles());
    }
}
