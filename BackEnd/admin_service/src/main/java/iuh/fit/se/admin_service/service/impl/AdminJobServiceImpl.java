package iuh.fit.se.admin_service.service.impl;

import iuh.fit.se.admin_service.client.JobClient;
import iuh.fit.se.admin_service.dto.JobDto;
import iuh.fit.se.admin_service.dto.RejectRequest;
import iuh.fit.se.admin_service.service.AdminJobService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminJobServiceImpl implements AdminJobService {

    private final JobClient jobClient;


    public AdminJobServiceImpl(JobClient jobClient) {
        this.jobClient = jobClient;
    }

    @Override
    public List<JobDto> getPending() {
        return jobClient.getPending();
    }

    @Override
    public JobDto approve(Long jobId) {
        return jobClient.approve(jobId);
    }

    @Override
    public JobDto reject(Long jobId, String reason) {
        RejectRequest body = new RejectRequest();
        body.setReason(reason);
        return jobClient.reject(jobId, body);
    }

    @Override
    public void delete(Long jobId) {
        jobClient.delete(jobId);
    }

    @Override
    public JobDto getById(Long jobId) {
        return jobClient.getById(jobId);
    }

    @Override
    public List<JobDto> getAll() {
        return jobClient.getAll();
    }
}
