package iuh.fit.se.match_candidate_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MatchCandidateServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MatchCandidateServiceApplication.class, args);
    }

}
