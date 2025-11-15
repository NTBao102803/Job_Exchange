package iuh.fit.se.message_service.controller;

import iuh.fit.se.message_service.dto.ConversationDto;
import iuh.fit.se.message_service.dto.CreateConversationRequest;
import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.service.ChatService;
import iuh.fit.se.message_service.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class ChatRestController {

    private final ChatService chatService;
    private final CurrentUserService currentUserService;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> createConversation(@RequestBody CreateConversationRequest req) {
        Long candidateId = currentUserService.getCurrentUserId();
        log.info("CREATE CONVERSATION | candidateId: {}, jobId: {}", candidateId, req.jobId());
        ConversationDto dto = chatService.createOrGetConversation(candidateId, req.jobId());
        log.info("CONVERSATION CREATED | id: {}", dto.id());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        Long userId = currentUserService.getCurrentUserId();
        String userType = currentUserService.getCurrentSenderType();
        log.info("GET CONVERSATIONS | userId: {}, userType: {}", userId, userType);
        List<ConversationDto> list = chatService.getConversations(userType, userId);
        log.info("RETURNED {} conversations", list.size());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long id) {
        log.info("GET MESSAGES | conversationId: {}", id);
        List<MessageDto> messages = chatService.getMessages(id);
        log.info("RETURNED {} messages", messages.size());
        return ResponseEntity.ok(messages);
    }
}
