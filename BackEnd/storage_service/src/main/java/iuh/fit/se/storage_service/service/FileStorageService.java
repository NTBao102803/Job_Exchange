package iuh.fit.se.storage_service.service;

import iuh.fit.se.storage_service.dto.FileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface FileStorageService {
    public Optional<FileResponse> getFile(Long userId, String category);
    public FileResponse storeFile(MultipartFile file, Long userId, String category) throws IOException;
    public FileResponse initStorage(Long userId, String category);
    byte[] downloadFile(String objectName) throws Exception;
    public FileResponse getFileByObjectName(String objectName);
    Optional<String> getAvatarUrl(Long userId);
}
