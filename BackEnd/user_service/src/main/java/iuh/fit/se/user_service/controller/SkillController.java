package iuh.fit.se.user_service.controller;


import iuh.fit.se.user_service.dto.SkillDto;
import iuh.fit.se.user_service.model.Skill;
import iuh.fit.se.user_service.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles/{profileId}/skills")
public class SkillController {
    @Autowired
    private SkillService skillService;

    @PostMapping
    public ResponseEntity<List<Skill>> addSkill(@PathVariable Long profileId, @RequestBody SkillDto dto) {
        return ResponseEntity.ok(skillService.addSkill(profileId, dto));
    }

    @GetMapping
    public ResponseEntity<List<Skill>> getSkills(@PathVariable Long profileId) {
        return ResponseEntity.ok(skillService.getSkills(profileId));
    }

    @PutMapping
    public ResponseEntity<List<Skill>> updateSkills(@PathVariable Long profileId, @RequestBody List<SkillDto> dtos) {
        return ResponseEntity.ok(skillService.updateSkills(profileId, dtos));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteSkill(@PathVariable Long profileId, @RequestBody SkillDto dto) {
        skillService.deleteSkill(profileId, dto);
        return ResponseEntity.noContent().build();
    }
}
