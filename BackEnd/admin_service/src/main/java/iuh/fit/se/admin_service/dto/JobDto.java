package iuh.fit.se.admin_service.dto;

import lombok.Data;

@Data
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private Double salary;
    private String status; // PENDING/APPROVED/REJECTED
}
