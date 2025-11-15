package iuh.fit.se.employer_service.mapper;

import iuh.fit.se.employer_service.dto.EmployerDto;
import iuh.fit.se.employer_service.model.Company;
import iuh.fit.se.employer_service.model.Employer;
import org.springframework.stereotype.Component;

@Component
public class EmployerMapper {

    public EmployerDto toDto(Employer employer) {
        if (employer == null) return null;

        Company company = employer.getCompany();

        return EmployerDto.builder()
                .id(employer.getId())
                .fullName(employer.getFullName())
                .email(employer.getEmail())
                .phone(employer.getPhone())
                .companyName(company != null ? company.getCompanyName() : null)
                .companyAddress(company != null ? company.getCompanyAddress() : null)
                .authUserId(employer.getAuthUserId())
                .position(employer.getPosition())
                .companySize(company != null ? company.getCompanySize() : null)
                .companyField(company != null ? company.getCompanyField() : null)
                .taxCode(company != null ? company.getTaxCode() : null)
                .businessLicense(company != null ? company.getBusinessLicense() : null)
                .companyWebsite(company != null ? company.getCompanyWebsite() : null)
                .companySocial(company != null ? company.getCompanySocial() : null)
                .companyDescription(company != null ? company.getCompanyDescription() : null)
                .status(employer.getStatus())
                .build();
    }
}
