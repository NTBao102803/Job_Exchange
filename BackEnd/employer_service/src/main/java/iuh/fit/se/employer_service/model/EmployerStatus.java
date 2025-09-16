package iuh.fit.se.employer_service.model;

public enum EmployerStatus {
    PENDING,   // chờ duyệt
    APPROVED,  // đã duyệt
    REJECTED,   // bị từ chối
    WAITING_OTP,
    WAITING_APPROVAL
}
