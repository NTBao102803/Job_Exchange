package iuh.fit.se.application_service.service.impl;

import iuh.fit.se.application_service.client.CandidateClient;
import iuh.fit.se.application_service.client.JobClient;
import iuh.fit.se.application_service.dto.ApplicationDto;
import iuh.fit.se.application_service.dto.ApplicationRequest;
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

    @Value("${application.check-remote:true}")
    private boolean checkRemote;

    @Override
    public ApplicationDto apply(ApplicationRequest request) {
        if (checkRemote) {
            // check job tồn tại
            jobClient.getJobById(request.getJobId());

            // check candidate tồn tại từ token
            CandidateClient.CandidateDto candidate = candidateClient.getCandidateByEmail();

            // nếu muốn lấy candidateId từ DB user-service thì dùng candidate.id()
            request.setCandidateId(candidate.id());
        }
        applicationRepository.findByCandidateIdAndJobId(request.getCandidateId(), request.getJobId())
                .ifPresent(a -> { throw new IllegalStateException("Bạn đã ứng tuyển công việc này rồi"); });

        Application app = Application.builder()
                .candidateId(request.getCandidateId())
                .jobId(request.getJobId())
                .coverLetter(request.getCoverLetter())
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();
        Application saved = applicationRepository.save(app);
        return map(saved);
    }

    @Override
    public List<ApplicationDto> getByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public ApplicationDto updateStatus(Long applicationId, ApplicationStatus status, String rejectReason) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        app.setStatus(status);
        if (status == ApplicationStatus.REJECTED) app.setRejectReason(rejectReason);
        Application saved = applicationRepository.save(app);
        return map(saved);
    }

    private ApplicationDto map(Application a) {
        return ApplicationDto.builder()
                .id(a.getId())
                .candidateId(a.getCandidateId())
                .jobId(a.getJobId())
                .status(a.getStatus())
                .coverLetter(a.getCoverLetter())
                .rejectReason(a.getRejectReason())
                .appliedAt(a.getAppliedAt())
                .build();
    }
}
