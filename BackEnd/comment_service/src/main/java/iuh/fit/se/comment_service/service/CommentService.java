package iuh.fit.se.comment_service.service;

import iuh.fit.se.comment_service.dto.*;
import java.util.List;

public interface CommentService {
    CommentResponseDTO createComment(CommentRequestDTO dto, String token);
    List<CommentResponseDTO> getCommentsByEmployer(Long employerId);
}
