package iuh.fit.se.user_service.service;

import iuh.fit.se.user_service.dto.CandidateDto;
import iuh.fit.se.user_service.dto.CandidateRequest;
import iuh.fit.se.user_service.model.Candidate;

import java.util.List;

public interface CandidateService {
    public List<Candidate> getCandidates();
    public Candidate getCandidate();
    public Candidate updateCandidate(CandidateDto candidateDto);
    public Candidate createCandidate(CandidateRequest candidateRequest);
}
