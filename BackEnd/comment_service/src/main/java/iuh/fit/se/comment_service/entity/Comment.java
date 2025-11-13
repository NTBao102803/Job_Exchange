package iuh.fit.se.comment_service.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employerId;   // id của nhà tuyển dụng được bình luận
    private Long userId;       // id của người bình luận (ứng viên hoặc recruiter)
    private String authorName; // tên người bình luận
    private String role;       // CANDIDATE hoặc RECRUITER

    @Column(columnDefinition = "TEXT")
    private String content;

    private Integer rating;    // bắt buộc nếu là CANDIDATE
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;    // comment cha (nếu là reply)

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> replies;
}

