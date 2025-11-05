package iuh.fit.se.application_service.service.impl;

import iuh.fit.se.application_service.client.CandidateClient;
import iuh.fit.se.application_service.client.JobClient;
import iuh.fit.se.application_service.client.StorageClient;
import iuh.fit.se.application_service.dto.*;
import iuh.fit.se.application_service.kafka.ApplicationEventProducer;
import iuh.fit.se.application_service.model.Application;
import iuh.fit.se.application_service.model.ApplicationStatus;
import iuh.fit.se.application_service.repository.ApplicationRepository;
import iuh.fit.se.application_service.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {
    private static final Logger logger = LoggerFactory.getLogger(ApplicationServiceImpl.class);

    private final ApplicationRepository applicationRepository;
    private final JobClient jobClient;
    private final CandidateClient candidateClient;
    private final StorageClient storageClient;
    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired(required = false)
    private ApplicationEventProducer eventProducer;

    @Value("${application.check-remote:true}")
    private boolean checkRemote;

    @Override
    public ApplicationDto apply(ApplicationRequest request) {
        JobClient.JobDto job = null;
        CandidateClient.CandidateDto candidate = null;
        if (checkRemote) {
            job = jobClient.getJobById(request.getJobId());
            candidate = candidateClient.getCandidateByEmail();
            request.setCandidateId(candidate.id());
        }

        // Cho phép apply tối đa 3 lần cho cùng 1 job
        List<Application> existingApps = applicationRepository.findAllByCandidateIdAndJobId(
                request.getCandidateId(), request.getJobId());
        if (existingApps.size() >= 3) {
            throw new IllegalStateException("Bạn đã ứng tuyển công việc này quá 3 lần");
        }

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
                .cvFileName(stored.getFileName())
                .cvObjectName(stored.getObjectName())
                .appliedAt(LocalDateTime.now())
                .build();

        Application saved = applicationRepository.save(app);

        ApplicationSubmittedEvent event = new ApplicationSubmittedEvent(
                saved.getId(),
                request.getCandidateId(),
                candidate.fullName(),
                request.getJobId(),
                job.title(),
                job.employerId()
        );

        sendNotificationViaRest(event, "application-submitted");

        if (eventProducer != null) {
            try {
                eventProducer.publishApplicationSubmittedEvent(event);
            } catch (Exception e) {
                logger.warn("Kafka send failed", e);
            }
        }

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

    @Override
    public Application approvedApplication(Long applicationId) {
        Application apply = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application không tồn tại"));
        apply.setStatus(ApplicationStatus.APPROVED);
        Application saved = applicationRepository.save(apply);

        // LẤY THÔNG TIN
        CandidateClient.CandidateDto candidate = candidateClient.getCandidateById(apply.getCandidateId());
        JobClient.JobDto job = jobClient.getJobById(apply.getJobId());

        // GỬI THÔNG BÁO CHO ỨNG VIÊN
        ApplicationStatusChangedEvent event = new ApplicationStatusChangedEvent(
                saved.getId(),
                candidate.id(),
                candidate.fullName(),
                job.id(),
                job.title(),
                "APPROVED",
                null
        );
        sendNotificationViaRest(event, "application-status-changed");

        // GỬI KAFKA (nếu bật)
        if (eventProducer != null) {
            try {
                eventProducer.publishApplicationStatusChangedEvent(event);
                logger.info("Kafka: Đã gửi ApplicationStatusChangedEvent (APPROVED)");
            } catch (Exception e) {
                logger.warn("Kafka send failed (APPROVED)", e);
            }
        }
        return saved;
    }

    @Override
    public Application rejectedApplication(Long applicationId) {
        Application apply = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application không tồn tại"));

        apply.setStatus(ApplicationStatus.REJECTED);
        Application saved = applicationRepository.save(apply);

        CandidateClient.CandidateDto candidate = candidateClient.getCandidateById(apply.getCandidateId());
        JobClient.JobDto job = jobClient.getJobById(apply.getJobId());

        ApplicationStatusChangedEvent event = new ApplicationStatusChangedEvent(
                saved.getId(),
                candidate.id(),
                candidate.fullName(),
                job.id(),
                job.title(),
                "REJECTED",
                apply.getRejectReason()
        );
        sendNotificationViaRest(event, "application-status-changed");

        // GỬI KAFKA (nếu bật)
        if (eventProducer != null) {
            try {
                eventProducer.publishApplicationStatusChangedEvent(event);
                logger.info("Kafka: Đã gửi ApplicationStatusChangedEvent (REJECTED)");
            } catch (Exception e) {
                logger.warn("Kafka send failed (REJECTED)", e);
            }
        }

        return saved;
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

    private void sendNotificationViaRest(Object event, String endpoint) {
        try {
            String url = "http://localhost:8080/api/notifications/" + endpoint;
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // LẤY TOKEN TỪ REQUEST HIỆN TẠI
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                String authHeader = attributes.getRequest().getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    headers.setBearerAuth(authHeader.substring(7));
                }
            }

            HttpEntity<Object> request = new HttpEntity<>(event, headers);
            restTemplate.postForObject(url, request, String.class);
            logger.info("Gửi thông báo REST thành công: {}", endpoint);
        } catch (Exception e) {
            logger.error("REST notification failed: {}", e.getMessage());
        }
    }
}
