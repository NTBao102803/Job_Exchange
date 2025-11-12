package iuh.fit.se.user_service.mapper;

import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.model.*;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CandidateMapper {

    @Mapping(target = "school", source = "educations", qualifiedByName = "educationsToSchool")
    @Mapping(target = "major", source = "educations", qualifiedByName = "educationsToMajor")
    @Mapping(target = "gpa", source = "educations", qualifiedByName = "educationsToGpa")
    @Mapping(target = "graduationYear", source = "educations", qualifiedByName = "educationsToGraduationYear")
    @Mapping(target = "experience", source = "experiences", qualifiedByName = "experiencesToText")
    @Mapping(target = "projects", source = "projects", qualifiedByName = "projectsToText")
    @Mapping(target = "skills", source = "skills", qualifiedByName = "skillsToText")
    @Mapping(target = "certificates", source = "certificates", qualifiedByName = "certificatesToText")
    CandidateDto toDto(Candidate candidate);

    @InheritInverseConfiguration
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "educations", ignore = true)
    @Mapping(target = "experiences", ignore = true)
    @Mapping(target = "projects", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "certificates", ignore = true)
    Candidate toEntity(CandidateDto dto);

    // Custom mappings
    @Named("educationsToSchool")
    default String educationsToSchool(List<Education> educations) {
        return educations != null && !educations.isEmpty()
                ? educations.get(0).getSchool() : null;
    }

    @Named("educationsToMajor")
    default String educationsToMajor(List<Education> educations) {
        return educations != null && !educations.isEmpty()
                ? educations.get(0).getMajor() : null;
    }

    @Named("educationsToGpa")
    default String educationsToGpa(List<Education> educations) {
        return educations != null && !educations.isEmpty()
                ? educations.get(0).getGpa() : null;
    }

    @Named("educationsToGraduationYear")
    default String educationsToGraduationYear(List<Education> educations) {
        return educations != null && !educations.isEmpty()
                ? educations.get(0).getGraduationYear() : null;
    }

    @Named("experiencesToText")
    default String experiencesToText(List<Experience> experiences) {
        if (experiences == null) return null;
        return experiences.stream()
                .map(Experience::getDescription)
                .filter(Objects::nonNull)
                .collect(Collectors.joining("\n"));
    }

    @Named("projectsToText")
    default String projectsToText(List<Project> projects) {
        if (projects == null) return null;
        return projects.stream()
                .map(Project::getDescription)
                .filter(Objects::nonNull)
                .collect(Collectors.joining("\n"));
    }

    @Named("skillsToText")
    default String skillsToText(List<Skill> skills) {
        if (skills == null) return null;
        return skills.stream()
                .map(Skill::getName)
                .collect(Collectors.joining(", "));
    }

    @Named("certificatesToText")
    default String certificatesToText(List<Certificate> certificates) {
        if (certificates == null) return null;
        return certificates.stream()
                .map(c -> c.getName() + " - " + c.getIssuer() + " (" + c.getIssueDate() + ")")
                .collect(Collectors.joining("\n"));
    }
}
