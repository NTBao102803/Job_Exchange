package iuh.fit.se.message_service.dto;

import iuh.fit.se.message_service.entity.Message;

import java.time.LocalDateTime;

public record MessageDto(
        Long id,
        Long conversationId,
        Long senderId,
        String senderType,
        String content,
        boolean isRead,
        LocalDateTime createdAt,
        String senderAvatar,  // THÊM
        boolean fromSelf
) {
    public static MessageDto from(Message m, String avatar, boolean fromSelf) {
        return new MessageDto(
                m.getId(),
                m.getConversationId(),
                m.getSenderId(),
                m.getSenderType(),
                m.getContent(),
                m.isRead(),
                m.getCreatedAt(),
                avatar,
                fromSelf
        );
    }
}
