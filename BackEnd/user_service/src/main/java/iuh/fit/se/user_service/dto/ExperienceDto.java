package iuh.fit.se.user_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExperienceDto {
    @NotBlank
    private String company;

    @NotBlank
    private String position;

    @Min(0)
    private int years;

    private String description;
}
