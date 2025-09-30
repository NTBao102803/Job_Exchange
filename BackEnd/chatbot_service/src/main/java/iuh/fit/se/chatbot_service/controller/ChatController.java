package iuh.fit.se.chatbot_service.controller;

import iuh.fit.se.chatbot_service.dto.ChatRequest;
import iuh.fit.se.chatbot_service.dto.ChatResponse;
import iuh.fit.se.chatbot_service.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatService.chat(request);
    }
}
