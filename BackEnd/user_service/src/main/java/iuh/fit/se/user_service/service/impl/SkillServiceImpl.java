package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.dto.SkillDto;
import iuh.fit.se.user_service.model.Profile;
import iuh.fit.se.user_service.model.Skill;
import iuh.fit.se.user_service.repository.ProfileRepository;
import iuh.fit.se.user_service.repository.SkillRepository;
import iuh.fit.se.user_service.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private ProfileRepository profileRepository;


    @Override
    public List<Skill> addSkill(Long profileId, SkillDto dto) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        Skill skill = new Skill();
        skill.setSkillName(dto.getSkillName());
        skill.setProfile(profile);
        skillRepository.save(skill);
        return skillRepository.findByProfileId(profileId);
    }

    @Override
    public List<Skill> getSkills(Long profileId) {
        return skillRepository.findByProfileId(profileId);
    }

    @Override
    @Transactional
    public List<Skill> updateSkills(Long profileId, List<SkillDto> dtos) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // clear collection hiện tại (được quản lý bởi Hibernate)
        profile.getSkills().clear();

        // map DTO -> Entity
        List<Skill> skills = dtos.stream().map(dto -> {
            Skill skill = new Skill();
            skill.setSkillName(dto.getSkillName());
            skill.setProfile(profile);
            return skill;
        }).toList();

        // addAll vào collection hiện có
        profile.getSkills().addAll(skills);

        return profileRepository.save(profile).getSkills();
    }

    @Override
    @Transactional
    public void deleteSkill(Long profileId, SkillDto dto) {
        int deleted = skillRepository.deleteBySkillNameAndProfileId(dto.getSkillName(), profileId);
        if (deleted == 0) {
            throw new RuntimeException("Skill not found or does not belong to profile");
        }
    }
}
