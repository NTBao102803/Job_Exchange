package iuh.fit.se.job_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobRequest {
    private String title;
    private String description;
    private String company;
    private String location;
    private Double salary;
}
