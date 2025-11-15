package iuh.fit.se.message_service.service.impl;

import iuh.fit.se.message_service.client.EmployerClient;
import iuh.fit.se.message_service.client.JobClient;
import iuh.fit.se.message_service.client.StorageClient;
import iuh.fit.se.message_service.client.UserClient;
import iuh.fit.se.message_service.dto.*;
import iuh.fit.se.message_service.entity.Conversation;
import iuh.fit.se.message_service.entity.Message;
import iuh.fit.se.message_service.entity.UnreadCount;
import iuh.fit.se.message_service.repository.ConversationRepository;
import iuh.fit.se.message_service.repository.MessageRepository;
import iuh.fit.se.message_service.repository.UnreadCountRepository;
import iuh.fit.se.message_service.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository convRepo;
    private final MessageRepository msgRepo;
    private final UnreadCountRepository unreadRepo;

    private final JobClient jobClient;
    private final EmployerClient employerClient;
    private final UserClient candidateClient;
    private final StorageClient storageClient;



    @Override
    public void markAsRead(Long convId, Long userId, String userType) {
        String senderType = "CANDIDATE".equals(userType) ? "EMPLOYER" : "CANDIDATE";
        msgRepo.markAsRead(convId, userId); // senderId != userId → là tin nhắn người kia gửi
        unreadRepo.resetCount(convId, userId, userType);
    }



    @Override
    public ConversationDto createOrGetConversation(Long candidateId, Long jobId) {
        log.debug("createOrGetConversation | candidate: {}, job: {}", candidateId, jobId);
        var jobDto = jobClient.getJobById(jobId);
        Long employerId = jobDto.getEmployerId();

        Conversation conv = convRepo.findByCandidateIdAndEmployerId(candidateId, employerId)
                .orElseGet(() -> {
                    Conversation c = Conversation.builder()
                            .candidateId(candidateId)
                            .employerId(employerId)
                            .jobIds(new HashSet<>())
                            .build();
                    convRepo.save(c);
                    initUnreadCounts(c);
                    log.info("NEW CONVERSATION CREATED | id: {}", c.getId());
                    return c;
                });

        if (conv.getJobIds().add(jobId)) {
            convRepo.save(conv);
            log.debug("JOB ADDED | jobId: {} → conv: {}", jobId, conv.getId());
        }

        int unread = getUnreadCount(conv.getId(), "CANDIDATE", candidateId);
        return toConversationDTO(conv, unread, "CANDIDATE", candidateId);
    }

    @Override
    public List<MessageDto> getMessages(Long conversationId) {
        log.info("GET MESSAGES | conv: {}", conversationId);
        return msgRepo.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                .map(m -> {
                    String avatar = storageClient.getAvatarUrl(m.getSenderId()); // Success
                    return MessageDto.from(m, avatar);
                })
                .toList();
    }

    @Override
    public Message saveMessage(MessageDto dto) {
        log.debug("saveMessage | conv: {}, sender: {}", dto.conversationId(), dto.senderId());
        Conversation conv = convRepo.findById(dto.conversationId())
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!dto.senderId().equals(conv.getCandidateId()) && !dto.senderId().equals(conv.getEmployerId())) {
            log.warn("SECURITY VIOLATION | sender {} not in conv {}", dto.senderId(), conv.getId());
            throw new SecurityException("Not part of this conversation");
        }

        Message msg = Message.builder()
                .conversationId(dto.conversationId())
                .senderId(dto.senderId())
                .senderType(dto.senderType())
                .content(dto.content())
                .build();
        msg = msgRepo.save(msg);
        log.info("MESSAGE SAVED | id: {}", msg.getId());

        conv.setLastMessage(dto.content());
        conv.setLastMessageAt(LocalDateTime.now());
        convRepo.save(conv);

        String receiverType = "CANDIDATE".equals(dto.senderType()) ? "EMPLOYER" : "CANDIDATE";
        Long receiverId = "CANDIDATE".equals(dto.senderType()) ? conv.getEmployerId() : conv.getCandidateId();

        unreadRepo.findByConversationIdAndUserIdAndUserType(dto.conversationId(), receiverId, receiverType)
                .ifPresentOrElse(
                        uc -> {
                            uc.setCount(uc.getCount() + 1);
                            unreadRepo.save(uc);
                            log.debug("UNREAD++ | {} → {}", receiverId, uc.getCount());
                        },
                        () -> {
                            unreadRepo.save(UnreadCount.builder()
                                    .conversationId(dto.conversationId())
                                    .userId(receiverId)
                                    .userType(receiverType)
                                    .count(1)
                                    .build());
                            log.debug("UNREAD INIT | {} = 1", receiverId);
                        }
                );

        return msg;
    }

    @Override
    public List<ConversationDto> getConversations(String userType, Long userId) {
        log.info("getConversations | {}:{}", userType, userId);
        return convRepo.findAll().stream()
                .filter(c -> "CANDIDATE".equals(userType)
                        ? c.getCandidateId().equals(userId)
                        : c.getEmployerId().equals(userId))
                .map(c -> toConversationDTO(c, getUnreadCount(c.getId(), userType, userId), userType, userId))
                .toList();
    }

    private ConversationDto toConversationDTO(Conversation c, int unread, String viewerType, Long viewerId) {
        String otherName;
        String otherAvatar;

        if ("CANDIDATE".equals(viewerType)) {
            var employer = employerClient.getEmployerById(c.getEmployerId());
            otherName = employer.getCompanyName();
            otherAvatar = storageClient.getAvatarUrl(c.getEmployerId()); // Success
        } else {
            var candidate = candidateClient.getCandidateById(c.getCandidateId());
            otherName = candidate.getFullName();
            otherAvatar = storageClient.getAvatarUrl(c.getCandidateId()); // Success
        }

        log.debug("CONV DTO | id: {}, other: {}, avatar: {}", c.getId(), otherName, otherAvatar);
        return new ConversationDto(
                c.getId(),
                otherName,
                otherAvatar,
                c.getLastMessage(),
                c.getLastMessageAt(),
                unread
        );
    }
    private void initUnreadCounts(Conversation conv) {
        unreadRepo.save(UnreadCount.builder()
                .conversationId(conv.getId())
                .userId(conv.getCandidateId())
                .userType("CANDIDATE")
                .count(0)
                .build());
        unreadRepo.save(UnreadCount.builder()
                .conversationId(conv.getId())
                .userId(conv.getEmployerId())
                .userType("EMPLOYER")
                .count(0)
                .build());
    }

    private int getUnreadCount(Long convId, String userType, Long userId) {
        return unreadRepo.findByConversationIdAndUserIdAndUserType(convId, userId, userType)
                .map(UnreadCount::getCount)
                .orElse(0);
    }
}