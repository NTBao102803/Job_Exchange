package iuh.fit.se.recommendation_service.service.impl;

import iuh.fit.se.recommendation_service.client.UserClient;
import iuh.fit.se.recommendation_service.dto.*;
import iuh.fit.se.recommendation_service.repository.SearchHelper;
import iuh.fit.se.recommendation_service.service.CandidateIndexService;
import iuh.fit.se.recommendation_service.service.GeminiEmbeddingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateIndexServiceImpl implements CandidateIndexService {

    private final UserClient userClient;
    private final GeminiEmbeddingService embeddingService;
    private final SearchHelper searchHelper;

    private String buildText(CandidateDto c) {
        StringBuilder sb = new StringBuilder();
        Optional.ofNullable(c.getFullName()).ifPresent(v -> sb.append(v).append(" "));
        Optional.ofNullable(c.getSkills()).ifPresent(s -> sb.append(String.join(" ", s)).append(" "));
        Optional.ofNullable(c.getExperience()).ifPresent(sb::append);
        Optional.ofNullable(c.getMajor()).ifPresent(sb::append);
        Optional.ofNullable(c.getCareerGoal()).ifPresent(sb::append);
        return sb.toString().trim();
    }

    @Override
    public void syncAllCandidates() throws Exception {
        List<CandidateDto> candidates = userClient.getCandidates();
        for (CandidateDto c : candidates) {
            syncOne(c);
        }
    }

    @Override
    public void syncCandidate(Long id) throws Exception {
        // Nếu user-service có API get by id
        throw new UnsupportedOperationException("Implement getCandidateById in UserClient");
    }

    private void syncOne(CandidateDto dto) throws Exception {
        String text = buildText(dto);
        List<Double> emb = embeddingService.getEmbedding(text);

        Map<String, Object> doc = new HashMap<>();
        doc.put("id", String.valueOf(dto.getId()));
        doc.put("fullName", dto.getFullName());
        doc.put("email", dto.getEmail());
        doc.put("skills", Arrays.stream(dto.getSkills().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList()));
        doc.put("experience", dto.getExperience());
        doc.put("major", dto.getMajor());
        doc.put("school", dto.getSchool());
        doc.put("address", dto.getAddress());
        doc.put("careerGoal", dto.getCareerGoal());
        doc.put("embedding", emb);

        searchHelper.indexDocument("candidates", String.valueOf(dto.getId()), doc);
    }

    @Override
    public List<CandidateMatchDto> recommendCandidatesForJob(JobDto job, int topK) throws Exception {
        String jobText = buildJobText(job);
        List<Double> vec = embeddingService.getEmbedding(jobText);
        List<Map<String, Object>> hits = searchHelper.semanticSearch("candidates", vec, topK);

        return hits.stream().map(hit -> {
            CandidateDto dto = new CandidateDto();
            dto.setId(Long.valueOf(String.valueOf(hit.get("id"))));
            dto.setFullName((String) hit.get("fullName"));
            dto.setEmail((String) hit.get("email"));
            dto.setSkills(toSkillsString(hit.get("skills")));
            dto.setExperience((String) hit.get("experience"));
            dto.setMajor((String) hit.get("major"));
            dto.setSchool((String) hit.get("school"));
            dto.setAddress((String) hit.get("address"));
            dto.setCareerGoal((String) hit.get("careerGoal"));

            double score = Optional.ofNullable(hit.get("_score"))
                    .map(Object::toString).map(Double::parseDouble).orElse(0.0);

            return new CandidateMatchDto(dto, score);
        }).collect(Collectors.toList());
    }

    private String toSkillsString(Object o) {
        if (o == null) return "";
        if (o instanceof List<?> list) {
            return list.stream()
                    .map(Object::toString)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.joining(", "));
        }
        return String.valueOf(o).trim();
    }
    private List<String> safeList(Object o) {
        return o instanceof List<?> l ? l.stream().map(Object::toString).collect(Collectors.toList()) : List.of();
    }

    private String buildJobText(JobDto job) {
        StringBuilder sb = new StringBuilder();
        if (job.getTitle() != null) sb.append(job.getTitle()).append(" ");
        if (job.getDescription() != null) sb.append(job.getDescription()).append(" ");
        if (job.getRequirements() != null) {
            JobRequirements r = job.getRequirements();
            if (r.getSkills() != null) sb.append(String.join(" ", r.getSkills())).append(" ");
            if (r.getExperience() != null) sb.append(r.getExperience()).append(" ");
            if (r.getDescriptionRequirements() != null) sb.append(r.getDescriptionRequirements()).append(" ");
        }
        return sb.toString().trim();
    }
}