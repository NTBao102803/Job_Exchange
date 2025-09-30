package iuh.fit.se.storage_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "file_metadata")
@Data
public class FileMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String fileName;
    private String fileType;
    private String url;
}
