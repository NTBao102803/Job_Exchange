package iuh.fit.se.comment_service.dto;


import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponseDTO {
    private Long id;
    private Long employerId;
    private Long userId;
    private String authorName;
    private String role;
    private String content;
    private Integer rating;
    private Long parentId;
    private LocalDateTime createdAt;
    private List<CommentResponseDTO> replies;
}

