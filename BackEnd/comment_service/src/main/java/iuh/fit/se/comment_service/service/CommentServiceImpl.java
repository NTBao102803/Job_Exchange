package iuh.fit.se.comment_service.service;

import iuh.fit.se.comment_service.config.JwtUtil;
import iuh.fit.se.comment_service.dto.CommentRequestDTO;
import iuh.fit.se.comment_service.dto.CommentResponseDTO;
import iuh.fit.se.comment_service.entity.Comment;
import iuh.fit.se.comment_service.repository.CommentRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final JwtUtil jwtUtil;

    @Override
    public CommentResponseDTO createComment(CommentRequestDTO dto, String token) {
        if (token.startsWith("Bearer ")) token = token.substring(7);

        Claims claims = jwtUtil.extractAllClaims(token);
        Long userId = claims.get("id", Long.class);
        String role = claims.get("roleName", String.class);

        Comment parent = null;
        if (dto.getParentId() != null) {
            parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .employerId(dto.getEmployerId())
                .userId(dto.getUserId())
                .authorName(dto.getAuthorName())
                .role(role)
                .content(dto.getContent())
                .rating( dto.getRating())
                .createdAt(LocalDateTime.now())
                .parent(parent)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    @Override
    public List<CommentResponseDTO> getCommentsByEmployer(Long employerId) {
        // Lấy các comment cha (parent = null) và map tree
        return commentRepository.findByEmployerIdAndParentIsNullOrderByCreatedAtDesc(employerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CommentResponseDTO mapToResponse(Comment c) {
        return CommentResponseDTO.builder()
                .id(c.getId())
                .employerId(c.getEmployerId())
                .userId(c.getUserId())
                .authorName(c.getAuthorName())
                .role(c.getRole())
                .content(c.getContent())
                .rating(c.getRating())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .createdAt(c.getCreatedAt())
                .replies(c.getReplies() == null ? List.of() :
                        c.getReplies().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList()))
                .build();
    }
}
