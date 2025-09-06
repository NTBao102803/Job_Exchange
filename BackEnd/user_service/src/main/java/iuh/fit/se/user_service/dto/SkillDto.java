package iuh.fit.se.user_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillDto {
    @NotBlank
    private String skillName;
}
