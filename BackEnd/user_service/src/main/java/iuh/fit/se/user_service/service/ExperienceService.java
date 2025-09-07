package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.dto.ExperienceDto;
import iuh.fit.se.user_service.model.Experience;

import java.util.List;

public interface ExperienceService {
    List<Experience> addExperience(Long profileId, ExperienceDto dto);
    List<Experience> getExperiences(Long profileId);
    List<Experience> updateExperiences(Long profileId, List<ExperienceDto> dtos);
    void deleteExperience(Long profileId, Long expId);

}
