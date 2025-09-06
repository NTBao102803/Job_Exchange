package iuh.fit.se.storage_service.repository;

import iuh.fit.se.storage_service.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
}
