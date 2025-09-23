package iuh.fit.se.match_candidate_service.service.impl;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import iuh.fit.se.match_candidate_service.client.UserClient;
import iuh.fit.se.match_candidate_service.dto.CandidateDto;
import iuh.fit.se.match_candidate_service.dto.CandidateMatchDto;
import iuh.fit.se.match_candidate_service.dto.JobDto;
import iuh.fit.se.match_candidate_service.dto.JobRequirements;
import iuh.fit.se.match_candidate_service.model.CandidateIndex;
import iuh.fit.se.match_candidate_service.repository.CandidateIndexRepository;
import iuh.fit.se.match_candidate_service.service.CandidateIndexService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHits;

import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateIndexServiceImpl implements CandidateIndexService {

    private  final UserClient userClient;
    private final CandidateIndexRepository candidateIndexRepository;
    private final ElasticsearchOperations elasticsearchOperations;


    @Override
    public void syncCandidates() {
        List<CandidateDto> candidates = userClient.getCandidates();
        List<CandidateIndex> indexList = candidates.stream()
                .map(c -> CandidateIndex.builder()
                        .id(c.getId())
                        .fullName(c.getFullName())
                        .email(c.getEmail())
                        .skills(parseSkills(c.getSkills()))
                        .experience(c.getExperience())
                        .major(c.getMajor())
                        .school(c.getSchool())
                        .address(c.getAddress())
                        .careerGoal(c.getCareerGoal())
                        .build())
                .collect(Collectors.toList());

        candidateIndexRepository.saveAll(indexList);
    }

    @Override
    public List<CandidateMatchDto> searchCandidatesForJob(JobDto job, int topN) {
        // Ghép jobText từ title, description, requirements
        String jobText = new StringBuilder()
                .append(Optional.ofNullable(job.getTitle()).orElse("")).append(" ")
                .append(Optional.ofNullable(job.getDescription()).orElse("")).append(" ")
                .append(Optional.ofNullable(job.getRequirements())
                        .map(reqs -> String.join(" ",
                                Optional.ofNullable(reqs.getSkills()).orElse(List.of()))
                                + " " + Optional.ofNullable(reqs.getExperience()).orElse("")
                                + " " + Optional.ofNullable(reqs.getCertificates()).orElse("")
                                + " " + Optional.ofNullable(reqs.getCareer()).orElse("")
                                + " " + Optional.ofNullable(reqs.getDescriptionRequirements()).orElse("")
                        ).orElse(""))
                .toString()
                .trim();

        // build bool query
        BoolQuery.Builder bool = new BoolQuery.Builder();

        if (!jobText.isBlank()) {
            bool.should(s -> s.multiMatch(m -> m
                    .query(jobText)
                    .fields("careerGoal", "fullName", "experience", "major", "skills")
                    .fuzziness("AUTO")));
        }

        // filter location
        Optional.ofNullable(job.getLocation())
                .filter(loc -> !loc.isBlank())
                .ifPresent(loc -> bool.filter(f -> f.match(m -> m.field("address").query(loc))));

        // build query
        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.bool(bool.build()))
                .withPageable(PageRequest.of(0, topN))
                .build();

        // execute
        SearchHits<CandidateIndex> hits = elasticsearchOperations.search(query, CandidateIndex.class);

        return hits.stream()
                .map(hit -> new CandidateMatchDto(hit.getContent(), hit.getScore()))
                .collect(Collectors.toList());
    }


    private List<String> parseSkills(String raw) {
        if (raw == null || raw.isBlank()) return List.of();
        return Arrays.stream(raw.split("[,;|/]+"))   // chia theo dấu phẩy ; | /
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> normalizeSkill(s))
                .distinct()
                .collect(Collectors.toList());
    }

    private String normalizeSkill(String s) {
        // chuẩn hóa tùy thích: lowercase hoặc giữ nguyên (tùy mapping keyword có normalizer hay không)
        return s;
    }

}
