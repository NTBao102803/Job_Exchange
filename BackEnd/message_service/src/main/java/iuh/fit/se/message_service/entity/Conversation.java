package iuh.fit.se.message_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "conversations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidate_id", "employer_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long candidateId;
    private Long employerId;

    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection
    @CollectionTable(name = "conversation_jobs", joinColumns = @JoinColumn(name = "conversation_id"))
    @Column(name = "job_id")
    private Set<Long> jobIds = new HashSet<>();
}
