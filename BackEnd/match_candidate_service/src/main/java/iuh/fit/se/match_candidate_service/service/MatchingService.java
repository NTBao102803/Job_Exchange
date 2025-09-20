package iuh.fit.se.match_candidate_service.service;

import iuh.fit.se.match_candidate_service.dto.MatchResultDto;

import java.util.List;

public interface MatchingService {
    List<MatchResultDto> findCandidatesForJob(Long jobId);
}
