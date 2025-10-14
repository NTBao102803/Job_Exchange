package iuh.fit.se.recommendation_service.service.impl;

import iuh.fit.se.recommendation_service.client.JobClient;
import iuh.fit.se.recommendation_service.client.UserClient;
import iuh.fit.se.recommendation_service.dto.*;
import iuh.fit.se.recommendation_service.repository.JobIndexRepository;
import iuh.fit.se.recommendation_service.service.JobIndexService;
import iuh.fit.se.recommendation_service.service.GeminiEmbeddingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobIndexServiceImpl implements JobIndexService {

    private static final Logger log = LoggerFactory.getLogger(JobIndexServiceImpl.class);

    private final JobClient jobClient;
    private final UserClient userClient;
    private final GeminiEmbeddingService embeddingService;
    private final JobIndexRepository indexRepository;

    private static final DateTimeFormatter[] DATE_FORMATS = new DateTimeFormatter[]{
            DateTimeFormatter.ISO_DATE_TIME,
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss")
    };

    private LocalDateTime parseDate(Object value) {
        if (value == null) return null;

        if (value instanceof List<?> list) {
            try {
                int year = ((Number) list.get(0)).intValue();
                int month = ((Number) list.get(1)).intValue();
                int day = ((Number) list.get(2)).intValue();
                int hour = list.size() > 3 ? ((Number) list.get(3)).intValue() : 0;
                int minute = list.size() > 4 ? ((Number) list.get(4)).intValue() : 0;
                int second = list.size() > 5 ? ((Number) list.get(5)).intValue() : 0;
                int nano = list.size() > 6 ? ((Number) list.get(6)).intValue() : 0;
                return LocalDateTime.of(year, month, day, hour, minute, second, nano);
            } catch (Exception e) {
                log.warn("[JobIndexServiceImpl] Failed to parse LocalDateTime from array: {}", list, e);
                return null;
            }
        }

        // Nếu là chuỗi dạng ISO
        String text = value.toString();
        for (DateTimeFormatter fmt : DATE_FORMATS) {
            try {
                return LocalDateTime.parse(text, fmt);
            } catch (DateTimeParseException ignored) {}
        }
        log.warn("[JobIndexServiceImpl] Could not parse date: {}", text);
        return null;
    }

    private LocalDate parseLocalDate(Object value) {
        if (value == null) return null;

        if (value instanceof List<?> list) {
            try {
                int year = ((Number) list.get(0)).intValue();
                int month = ((Number) list.get(1)).intValue();
                int day = ((Number) list.get(2)).intValue();
                return LocalDate.of(year, month, day);
            } catch (Exception e) {
                log.warn("[JobIndexServiceImpl] Failed to parse LocalDate from array: {}", list, e);
                return null;
            }
        }

        // Nếu là chuỗi dạng "2025-09-23"
        try {
            return LocalDate.parse(value.toString());
        } catch (Exception e) {
            log.warn("[JobIndexServiceImpl] Could not parse LocalDate: {}", value);
            return null;
        }
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

    @Override
    public void syncAllJobs() throws Exception {
        List<JobDto> jobs = jobClient.getAllJobs();
        log.info("[JobIndexServiceImpl] Syncing {} jobs to Elasticsearch", jobs.size());
        for (JobDto job : jobs) {
            syncOneJob(job);
        }
    }

    @Override
    public void syncJob(Long jobId) throws Exception {
        JobDto job = jobClient.getJobById(jobId);
        log.info("[JobIndexServiceImpl] Syncing jobId={}", jobId);
        if (job != null) syncOneJob(job);
        else log.warn("[JobIndexServiceImpl] Job not found id={}", jobId);
    }

    private void syncOneJob(JobDto job) {
        try {
            String text = buildJobText(job);
            log.info("[JobIndexServiceImpl] Building embedding for job id={} textLength={}", job.getId(), text.length());
            List<Double> emb = embeddingService.getEmbedding(text);
            log.info("[JobIndexServiceImpl] Embedding vector size for job {}: {}", job.getId(), emb.size());

            Map<String, Object> doc = new HashMap<>();
            doc.put("id", String.valueOf(job.getId()));
            doc.put("employerId", job.getEmployerId());
            doc.put("title", job.getTitle());
            doc.put("location", job.getLocation());
            doc.put("salary", job.getSalary());
            doc.put("jobType", job.getJobType());
            doc.put("startDate", job.getStartDate());
            doc.put("endDate", job.getEndDate());
            doc.put("description", job.getDescription());

            if (job.getRequirements() != null) {
                JobRequirements r = job.getRequirements();
                Map<String, Object> reqMap = new HashMap<>();
                reqMap.put("skills", r.getSkills());
                reqMap.put("experience", r.getExperience());
                reqMap.put("certificates", r.getCertificates());
                reqMap.put("career", r.getCareer());
                reqMap.put("descriptionRequirements", r.getDescriptionRequirements());
                doc.put("requirements", reqMap);
            }

            doc.put("benefits", job.getBenefits());
            doc.put("status", job.getStatus());
            doc.put("createdAt", job.getCreatedAt());
            doc.put("updatedAt", job.getUpdatedAt());
            doc.put("embedding", emb);

            indexRepository.indexJob(String.valueOf(job.getId()), doc);
        } catch (IOException ex) {
            log.error("[JobIndexServiceImpl] Failed to index job {}", job.getId(), ex);
            throw new RuntimeException("Failed to index job " + job.getId(), ex);
        } catch (Exception ex) {
            log.error("[JobIndexServiceImpl] Unexpected error for job {}", job.getId(), ex);
            throw new RuntimeException(ex);
        }
    }

    @Override
    public List<JobMatchDto> recommendJobsForCandidate(CandidateProfile candidate, int topK) throws Exception {
        log.info("[JobIndexServiceImpl] Recommending jobs for candidate id={} topK={}", candidate.getId(), topK);

        StringBuilder sb = new StringBuilder();
        if (candidate.getSkills() != null) sb.append(candidate.getSkills()).append(" ");
        if (candidate.getExperience() != null) sb.append(candidate.getExperience()).append(" ");
        if (candidate.getMajor() != null) sb.append(candidate.getMajor()).append(" ");
        if (candidate.getCareerGoal() != null) sb.append(candidate.getCareerGoal()).append(" ");
        String text = sb.toString().trim();

        List<Double> qVec = embeddingService.getEmbedding(text);
        log.info("[JobIndexServiceImpl] Candidate embedding size: {}", qVec.size());

        List<Map<String, Object>> hits = indexRepository.semanticSearch(qVec, topK);
        log.info("[JobIndexServiceImpl] Search returned {} hits", hits.size());

        return hits.stream().map(h -> {
            JobDto job = new JobDto();
            job.setId(h.get("id") != null ? Long.valueOf(String.valueOf(h.get("id"))) : null);
            job.setEmployerId(h.get("employerId") != null ? Long.valueOf(String.valueOf(h.get("employerId"))) : null);
            job.setTitle((String) h.get("title"));
            job.setLocation((String) h.get("location"));
            job.setJobType((String) h.get("jobType"));
            job.setSalary((String) h.get("salary"));
            job.setDescription((String) h.get("description"));
            job.setBenefits((String) h.get("benefits"));
            job.setStatus((String) h.get("status"));

            // ✅ Thêm dòng này
            job.setStartDate(parseLocalDate(h.get("startDate")));
            job.setEndDate(parseLocalDate(h.get("endDate")));

            job.setCreatedAt(parseDate(h.get("createdAt")));
            job.setUpdatedAt(parseDate(h.get("updatedAt")));

            if (h.get("requirements") instanceof Map<?, ?> reqMap) {
                JobRequirements req = new JobRequirements();
                req.setExperience((String) reqMap.get("experience"));
                req.setCertificates((String) reqMap.get("certificates"));
                req.setCareer((String) reqMap.get("career"));
                req.setDescriptionRequirements((String) reqMap.get("descriptionRequirements"));
                Object skills = reqMap.get("skills");
                if (skills instanceof List<?>) {
                    req.setSkills(((List<?>) skills).stream().map(Object::toString).collect(Collectors.toList()));
                }
                job.setRequirements(req);
            }

            double score = 0.0;
            Object s = h.get("_score");
            if (s instanceof Number n) score = n.doubleValue();

            return new JobMatchDto(job, score);
        }).collect(Collectors.toList());
    }

    @Override
    public List<JobMatchDto> recommendJobsForUser(Long userId, int topK) throws Exception {
        log.info("[JobIndexServiceImpl] Fetching candidate profile for userId={}", userId);
        CandidateProfile profile = userClient.getCandidateById(userId);
        if (profile == null) {
            log.warn("[JobIndexServiceImpl] Candidate not found userId={}", userId);
            throw new RuntimeException("User not found: " + userId);
        }
        return recommendJobsForCandidate(profile, topK);
    }
}
