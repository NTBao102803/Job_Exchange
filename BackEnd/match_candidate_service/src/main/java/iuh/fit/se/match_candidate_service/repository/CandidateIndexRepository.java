package iuh.fit.se.match_candidate_service.repository;

import iuh.fit.se.match_candidate_service.model.CandidateIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface CandidateIndexRepository extends ElasticsearchRepository<CandidateIndex, Long> {

}
