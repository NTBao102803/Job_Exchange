package iuh.fit.se.message_service.service;


import iuh.fit.se.message_service.dto.ConversationDto;
import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.entity.Message;

import java.util.List;

public interface ChatService {
    ConversationDto createOrGetConversation(Long candidateId, Long jobId);

    List<ConversationDto> getConversations(String userType, Long userId);

    List<MessageDto> getMessages(Long conversationId, Long userId, String userType);
    public int getTotalUnreadCount(String userType, Long userId);
}
