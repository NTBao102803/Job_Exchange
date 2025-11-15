package iuh.fit.se.message_service.dto;

public record ReadRequest(Long conversationId, Long userId, String userType) {
}
