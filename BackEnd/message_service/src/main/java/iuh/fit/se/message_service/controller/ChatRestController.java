package iuh.fit.se.message_service.controller;

import iuh.fit.se.message_service.client.EmployerClient;
import iuh.fit.se.message_service.client.StorageClient;
import iuh.fit.se.message_service.client.UserClient;
import iuh.fit.se.message_service.dto.ConversationDto;
import iuh.fit.se.message_service.dto.CreateConversationRequest;
import iuh.fit.se.message_service.dto.MessageDto;
import iuh.fit.se.message_service.service.ChatService;
import iuh.fit.se.message_service.service.MessageService;
import iuh.fit.se.message_service.service.TokenParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class ChatRestController {

    private final ChatService chatService;
    private final UserClient userClient;
    private final EmployerClient employerClient;
    private final TokenParser tokenParser;
    private final MessageService messageService;
    private final StorageClient storageClient;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDto> createConversation(@RequestBody CreateConversationRequest req) {
        Long candidateId = userClient.getCandidateByEmail().getId();
        log.info("CREATE CONVERSATION | candidateId: {}, jobId: {}", candidateId, req.jobId());
        ConversationDto dto = chatService.createOrGetConversation(candidateId, req.jobId());
        log.info("CONVERSATION CREATED | id: {}", dto.id());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        String token = (String) SecurityContextHolder.getContext()
                .getAuthentication().getCredentials();

        Long entityId = tokenParser.extractEntityId(token);
        String userType = tokenParser.extractSenderType(token);
        log.info("GET CONVERSATIONS | userId: {}, userType: {}", entityId, userType);
        List<ConversationDto> list = chatService.getConversations(userType, entityId);
        log.info("RETURNED {} conversations", list.size());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable Long id) {
        String token = (String) SecurityContextHolder.getContext()
                .getAuthentication().getCredentials();

        Long userId = tokenParser.extractEntityId(token);
        String userType = tokenParser.extractSenderType(token);

        List<MessageDto> messages = chatService.getMessages(id, userId, userType);
        return ResponseEntity.ok(messages);
    }
    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getTotalUnreadCount() {
        String token = (String) SecurityContextHolder.getContext()
                .getAuthentication().getCredentials();

        Long entityId = tokenParser.extractEntityId(token);
        String userType = tokenParser.extractSenderType(token);

        log.info("GET TOTAL UNREAD COUNT for | userId: {}, userType: {}", entityId, userType);

        // Gọi phương thức từ ChatService
        int count = chatService.getTotalUnreadCount(userType, entityId);

        log.info("TOTAL UNREAD COUNT: {}", count);
        return ResponseEntity.ok(count);
    }
}
