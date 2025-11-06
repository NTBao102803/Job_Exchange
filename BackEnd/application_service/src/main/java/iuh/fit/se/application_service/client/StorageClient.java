package iuh.fit.se.application_service.client;

import iuh.fit.se.application_service.dto.StorageResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "storage-service", path = "/api/storage")
public interface StorageClient {

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    StorageResponse uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("category") String category
    );
    @GetMapping("/file")
    StorageResponse getFileUrl(@RequestParam("objectName") String objectName);
    @GetMapping("/download")
    ResponseEntity<byte[]> downloadFile(@RequestParam("objectName") String objectName);
}
