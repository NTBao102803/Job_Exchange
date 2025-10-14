package iuh.fit.se.storage_service.controller;

import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import iuh.fit.se.storage_service.dto.FileResponse;
import iuh.fit.se.storage_service.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
@Slf4j
public class StorageController {

    private final FileStorageService fileStorageService;

    // API upload file (update record đã init)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("category") String category) throws IOException {
        return ResponseEntity.ok(fileStorageService.storeFile(file, userId, category));
    }

    @GetMapping("/file")
    public FileResponse getFileByObjectName(@RequestParam String objectName) {
        return fileStorageService.getFileByObjectName(objectName);
    }

    // API lấy file theo userId + category
    @GetMapping("/user/{userId}/file")
    public ResponseEntity<FileResponse> getFile(
            @PathVariable Long userId,
            @RequestParam String category) {
        log.info("📥 API GET file: userId={}, category='{}'", userId, category);

        return fileStorageService.getFile(userId, category)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("🚫 API trả về 404 NOT FOUND cho userId={}, category='{}'", userId, category);
                    return ResponseEntity.notFound().build();
                });
    }

    // API tạo profile rỗng
    @PostMapping("/init")
    public ResponseEntity<Void> initStorage(@RequestParam Long userId,
                                                    @RequestParam String category) {
        // vẫn gọi service để tạo/lưu fileResponse
        fileStorageService.initStorage(userId, category);

        // nhưng không trả về dữ liệu, chỉ báo 204 No Content
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/avatar-url")
    public ResponseEntity<String> getAvatarUrl(@RequestParam Long userId) {
        log.info("Lấy avatar URL cho userId={}", userId);
        return fileStorageService.getAvatarUrl(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(null));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam String objectName) {
        try {
            byte[] content = fileStorageService.downloadFile(objectName);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + objectName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(content);

        } catch (Exception e) {
            log.error("❌ Lỗi download file: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }
}
