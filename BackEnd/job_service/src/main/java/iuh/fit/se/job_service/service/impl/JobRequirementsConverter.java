package iuh.fit.se.job_service.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.job_service.model.JobRequirements;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class JobRequirementsConverter implements AttributeConverter<JobRequirements, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(JobRequirements attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new RuntimeException("Could not convert JobRequirements to JSON", e);
        }
    }

    @Override
    public JobRequirements convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, JobRequirements.class);
        } catch (Exception e) {
            return new JobRequirements(); // tránh null
        }
    }
}
