package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.dto.SkillDto;
import iuh.fit.se.user_service.model.Skill;

import java.util.List;

public interface SkillService {
    List<Skill> addSkill(Long profileId, SkillDto dto);
    List<Skill> getSkills(Long profileId);
    List<Skill> updateSkills(Long profileId, List<SkillDto> dtos);
    void deleteSkill(Long profileId, SkillDto dto);

}
