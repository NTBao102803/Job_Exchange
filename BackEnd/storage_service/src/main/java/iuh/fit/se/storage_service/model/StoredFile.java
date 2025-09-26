package iuh.fit.se.storage_service.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "files")
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StoredFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;          // user/candidate id
    private String fileName;      // tên gốc (nullable nếu chưa upload)
    private String fileType;      // MIME type (nullable nếu chưa upload)
    private String fileUrl;       // đường dẫn public (nullable nếu chưa upload)
    private String category;      // CV, AVATAR, OTHER
    private LocalDateTime uploadedAt;
}
