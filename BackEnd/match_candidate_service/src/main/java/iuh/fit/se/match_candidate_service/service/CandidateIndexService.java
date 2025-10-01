package iuh.fit.se.match_candidate_service.service;

import iuh.fit.se.match_candidate_service.dto.CandidateDto;
import iuh.fit.se.match_candidate_service.dto.CandidateMatchDto;
import iuh.fit.se.match_candidate_service.dto.JobDto;
import iuh.fit.se.match_candidate_service.model.CandidateIndex;

import java.util.List;

public interface CandidateIndexService {
    public void syncCandidates();
    public List<CandidateMatchDto> searchCandidatesForJob(JobDto job, int topN);
    void upsertCandidate(CandidateDto dto);
    void deleteById(Long id);
}
