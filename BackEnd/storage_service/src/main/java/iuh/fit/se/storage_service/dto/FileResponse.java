package iuh.fit.se.storage_service.dto;

public record FileResponse(
        Long id,              // ID trong DB
        String fileName,      // tên gốc
        String objectName,    // tên trong MinIO
        String fileUrl,       // link public/download
        String category       // phân loại (CV, IMAGE, ...)
) {
}