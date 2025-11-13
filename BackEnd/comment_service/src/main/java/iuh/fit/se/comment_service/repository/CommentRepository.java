package iuh.fit.se.comment_service.repository;

import iuh.fit.se.comment_service.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByEmployerIdAndParentIsNullOrderByCreatedAtDesc(Long employerId);
}
