package iuh.fit.se.employer_service.dto;

import iuh.fit.se.employer_service.model.Employer;

public class EmployerMapper {
    public static EmployerDto toDto(Employer e) {
        return EmployerDto.builder()
                .id(e.getId())
                .email(e.getEmail())
                .companyName(e.getCompanyName())
                .companyAddress(e.getCompanyAddress())
                .status(e.getStatus())
                .build();
    }
}
