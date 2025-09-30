package iuh.fit.se.user_service.service.impl;

import iuh.fit.se.user_service.dto.ExperienceDto;
import iuh.fit.se.user_service.model.Experience;
import iuh.fit.se.user_service.model.Profile;
import iuh.fit.se.user_service.repository.ExperienceRepository;
import iuh.fit.se.user_service.repository.ProfileRepository;
import iuh.fit.se.user_service.service.ExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExperienceServiceImpl implements ExperienceService {

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private ProfileRepository profileRepository;


    @Override
    public List<Experience> addExperience(Long profileId, ExperienceDto dto) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        Experience exp = mapToEntity(dto, new Experience());
        exp.setProfile(profile);
        experienceRepository.save(exp);
        return experienceRepository.findByProfileId(profileId);
    }

    @Override
    public List<Experience> getExperiences(Long profileId) {
        return experienceRepository.findByProfileId(profileId);
    }

    @Override
    @Transactional
    public List<Experience> updateExperiences(Long profileId, List<ExperienceDto> dtos) {
        Profile profile = profileRepository.findById(profileId).orElseThrow(() -> new RuntimeException("Profile not found"));
        // xóa hết experiences cũ
        experienceRepository.deleteByProfileId(profileId);

        List<Experience> newExps = dtos.stream().map(dto -> {
            Experience exp = mapToEntity(dto, new Experience());
            exp.setProfile(profile);
            return exp;
        }).collect(Collectors.toList());
        experienceRepository.saveAll(newExps);
        return newExps;
    }

    @Override
    public void deleteExperience(Long profileId, Long expId) {
        Experience exp = experienceRepository.findById(expId).orElseThrow(() -> new RuntimeException("Experience not found"));
        if (!exp.getProfile().getId().equals(profileId)) {
            throw new RuntimeException("Experience does not belong to this profile");
        }
        experienceRepository.delete(exp);
    }


    private Experience mapToEntity(ExperienceDto dto, Experience exp) {
        exp.setCompany(dto.getCompany());
        exp.setPosition(dto.getPosition());
        exp.setYears(dto.getYears());
        exp.setDescription(dto.getDescription());
        return exp;
    }
}
