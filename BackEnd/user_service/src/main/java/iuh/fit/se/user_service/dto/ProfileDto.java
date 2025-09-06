package iuh.fit.se.user_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ProfileDto {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String role;

    @NotBlank
    @Size(max = 100)
    private String fullName;

    private String phone;
    private String address;
    private String university;
    private String major;
    private String avatarUrl;

    private List<SkillDto> skills;
    private List<ExperienceDto> experiences;
}
