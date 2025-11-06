package iuh.fit.se.storage_service.repository;

import iuh.fit.se.storage_service.model.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<StoredFile, Long> {
    List<StoredFile> findByUserId(Long userId);
    // bỏ phân biệt hoa thường
    Optional<StoredFile> findByUserIdAndCategoryIgnoreCase(Long userId, String category);
    Optional<StoredFile> findByObjectName(String objectName);
}
