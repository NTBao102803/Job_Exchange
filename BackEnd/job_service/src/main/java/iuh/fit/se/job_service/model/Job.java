package iuh.fit.se.job_service.model;

import iuh.fit.se.job_service.service.impl.JobRequirementsConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    @Convert(converter = JobRequirementsConverter.class)
    private JobRequirements requirements; // Yêu cầu ứng viên

    @Column(length = 3000)
    private String benefits; // Quyền lợi

    private String rejectReason;

    @Enumerated(EnumType.STRING)
    private JobStatus status; // Trạng thái tin (PENDING, APPROVED, EXPIRED...)

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
