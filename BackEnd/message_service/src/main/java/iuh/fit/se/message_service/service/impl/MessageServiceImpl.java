package iuh.fit.se.message_service.service.impl;

import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.entity.Conversation;
import iuh.fit.se.message_service.entity.Message;
import iuh.fit.se.message_service.entity.UnreadCount;
import iuh.fit.se.message_service.repository.ConversationRepository;
import iuh.fit.se.message_service.repository.MessageRepository;
import iuh.fit.se.message_service.repository.UnreadCountRepository;
import iuh.fit.se.message_service.service.MessageService;
import iuh.fit.se.message_service.service.TokenParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository msgRepo;
    private final ConversationRepository convRepo;
    private final UnreadCountRepository unreadRepo;
    private final TokenParser tokenParser;

    @Override
    public Message saveMessage(MessageDto dto, String token) {
        log.info("=== START saveMessage | conv: {}, content: '{}' ===", dto.conversationId(), dto.content());

        Long userId = tokenParser.extractEntityId(token);
        String senderType = tokenParser.extractSenderType(token);

        Conversation conv = convRepo.findById(dto.conversationId())
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        if (!userId.equals(conv.getCandidateId()) && !userId.equals(conv.getEmployerId())) {
            throw new SecurityException("Not part of this conversation");
        }

        Message msg = Message.builder()
                .conversationId(dto.conversationId())
                .senderId(userId)
                .senderType(senderType)
                .content(dto.content())
                .build();
        msg = msgRepo.save(msg);

        conv.setLastMessage(dto.content());
        conv.setLastMessageAt(LocalDateTime.now());
        convRepo.save(conv);

        String receiverType = "USER".equals(senderType) ? "EMPLOYER" : "USER";
        Long receiverId = "USER".equals(senderType) ? conv.getEmployerId() : conv.getCandidateId();

        unreadRepo.findByConversationIdAndUserIdAndUserType(dto.conversationId(), receiverId, receiverType)
                .ifPresentOrElse(
                        uc -> { uc.setCount(uc.getCount() + 1); unreadRepo.save(uc); },
                        () -> unreadRepo.save(UnreadCount.builder()
                                .conversationId(dto.conversationId())
                                .userId(receiverId)
                                .userType(receiverType)
                                .count(1)
                                .build())
                );

        return msg;
    }
    @Override
    public void markAsRead(Long convId, Long userId, String userType) {
        String senderType = "USER".equals(userType) ? "EMPLOYER" : "USER";
        msgRepo.markAsRead(convId, userId); // senderId != userId → là tin nhắn người kia gửi
        unreadRepo.resetCount(convId, userId, userType);
    }
}