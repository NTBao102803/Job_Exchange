package iuh.fit.se.recommendation_service.service;

import iuh.fit.se.recommendation_service.dto.CandidateDto;
import iuh.fit.se.recommendation_service.dto.CandidateMatchDto;
import iuh.fit.se.recommendation_service.dto.JobDto;

import java.util.List;

public interface CandidateIndexService {
    void syncAllCandidates() throws Exception;
    void syncCandidate(Long id) throws Exception;
    List<CandidateMatchDto> recommendCandidatesForJob(JobDto job, int topK) throws Exception;
}