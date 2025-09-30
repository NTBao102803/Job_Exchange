package iuh.fit.se.user_service.controller;


import iuh.fit.se.user_service.dto.ExperienceDto;
import iuh.fit.se.user_service.model.Experience;
import iuh.fit.se.user_service.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles/{profileId}/experiences")
public class ExperienceController {
    @Autowired
    private ExperienceService experienceService;

    @PostMapping
    public ResponseEntity<List<Experience>> addExperience(@PathVariable Long profileId, @RequestBody ExperienceDto dto) {
        return ResponseEntity.ok(experienceService.addExperience(profileId, dto));
    }

    @GetMapping
    public ResponseEntity<List<Experience>> getExperiences(@PathVariable Long profileId) {
        return ResponseEntity.ok(experienceService.getExperiences(profileId));
    }

    @PutMapping
    public ResponseEntity<List<Experience>> updateExperiences(@PathVariable Long profileId, @RequestBody List<ExperienceDto> dtos) {
        return ResponseEntity.ok(experienceService.updateExperiences(profileId, dtos));
    }

    @DeleteMapping("/{expId}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long profileId, @PathVariable Long expId) {
        experienceService.deleteExperience(profileId, expId);
        return ResponseEntity.noContent().build();
    }
}
