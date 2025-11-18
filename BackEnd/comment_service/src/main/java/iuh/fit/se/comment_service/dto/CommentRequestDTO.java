package iuh.fit.se.comment_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequestDTO {
    private Long employerId;
    private Long userId;
    private String authorName;
    private String role;
    private String content;
    private Integer rating;
    private LocalDateTime createdAt; // chỉ có nếu là CANDIDATE
    private Long parentId;  // nếu là reply
}

