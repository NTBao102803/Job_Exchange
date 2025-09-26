package iuh.fit.se.storage_service.service.impl;

import io.minio.*;
import iuh.fit.se.storage_service.dto.FileResponse;
import iuh.fit.se.storage_service.model.StoredFile;
import iuh.fit.se.storage_service.repository.FileRepository;
import iuh.fit.se.storage_service.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {
    private final FileRepository fileRepository;
    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;

    @Override
    public FileResponse storeFile(MultipartFile file, Long userId, String category) throws IOException {
        try {
            // Tạo tên file duy nhất để tránh trùng lặp
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Kiểm tra DB xem có file cũ không
            Optional<StoredFile> optionalStored = fileRepository.findByUserIdAndCategoryIgnoreCase(userId, category.trim());

            if (optionalStored.isPresent()) {
                StoredFile existing = optionalStored.get();

                // Xóa file cũ trong MinIO (nếu tồn tại)
                try {
                    minioClient.removeObject(
                            RemoveObjectArgs.builder()
                                    .bucket(bucketName)
                                    .object(existing.getFileUrl()) // lưu ý: fileUrl đang chính là objectName
                                    .build()
                    );
                    log.info("✅ Đã xóa file cũ trong MinIO: {}", existing.getFileUrl());
                } catch (Exception ex) {
                    log.warn("⚠️ Không xóa được file cũ trong MinIO: {}", ex.getMessage());
                }

                // Cập nhật DB với file mới
                existing.setFileName(file.getOriginalFilename());
                existing.setFileType(file.getContentType());
                existing.setFileUrl(fileName);
                existing.setUploadedAt(LocalDateTime.now());
                fileRepository.save(existing);

            } else {
                // Chưa có file → tạo mới
                StoredFile newFile = StoredFile.builder()
                        .userId(userId)
                        .fileName(file.getOriginalFilename())
                        .fileType(file.getContentType())
                        .fileUrl(fileName)
                        .category(category.trim())
                        .uploadedAt(LocalDateTime.now())
                        .build();
                fileRepository.save(newFile);
            }

            // Upload file mới lên MinIO
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return new FileResponse(null, fileName, category); // có thể trả id nếu cần

        } catch (Exception e) {
            log.error("❌ Lỗi upload file MinIO: {}", e.getMessage(), e);
            throw new IOException("Upload file thất bại", e);
        }
    }


    @Override
    public Optional<FileResponse> getFile(Long userId, String category) {
        return fileRepository.findByUserIdAndCategoryIgnoreCase(userId, category.trim())
                .map(f -> new FileResponse(f.getId(), f.getFileUrl(), f.getCategory()));
    }

    @Override
    public FileResponse initStorage(Long userId, String category) {
        StoredFile stored = fileRepository.findByUserIdAndCategoryIgnoreCase(userId, category.trim())
                .orElse(
                        fileRepository.save(
                                StoredFile.builder()
                                        .userId(userId)
                                        .category(category)
                                        .fileName(null)
                                        .fileType(null)
                                        .fileUrl(null)
                                        .uploadedAt(LocalDateTime.now())
                                        .build()
                        )
                );
        return new FileResponse(stored.getId(), stored.getFileUrl(), stored.getCategory());
    }
    @Override
    public byte[] downloadFile(String objectName) throws Exception {
        try (GetObjectResponse response = minioClient.getObject(
                GetObjectArgs.builder()
                        .bucket(bucketName)
                        .object(objectName)
                        .build()
        )) {
            return IOUtils.toByteArray(response);
        } catch (Exception e) {
            log.error("❌ Lỗi download file từ MinIO: {}", e.getMessage(), e);
            throw e; // để controller xử lý tiếp
        }
    }
}
