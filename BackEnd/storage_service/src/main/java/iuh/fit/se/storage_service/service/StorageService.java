package iuh.fit.se.storage_service.service;

import org.springframework.web.multipart.MultipartFile;
import iuh.fit.se.storage_service.dto.UploadResponse;

public interface StorageService {
    UploadResponse uploadFile(Long userId, MultipartFile file);
    byte[] downloadFile(Long fileId);
    void deleteFile(Long fileId);
    void createDefaultFolder(Long userId);
}
