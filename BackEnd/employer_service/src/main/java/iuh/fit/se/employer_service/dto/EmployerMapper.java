package iuh.fit.se.employer_service.dto;

import iuh.fit.se.employer_service.model.Employer;

public class EmployerMapper {
    public static EmployerDto toDto(Employer e) {
        if (e == null) return null;
        return EmployerDto.builder()
                .id(e.getId())
                .authUserId(e.getAuthUserId())
                .companyName(e.getCompanyName())
                .email(e.getEmail())
                .fullName(e.getFullName())
                .phone(e.getPhone())
                .status(e.getStatus())
                .position(e.getPosition())
                .companyAddress(e.getCompanyAddress())
                .companySize(e.getCompanySize())
                .companyField(e.getCompanyField())
                .taxCode(e.getTaxCode())
                .businessLicense(e.getBusinessLicense())
                .companyWebsite(e.getCompanyWebsite())
                .companySocial(e.getCompanySocial())
                .companyDescription(e.getCompanyDescription())
                .build();
    }
}
