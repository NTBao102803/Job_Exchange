package iuh.fit.se.match_candidate_service.service.impl;

import iuh.fit.se.match_candidate_service.client.JobClient;
import iuh.fit.se.match_candidate_service.client.UserClient;
import iuh.fit.se.match_candidate_service.dto.*;
import iuh.fit.se.match_candidate_service.service.MatchingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class MatchingServiceImpl implements MatchingService {

    private final JobClient jobClient;
    private final UserClient userClient;

    @Value("${matching.weights.skills}")
    private int skillsWeight;

    @Value("${matching.weights.experience}")
    private int experienceWeight;

    @Value("${matching.weights.education}")
    private int educationWeight;

    @Value("${matching.weights.location}")
    private int locationWeight;

    @Value("${matching.weights.career}")
    private int careerWeight;


    public MatchingServiceImpl(JobClient jobClient, UserClient userClient) {
        this.jobClient = jobClient;
        this.userClient = userClient;
    }

    @Override
    public List<MatchResultDto> findCandidatesForJob(Long jobId) {
        JobDto job = jobClient.getJobById(jobId);
        List<CandidateDto> candidates = userClient.getCandidates();

        return candidates.stream()
                .map(c -> new MatchResultDto(c, calculateScore(c, job)))
                .sorted(Comparator.comparingInt(MatchResultDto::getScore).reversed())
                .collect(Collectors.toList());
    }

    private int calculateScore(CandidateDto c, JobDto job) {
        int score = 0;
        JobRequirements req = job.getRequirements();
        if (req == null) return score;

        // Skills
        score += matchSkills(c.getSkills(), req.getSkills()) * skillsWeight;

        // Experience
        score += matchExperience(c.getExperience(), req.getExperience()) * experienceWeight;

        // Education
        score += matchEducation(c.getMajor(), c.getSchool(), req.getEducation()) * educationWeight;

        // Location
        score += matchLocation(c.getAddress(), job.getLocation()) * locationWeight;

        // Career
        score += matchCareerGoal(c.getCareerGoal(), req.getCareer()) * careerWeight;

        return score;
    }

    // -------- Matching helpers --------

    private int matchSkills(String candidateSkills, List<String> requiredSkills) {
        if (candidateSkills == null || requiredSkills == null || requiredSkills.isEmpty()) return 0;

        List<String> candidateSkillList = Arrays.stream(candidateSkills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .toList();

        long matched = requiredSkills.stream()
                .map(String::toLowerCase)
                .filter(candidateSkillList::contains)
                .count();

        return (int) ((matched * 100) / requiredSkills.size());
    }

    private int matchExperience(String candidateExp, Integer requiredYears) {
        int candidateYears = extractYears(candidateExp);

        if (requiredYears == null || requiredYears == 0) return 50;
        if (candidateYears >= requiredYears) return 100;
        if (candidateYears == 0) return 0;

        return (int) ((candidateYears * 100.0) / requiredYears);
    }

    private int extractYears(String text) {
        if (text == null) return 0;
        Pattern p = Pattern.compile("(\\d+)");
        Matcher m = p.matcher(text);
        if (m.find()) {
            return Integer.parseInt(m.group(1));
        }
        return 0;
    }

    private int matchEducation(String major, String school, String requiredEdu) {
        if (requiredEdu == null) return 0;
        String lowerReq = requiredEdu.toLowerCase();

        int score = 0;
        if (major != null && lowerReq.contains(major.toLowerCase())) {
            score += 50;
        }
        if (school != null && lowerReq.contains(school.toLowerCase())) {
            score += 50;
        }
        return score;
    }

    private int matchLocation(String candidateAddress, String requiredLocation) {
        if (candidateAddress == null || requiredLocation == null) return 0;
        return candidateAddress.equalsIgnoreCase(requiredLocation) ? 100 : 0;
    }

    private int matchCareerGoal(String candidateGoal, String requiredCareer) {
        if (candidateGoal == null || requiredCareer == null) return 0;
        return candidateGoal.toLowerCase().contains(requiredCareer.toLowerCase()) ? 100 : 0;
    }
}
