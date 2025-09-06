package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.model.Experience;

import java.util.List;

public interface ExperienceService {
    public List<Experience> getAllExperiences();
    public Experience getExperience(Long id);
    public Experience createExperience(Experience experience);
    public Experience updateExperience(Experience experience);
    public void deleteExperience(Long id);

}
