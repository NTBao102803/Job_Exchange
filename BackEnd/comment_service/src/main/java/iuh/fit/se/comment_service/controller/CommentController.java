package iuh.fit.se.comment_service.controller;

import iuh.fit.se.comment_service.dto.CommentRequestDTO;
import iuh.fit.se.comment_service.dto.CommentResponseDTO;
import iuh.fit.se.comment_service.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<Void> createComment(
            @RequestBody CommentRequestDTO dto,
            @RequestHeader("Authorization") String token) {

        // 1️⃣ Lưu comment vào DB
        CommentResponseDTO comment = commentService.createComment(dto, token);

        // 2️⃣ Gửi comment thật qua WebSocket
        messagingTemplate.convertAndSend(
                "/topic/comments/" + dto.getEmployerId(),
                comment
        );

        // Tab gửi sẽ nhận WS → tránh duplicate → không trả trực tiếp comment
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{employerId}")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long employerId) {
        List<CommentResponseDTO> comments = commentService.getCommentsByEmployer(employerId);
        return ResponseEntity.ok(comments);
    }
}
