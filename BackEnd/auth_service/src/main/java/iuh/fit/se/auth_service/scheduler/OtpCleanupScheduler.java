package iuh.fit.se.auth_service.scheduler;

import iuh.fit.se.auth_service.model.VerificationToken;
import iuh.fit.se.auth_service.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class OtpCleanupScheduler {
    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Scheduled(fixedRate = 60000) // mỗi 1 phút
    public void cleanExpiredOtps() {
        List<VerificationToken> expired = tokenRepository.findAllByExpiryDateBefore(LocalDateTime.now());
        tokenRepository.deleteAll(expired);
    }
}
