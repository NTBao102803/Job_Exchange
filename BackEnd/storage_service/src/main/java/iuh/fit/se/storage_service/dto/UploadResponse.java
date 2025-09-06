package iuh.fit.se.storage_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadResponse {
    private String fileName;
    private String url;
}
