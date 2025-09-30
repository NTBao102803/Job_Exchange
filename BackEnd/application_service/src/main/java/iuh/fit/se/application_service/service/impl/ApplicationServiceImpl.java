package iuh.fit.se.application_service.service.impl;

import iuh.fit.se.application_service.client.CandidateClient;
import iuh.fit.se.application_service.client.JobClient;
import iuh.fit.se.application_service.client.StorageClient;
import iuh.fit.se.application_service.dto.ApplicationDto;
import iuh.fit.se.application_service.dto.ApplicationRequest;
import iuh.fit.se.application_service.dto.StorageResponse;
import iuh.fit.se.application_service.model.Application;
import iuh.fit.se.application_service.model.ApplicationStatus;
import iuh.fit.se.application_service.repository.ApplicationRepository;
import iuh.fit.se.application_service.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobClient jobClient;
    private final CandidateClient candidateClient;
    private final StorageClient storageClient;

    @Value("${application.check-remote:true}")
    private boolean checkRemote;

    @Override
    public ApplicationDto apply(ApplicationRequest request) {
        if (checkRemote) {
            jobClient.getJobById(request.getJobId());
            CandidateClient.CandidateDto candidate = candidateClient.getCandidateByEmail();
            request.setCandidateId(candidate.id());
        }

        applicationRepository.findByCandidateIdAndJobId(request.getCandidateId(), request.getJobId())
                .ifPresent(a -> { throw new IllegalStateException("Bạn đã ứng tuyển công việc này rồi"); });

        // upload file sang storage-service
        StorageResponse stored = storageClient.uploadFile(
                request.getFile(),
                request.getCandidateId(),
                "CV"
        );

        // tạo application
        Application app = Application.builder()
                .candidateId(request.getCandidateId())
                .jobId(request.getJobId())
                .status(ApplicationStatus.PENDING)
                .cvFileName(stored.getFileName())   // lấy từ response
                .cvObjectName(stored.getObjectName())
                .appliedAt(LocalDateTime.now())
                .build();

        Application saved = applicationRepository.save(app);
        return map(saved, stored.getFileUrl());
    }

    @Override
    public List<ApplicationDto> getByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId)
                .stream()
                .map(this::mapWithLookup)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapWithLookup)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDto updateStatus(Long applicationId, ApplicationStatus status, String rejectReason) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        app.setStatus(status);
        if (status == ApplicationStatus.REJECTED) {
            app.setRejectReason(rejectReason);
        }
        Application saved = applicationRepository.save(app);
        return mapWithLookup(saved);
    }

    // Map khi đã có fileUrl (trong lúc apply)
    private ApplicationDto map(Application a, String fileUrl) {
        return ApplicationDto.builder()
                .id(a.getId())
                .candidateId(a.getCandidateId())
                .jobId(a.getJobId())
                .status(a.getStatus())
                .rejectReason(a.getRejectReason())
                .cvFileName(a.getCvFileName())
                .cvUrl(fileUrl)
                .appliedAt(a.getAppliedAt())
                .build();
    }

    // Map khi chỉ có objectName -> gọi storage-service để lấy fileUrl
    private ApplicationDto mapWithLookup(Application a) {
        String fileUrl = null;
        if (a.getCvObjectName() != null) {
            try {
                // storage-service có thể thêm API getByObjectName
                fileUrl = storageClient.getFileUrl(a.getCvObjectName()).getFileUrl();
            } catch (Exception e) {
                // fallback
            }
        }
        return map(a, fileUrl);
    }
}
