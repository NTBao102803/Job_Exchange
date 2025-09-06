package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.model.Skill;

import java.util.List;

public interface SkillService {
    public List<Skill> getAllSkills();
    public Skill getSkillById(Long id);
    public Skill createSkill(Skill skill);
    public Skill updateSkill(Skill skill);
    public void deleteSkill(Long id);

}
