package iuh.fit.se.job_service.dto;

public enum EmployerStatus {
    PENDING,   // chờ duyệt
    APPROVED,  // đã duyệt
    REJECTED,   // bị từ chối
    WAITING_OTP,
    WAITING_APPROVAL
}
