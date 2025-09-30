package iuh.fit.se.application_service.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StorageResponse {
    private String fileName;
    private String objectName;
    private String fileUrl;
    private String category;
}
