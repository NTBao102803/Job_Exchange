package iuh.fit.se.message_service.dto;

import java.time.LocalDateTime;

public record ConversationDto(
        Long id,
        String otherUserName,
        String otherUserAvatar,
        String lastMessage,
        LocalDateTime lastMessageAt,
        Integer unreadCount

) {
}
