package iuh.fit.se.message_service.controller;

import iuh.fit.se.message_service.client.StorageClient;
import iuh.fit.se.message_service.config.FeignTokenInterceptor;
import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.dto.OpenConversationRequest;
import iuh.fit.se.message_service.dto.ReadRequest;
import iuh.fit.se.message_service.entity.Message;
import iuh.fit.se.message_service.service.ChatService;
import iuh.fit.se.message_service.service.MessageService;
import iuh.fit.se.message_service.service.TokenParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final StorageClient storageClient;
    private final TokenParser tokenParser;     // THÊM
    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageDto dto, SimpMessageHeaderAccessor headers) {
        try {
            String token = (String) headers.getSessionAttributes().get("token");
            if (token == null) {
                log.error("NO TOKEN IN SESSION");
                return;
            }

            FeignTokenInterceptor.setToken(token);

            Message msg = messageService.saveMessage(dto, token);
            log.info("MESSAGE SAVED | id: {}", msg.getId());

            // BROADCAST VỚI fromSelf = false (người nhận sẽ thấy)
            MessageDto broadcastDto = MessageDto.from(msg, storageClient.getAvatarUrl(msg.getSenderId()), false);
            messagingTemplate.convertAndSend("/topic/conversation." + dto.conversationId(), broadcastDto);

        } catch (Exception e) {
            log.error("ERROR IN WS SEND: {}", e.getMessage(), e);
        } finally {
            FeignTokenInterceptor.clear();
        }
    }
    @MessageMapping("/chat.open")
    public void openConversation(@Payload OpenConversationRequest req, SimpMessageHeaderAccessor headers) {
        String token = (String) headers.getSessionAttributes().get("token");
        if (token == null) return;

        Long userId = tokenParser.extractEntityId(token);
        String userType = tokenParser.extractSenderType(token);

        List<MessageDto> messages = chatService.getMessages(req.conversationId(), userId, userType);
        messagingTemplate.convertAndSendToUser(
                headers.getSessionId(),
                "/queue/messages",
                messages
        );
    }
}