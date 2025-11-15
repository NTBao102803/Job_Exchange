package iuh.fit.se.message_service.repository;


import iuh.fit.se.message_service.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByCandidateIdAndEmployerId(Long candidateId, Long employerId);
}
