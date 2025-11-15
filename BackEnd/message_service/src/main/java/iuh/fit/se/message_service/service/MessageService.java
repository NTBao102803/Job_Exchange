package iuh.fit.se.message_service.service;

import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.entity.Message;

public interface MessageService {
    Message saveMessage(MessageDto dto, String token);
    void markAsRead(Long conversationId, Long userId, String userType);
}
