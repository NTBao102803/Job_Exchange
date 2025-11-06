package iuh.fit.se.recommendation_service.service;

import iuh.fit.se.recommendation_service.dto.CandidateProfile;
import iuh.fit.se.recommendation_service.dto.JobDto;
import iuh.fit.se.recommendation_service.dto.JobMatchDto;

import java.util.List;

public interface JobIndexService {
    void syncAllJobs() throws Exception;
    void syncJob(Long jobId) throws Exception;
    List<JobMatchDto> recommendJobsForCandidate(CandidateProfile candidate, int topK) throws Exception;
    List<JobMatchDto> recommendJobsForUser(Long userId, int topK) throws Exception;
}
