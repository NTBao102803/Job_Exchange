package iuh.fit.se.storage_service.service.impl;

import iuh.fit.se.storage_service.dto.UploadResponse;
import iuh.fit.se.storage_service.model.FileMetadata;
import iuh.fit.se.storage_service.repository.FileMetadataRepository;
import iuh.fit.se.storage_service.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class StorageServiceImpl implements StorageService {

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    private static final String BASE_PATH = "/data/storage/";

    @Override
    public UploadResponse uploadFile(Long userId, MultipartFile file) {
        try {
            File userFolder = new File(BASE_PATH + userId);
            if (!userFolder.exists()) userFolder.mkdirs();

            Path filePath = Path.of(userFolder.getPath(), file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            FileMetadata metadata = new FileMetadata();
            metadata.setUserId(userId);
            metadata.setFileName(file.getOriginalFilename());
            metadata.setFileType(file.getContentType());
            metadata.setUrl(filePath.toString());
            fileMetadataRepository.save(metadata);

            return new UploadResponse(file.getOriginalFilename(), filePath.toString());
        } catch (IOException e) {
            throw new RuntimeException("Upload file thất bại", e);
        }
    }

    @Override
    public byte[] downloadFile(Long fileId) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        try {
            return Files.readAllBytes(Path.of(metadata.getUrl()));
        } catch (IOException e) {
            throw new RuntimeException("Download file thất bại", e);
        }
    }

    @Override
    public void deleteFile(Long fileId) {
        FileMetadata metadata = fileMetadataRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        File file = new File(metadata.getUrl());
        if (file.exists()) file.delete();
        fileMetadataRepository.delete(metadata);
    }

    @Override
    public void createDefaultFolder(Long userId) {
        File userFolder = new File(BASE_PATH + userId);
        if (!userFolder.exists()) {
            userFolder.mkdirs();
            System.out.println("Tạo thư mục mặc định cho user: " + userId);
        }
    }
}
