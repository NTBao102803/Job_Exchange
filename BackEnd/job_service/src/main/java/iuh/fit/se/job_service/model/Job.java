package iuh.fit.se.job_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tham chiếu đến Employer trong employer-service
    private Long employerId;

    @Column(nullable = false)
    private String title; // Tiêu đề công việc

    @Enumerated(EnumType.STRING)
    private JobType jobType; // Loại việc (full-time, part-time, internship...)

    private String location; // Địa điểm (user nhập trong form)

    private String salary; // Mức lương (có thể lưu String cho dễ biểu diễn, VD: "15 - 20 triệu")

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 5000)
    private String description; // Mô tả công việc

    @Column(length = 5000)
    private String requirements; // Yêu cầu ứng viên

    @Column(length = 3000)
    private String benefits; // Quyền lợi

    private String rejectReason;

    @Enumerated(EnumType.STRING)
    private JobStatus status; // Trạng thái tin (PENDING, APPROVED, EXPIRED...)

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
