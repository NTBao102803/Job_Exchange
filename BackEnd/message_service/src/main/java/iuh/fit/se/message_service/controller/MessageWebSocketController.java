package iuh.fit.se.message_service.controller;

import iuh.fit.se.message_service.client.StorageClient;
import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.dto.ReadRequest;
import iuh.fit.se.message_service.entity.Message;
import iuh.fit.se.message_service.service.ChatService;
import iuh.fit.se.message_service.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final CurrentUserService currentUserService;
    private final StorageClient storageClient;

    @MessageMapping("/chat.send")
    public void sendMessage(
            @Payload MessageDto dto,
            SimpMessageHeaderAccessor headers
    )
    {
        String token = (String) headers.getSessionAttributes().get("token");
        String role  = (String) headers.getSessionAttributes().get("role");
        try
        {
            Long userId = currentUserService.getCurrentUserId();

            log.info("WS SEND | role={} user={} conv={} content={}", role, userId, dto.conversationId(), dto.content());
            String senderType = currentUserService.getCurrentSenderType();

            log.info("WS SEND | userId: {}, type: {}, conv: {}, content: {}",
                    userId, senderType, dto.conversationId(), dto.content());

            MessageDto fixedDto = new MessageDto(
                    null,
                    dto.conversationId(),
                    userId,
                    senderType,
                    dto.content(),
                    false,
                    null,
                    storageClient.getAvatarUrl(userId) // THÊM AVATAR
            );

            Message msg = chatService.saveMessage(fixedDto);
            log.info("MESSAGE SAVED | id: {}", msg.getId());

            // BROADCAST ĐẦY ĐỦ
            MessageDto broadcastDto = MessageDto.from(msg, storageClient.getAvatarUrl(msg.getSenderId()));
            messagingTemplate.convertAndSend(
                    "/topic/conversation." + dto.conversationId(),
                    broadcastDto
            );
            log.info("BROADCASTED to /topic/conversation.{}", dto.conversationId());

        } catch (Exception e) {
            log.error("ERROR IN WS SEND: {}", e.getMessage(), e);
        }
    }

    @MessageMapping("/chat.read")
    public void markAsRead(@Payload ReadRequest req) {
        Long userId = currentUserService.getCurrentUserId();
        String userType = currentUserService.getCurrentSenderType();

        if (!userId.equals(req.userId()) || !userType.equals(req.userType())) {
            log.warn("UNAUTHORIZED READ | expected: {}/{}, got: {}/{}", userId, userType, req.userId(), req.userType());
            return;
        }

        log.info("MARK AS READ | conv: {}, user: {}", req.conversationId(), userId);
        chatService.markAsRead(req.conversationId(), userId, userType);

        messagingTemplate.convertAndSend(
                "/topic/conversation." + req.conversationId() + ".read",
                req
        );
        log.info("READ BROADCASTED");
    }
}