package iuh.fit.se.storage_service.controller;

import iuh.fit.se.storage_service.dto.UploadResponse;
import iuh.fit.se.storage_service.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    @PostMapping("/upload/{userId}")
    public ResponseEntity<UploadResponse> uploadFile(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(storageService.uploadFile(userId, file));
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) {
        byte[] data = storageService.downloadFile(fileId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"file\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable Long fileId) {
        storageService.deleteFile(fileId);
        return ResponseEntity.ok("Xóa file thành công");
    }
}
