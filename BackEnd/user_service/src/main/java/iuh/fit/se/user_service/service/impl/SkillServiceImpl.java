package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.model.Skill;
import iuh.fit.se.user_service.repository.SkillRepository;
import iuh.fit.se.user_service.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public List<Skill> getAllSkills() {
        return List.of();
    }

    @Override
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    @Override
    public Skill createSkill(Skill skill) {
        Skill skill1 = new Skill();
        skill1.setId(skill.getId());
        skill1.setSkillName(skill.getSkillName());
        skill1.setProfile(skill.getProfile());
        return skillRepository.save(skill1);
    }

    @Override
    public Skill updateSkill(Skill skill) {
        return null;
    }

    @Override
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
