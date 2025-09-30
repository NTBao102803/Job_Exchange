package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.dto.ExperienceDto;
import iuh.fit.se.user_service.dto.ProfileDto;
import iuh.fit.se.user_service.dto.ProfileRequest;
import iuh.fit.se.user_service.dto.SkillDto;
import iuh.fit.se.user_service.model.Experience;
import iuh.fit.se.user_service.model.Profile;
import iuh.fit.se.user_service.model.Skill;
import iuh.fit.se.user_service.repository.ProfileRepository;
import iuh.fit.se.user_service.service.ProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository repo;

    public ProfileServiceImpl(ProfileRepository repo) {
        this.repo = repo;
    }

    @Override
    public Profile getMyProfile(Long userId) {
        return repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Override
    @Transactional
    public Profile updateProfile(Long userId, ProfileDto dto) {
        Profile profile = repo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Update basic fields
        profile.setEmail(dto.getEmail());
        profile.setRole(dto.getRole());
        profile.setFullName(dto.getFullName());
        profile.setPhone(dto.getPhone());
        profile.setAddress(dto.getAddress());
        profile.setUniversity(dto.getUniversity());
        profile.setMajor(dto.getMajor());
        profile.setAvatarUrl(dto.getAvatarUrl());

        // ---- Update Skills ----
        profile.getSkills().clear();
        if (dto.getSkills() != null) {
            dto.getSkills().forEach(s -> {
                Skill skill = new Skill();
                skill.setSkillName(s.getSkillName());
                skill.setProfile(profile); // quan trọng để tránh lỗi orphan
                profile.getSkills().add(skill);
            });
        }

        // ---- Update Experiences ----
        profile.getExperiences().clear();
        if (dto.getExperiences() != null) {
            dto.getExperiences().forEach(e -> {
                Experience exp = new Experience();
                exp.setCompany(e.getCompany());
                exp.setPosition(e.getPosition());
                exp.setYears(e.getYears());
                exp.setDescription(e.getDescription());
                exp.setProfile(profile); // set quan hệ 2 chiều
                profile.getExperiences().add(exp);
            });
        }

        return repo.save(profile);
    }

    @Override
    public Profile createProfile(ProfileRequest request) {
        Profile profile = new Profile();
        profile.setId(request.getUserId());
        profile.setEmail(request.getEmail());
        profile.setRole(request.getRole());
        profile.setFullName(request.getFullName());
        return repo.save(profile);
    }

    @Override
    public void deleteProfile(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Profile> getAllMyProfiles() {
        return List.of();
    }
}
