package iuh.fit.se.storage_service.service.impl;

import io.minio.*;
import io.minio.http.Method;
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

import java.io.IOException;
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

    @Value("${minio.url}")
    private String minioUrl; // ví dụ http://localhost:9000

    private String buildFileUrl(String objectName, String category) {
        try {
            // Nếu là ảnh đại diện → tạo URL public tạm thời (presigned)
            if ("AVATAR".equalsIgnoreCase(category)) {
                return minioClient.getPresignedObjectUrl(
                        GetPresignedObjectUrlArgs.builder()
                                .bucket(bucketName)
                                .object(objectName)
                                .method(Method.GET)
                                .expiry(7 * 24 * 60 * 60) // 7 ngày
                                .build()
                );
            }

            // Ngược lại (CV, PDF, DOCX...) → dùng link trực tiếp
            return String.format("%s/%s/%s", minioUrl, bucketName, objectName);

        } catch (Exception e) {
            log.warn("⚠️ Không tạo được presigned URL cho objectName={}: {}", objectName, e.getMessage());
            return String.format("%s/%s/%s", minioUrl, bucketName, objectName);
        }
    }

    @Override
    public FileResponse storeFile(MultipartFile file, Long userId, String category) throws IOException {
        try {
            String objectName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Tìm file cũ cùng category
            StoredFile stored = fileRepository.findByUserIdAndCategoryIgnoreCase(userId, category.trim())
                    .map(existing -> {
                        // Xóa file cũ trong MinIO
                        try {
                            if (existing.getObjectName() != null) {
                                minioClient.removeObject(RemoveObjectArgs.builder()
                                        .bucket(bucketName)
                                        .object(existing.getObjectName())
                                        .build());
                                log.info("✅ Đã xóa file cũ: {}", existing.getObjectName());
                            }
                        } catch (Exception ex) {
                            log.warn("⚠️ Không thể xóa file cũ trong MinIO: {}", ex.getMessage());
                        }

                        existing.setFileName(file.getOriginalFilename());
                        existing.setFileType(file.getContentType());
                        existing.setObjectName(objectName);
                        existing.setCategory(category.trim());
                        existing.setUploadedAt(LocalDateTime.now());
                        return fileRepository.save(existing);
                    })
                    .orElseGet(() -> fileRepository.save(
                            StoredFile.builder()
                                    .userId(userId)
                                    .fileName(file.getOriginalFilename())
                                    .fileType(file.getContentType())
                                    .objectName(objectName)
                                    .category(category.trim())
                                    .uploadedAt(LocalDateTime.now())
                                    .build()
                    ));

            // Upload file mới lên MinIO
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );

            return new FileResponse(
                    stored.getId(),
                    stored.getFileName(),
                    stored.getObjectName(),
                    buildFileUrl(objectName, category),
                    stored.getCategory()
            );

        } catch (Exception e) {
            log.error("❌ Lỗi upload file MinIO: {}", e.getMessage(), e);
            throw new IOException("Upload file thất bại", e);
        }
    }

    @Override
    public Optional<FileResponse> getFile(Long userId, String category) {
        return fileRepository.findByUserIdAndCategoryIgnoreCase(userId, category.trim())
                .map(f -> new FileResponse(
                        f.getId(),
                        f.getFileName(),
                        f.getObjectName(),
                        f.getObjectName() != null ? buildFileUrl(f.getObjectName(), f.getCategory()) : null,
                        f.getCategory()
                ));
    }

    @Override
    public FileResponse initStorage(Long userId, String category) {
        StoredFile stored = fileRepository.findByUserIdAndCategoryIgnoreCase(userId, category.trim())
                .orElse(fileRepository.save(
                        StoredFile.builder()
                                .userId(userId)
                                .category(category)
                                .uploadedAt(LocalDateTime.now())
                                .build()
                ));

        String url = stored.getObjectName() != null ? buildFileUrl(stored.getObjectName(), stored.getCategory()) : null;

        return new FileResponse(
                stored.getId(),
                stored.getFileName(),
                stored.getObjectName(),
                url,
                stored.getCategory()
        );
    }

    @Override
    public byte[] downloadFile(String objectName) throws Exception {
        try (GetObjectResponse response = minioClient.getObject(GetObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build())) {
            return IOUtils.toByteArray(response);
        } catch (Exception e) {
            log.error("❌ Lỗi download file từ MinIO: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public Optional<String> getAvatarUrl(Long userId) {
        return fileRepository.findByUserIdAndCategoryIgnoreCase(userId, "AVATAR")
                .map(file -> {
                    try {
                        return minioClient.getPresignedObjectUrl(
                                GetPresignedObjectUrlArgs.builder()
                                        .bucket(bucketName)
                                        .object(file.getObjectName())
                                        .method(Method.GET)
                                        .expiry(7 * 24 * 60 * 60) // 7 ngày
                                        .build()
                        );
                    } catch (Exception e) {
                        log.error("❌ Lỗi tạo presigned URL cho avatar userId={}: {}", userId, e.getMessage());
                        return null;
                    }
                });
    }

    public FileResponse getFileByObjectName(String objectName) {
        StoredFile file = fileRepository.findByObjectName(objectName)
                .orElseThrow(() -> new RuntimeException("File not found with objectName: " + objectName));

        return new FileResponse(
                file.getId(),
                file.getFileName(),
                file.getObjectName(),
                buildFileUrl(file.getObjectName(), file.getCategory()),
                file.getCategory()
        );
    }
}
