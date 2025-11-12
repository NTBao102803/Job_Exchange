SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Dumping database structure for application_db
CREATE DATABASE IF NOT EXISTS `application_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `application_db`;

-- Dumping structure for table application_db.applications
CREATE TABLE IF NOT EXISTS `applications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `applied_at` datetime(6) DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  `cv_file_name` varchar(255) DEFAULT NULL,
  `cv_object_name` varchar(255) DEFAULT NULL,
  `job_id` bigint(20) DEFAULT NULL,
  `reject_reason` text DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table application_db.applications: ~12 rows (approximately)
INSERT INTO `applications` (`id`, `applied_at`, `candidate_id`, `cv_file_name`, `cv_object_name`, `job_id`, `reject_reason`, `status`) VALUES
	(1, '2025-10-01 15:26:47.469271', 3, '241223 - Ke Hoach TTDN - HK2 2024.pdf', '616477ab-1664-4704-9a3d-f2cb992e1900_241223 - Ke Hoach TTDN - HK2 2024.pdf', 12, NULL, 'PENDING'),
	(2, '2025-10-01 15:27:25.423425', 3, '241223 - Ke Hoach TTDN - HK2 2024.pdf', '8adaf31a-a032-4323-b96e-9813a94179c4_241223 - Ke Hoach TTDN - HK2 2024.pdf', 5, NULL, 'PENDING'),
	(6, '2025-10-29 22:00:04.279584', 32, 'SSRC_TeachMe.pdf', 'f0e01102-a63e-45de-83d7-83764bbbfe2b_SSRC_TeachMe.pdf', 1, NULL, 'PENDING'),
	(9, '2025-10-31 18:14:45.931868', 32, '[KLTN]_N061_BangKeHoach.docx', 'af6213c8-ce9e-46cd-b6e1-a636c150dd71_[KLTN]_N061_BangKeHoach.docx', 5, NULL, 'APPROVED'),
	(10, '2025-10-31 18:40:39.957029', 32, 'Bảng khảo sát .docx', 'f1ad9bc3-984f-4bdd-9462-60e2accf7f13_Bảng khảo sát .docx', 7, NULL, 'REJECTED'),
	(11, '2025-10-31 18:43:58.883364', 3, 'SSRC_TeachMe.pdf', 'b5fb5743-c455-44e8-a65b-c8b7076399b8_SSRC_TeachMe.pdf', 7, NULL, 'APPROVED'),
	(12, '2025-11-04 16:12:20.244602', 5, 'SSRC_TeachMe.pdf', 'bee16153-86da-4fbf-b6bc-1e01fe926a8f_SSRC_TeachMe.pdf', 7, NULL, 'PENDING'),
	(13, '2025-11-04 16:13:01.859896', 6, 'CMM_CMMI_SoSanh_ISOvsCMM.docx', '349d4d0e-04cd-41f1-89f2-3f9f92eb0f8a_CMM_CMMI_SoSanh_ISOvsCMM.docx', 7, NULL, 'PENDING'),
	(14, '2025-11-04 17:24:47.343040', 32, 'SSRC_TeachMe.pdf', '89b1f849-9b38-40eb-a378-e57e00a036c8_SSRC_TeachMe.pdf', 7, NULL, 'REJECTED'),
	(15, '2025-11-04 17:26:18.306618', 32, 'CV-Nguyễn_Thái_Bảo-đã nén.pdf', '6a4ad257-e6a0-49b3-861a-b06457279f57_CV-Nguyễn_Thái_Bảo-đã nén.pdf', 7, NULL, 'APPROVED'),
	(16, '2025-11-05 15:58:28.997537', 32, 'CV-Nguyễn_Thái_Bảo-đã nén.pdf', '6dd34dfa-75d8-4cf7-a45d-79a53c6a76eb_CV-Nguyễn_Thái_Bảo-đã nén.pdf', 5, NULL, 'REJECTED'),
	(17, '2025-11-05 16:03:10.103912', 32, 'PhanTichChucNangHeThong.docx', 'a05d74b0-6f23-4c24-98cd-4eddc0166bb8_PhanTichChucNangHeThong.docx', 6, NULL, 'PENDING');


-- Dumping database structure for employer_db
CREATE DATABASE IF NOT EXISTS `employer_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `employer_db`;

-- Dumping structure for table employer_db.employers
CREATE TABLE IF NOT EXISTS `employers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `auth_user_id` bigint(20) DEFAULT NULL,
  `business_license` varchar(255) DEFAULT NULL,
  `company_address` varchar(255) DEFAULT NULL,
  `company_description` varchar(2000) DEFAULT NULL,
  `company_field` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_size` varchar(255) DEFAULT NULL,
  `company_social` varchar(255) DEFAULT NULL,
  `company_website` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','WAITING_APPROVAL','WAITING_OTP') DEFAULT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqc5dry5qy5prsgul22acrt8am` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table employer_db.employers: ~3 rows (approximately)
INSERT INTO `employers` (`id`, `auth_user_id`, `business_license`, `company_address`, `company_description`, `company_field`, `company_name`, `company_size`, `company_social`, `company_website`, `email`, `full_name`, `phone`, `position`, `status`, `tax_code`) VALUES
	(1, 2, '032165465', 'Quận 3, TP. Hồ Chí Minh', 'Chuyên cung cấp giải pháp phần mềm quản lý doanh nghiệp, tích hợp AI/ML và dịch vụ Cloud.', 'Công nghệ thông tin', 'Công ty TNHH Công Nghệ ABC', '100-500 nhân viên', 'linkedin.com/company/abc-tech', 'www.abctech.com.vn', 'nguyenthaibao9a1tg2017@gmail.com', 'Nguyễn Thái Bảo', '0387776610', 'Giám đốc điều hành', 'PENDING', '032165465'),
	(2, 20, '0912345678', 'Quận 1, TP. Hồ Chí Minh', 'Tập đoàn hàng đầu trong lĩnh vực sản xuất thiết bị điện tử và linh kiện công nghệ cao.', 'Sản xuất công nghiệp', 'Tập đoàn XYZ', '500-1000 nhân viên', 'linkedin.com/company/xyzcorp', 'www.xyzcorp.com', 'levantuan123@gmail.com', 'Lê Văn Tuấn', '0987654321', 'Trưởng phòng nhân sự', 'PENDING', '0912345678'),
	(3, 21, NULL, 'Thuận An, Bình Dương', 'Doanh nghiệp chuyên về xây dựng dân dụng và công nghiệp, với đội ngũ kỹ sư giàu kinh nghiệm.', 'Xây dựng - Bất động sản', 'Công ty TNHH Một Thành Viên Tuấn Kiệt', '50-100 nhân viên', 'facebook.com/tuan-kiet-construction', 'www.tuankiet.com.vn', 'nguyentuankiet111@gmail.com', 'Nguyễn Tuấn Kiệt', '0909198842', 'Giám đốc', 'REJECTED', NULL);


-- Dumping database structure for job_db
CREATE DATABASE IF NOT EXISTS `job_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `job_db`;

-- Dumping structure for table job_db.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `benefits` varchar(3000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `employer_id` bigint(20) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `job_type` enum('Fulltime','Internship','Parttime') DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `reject_reason` varchar(255) DEFAULT NULL,
  `requirements` varchar(5000) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','REMOVED') DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table job_db.jobs: ~18 rows (approximately)
INSERT INTO `jobs` (`id`, `benefits`, `created_at`, `description`, `employer_id`, `end_date`, `job_type`, `location`, `reject_reason`, `requirements`, `salary`, `start_date`, `status`, `title`, `updated_at`) VALUES
	(1, 'Bảo hiểm, thưởng Tết, hỗ trợ học phí khóa học nâng cao', '2025-09-23 14:04:04.897697', 'Phát triển dịch vụ backend cho hệ thống tuyển dụng, sử dụng Java và Spring Boot.', 1, '2025-12-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Java","Spring Boot","SQL"],"experience":"2 năm Java","certificates":"TOEIC 700","career":"Backend Developer","descriptionRequirements":"Hoạt bát, năng động"}', '15-20 triệu', '2025-10-01', 'APPROVED', 'Java Backend Developer', '2025-09-23 17:31:32.365924'),
	(2, 'Thưởng quý, du lịch hằng năm', '2025-09-23 17:03:38.784357', 'Phân tích dữ liệu để hỗ trợ quyết định kinh doanh, làm việc với Python, ML.', 1, '2025-10-03', 'Parttime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Python","Machine Learning"],"experience":"3 năm Data","certificates":"Google Analytics","career":"Data Analyst","descriptionRequirements":"Kỹ năng giao tiếp tốt"}', '20-30 triệu', '2025-09-23', 'APPROVED', 'Data Scientist', '2025-09-23 17:37:55.084538'),
	(3, 'Laptop công ty, bảo hiểm, team building mỗi quý', '2025-09-26 09:10:00.000000', 'Thiết kế và phát triển giao diện web hiện đại bằng ReactJS.', 1, '2025-11-30', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["ReactJS","HTML","CSS","Redux"],"experience":"2 năm Frontend","career":"Frontend Developer"}', '18-25 triệu', '2025-10-05', 'APPROVED', 'Frontend Developer (ReactJS)', '2025-09-26 09:10:00.000000'),
	(4, 'Bảo hiểm sức khỏe, thưởng năng suất', '2025-09-27 08:20:00.000000', 'Triển khai giải pháp DevOps, CI/CD và quản lý hệ thống Cloud.', 1, '2025-12-15', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Docker","Kubernetes","CI/CD","Linux"],"experience":"3 năm DevOps","certificates":null,"career":"DevOps Engineer","descriptionRequirements":null}', '25-35 triệu', '2025-10-10', 'APPROVED', 'DevOps Engineer', '2025-10-23 17:03:10.011236'),
	(5, 'Thưởng dự án, xe đưa đón, bảo hiểm cao cấp', '2025-09-25 14:51:43.177943', 'Tham gia phát triển phần mềm nhúng cho thiết bị điện tử.', 2, '2026-02-28', 'Fulltime', 'Quận 1, TP. Hồ Chí Minh', NULL, '{"skills":["C","C++","Embedded Systems"],"experience":"3 năm Embedded","certificates":null,"career":"Embedded Engineer","descriptionRequirements":null}', '25-35 triệu', '2025-09-25', 'APPROVED', 'Kỹ sư phần mềm nhúng', '2025-10-31 17:33:35.481487'),
	(6, 'Ăn trưa miễn phí, thưởng cuối năm', '2025-09-25 15:38:50.216851', 'Thực hiện phân tích dữ liệu sản xuất, tối ưu hóa quy trình.', 2, '2025-11-23', 'Fulltime', 'Quận 1, TP. Hồ Chí Minh', NULL, '{"skills":["SQL","Python","Excel","Power BI"],"experience":"3 năm Data Analyst","certificates":null,"career":"Data Analyst","descriptionRequirements":null}', '18-28 triệu', '2025-09-25', 'APPROVED', 'Chuyên viên Phân tích Dữ liệu', '2025-10-31 14:02:46.546413'),
	(7, 'Hỗ trợ đào tạo, cơ hội thăng tiến nhanh', '2025-09-27 10:00:00.000000', 'Thiết kế mạch điện tử cho các thiết bị công nghệ cao.', 2, '2025-12-20', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Electronics","PCB","Microcontroller"],"experience":"2 năm Hardware","certificates":null,"career":"Electronics Engineer","descriptionRequirements":null}', '22-32 triệu', '2025-10-15', 'APPROVED', 'Kỹ sư Điện tử', '2025-10-31 18:40:00.594946'),
	(8, 'Bảo hiểm, du lịch hàng năm, môi trường quốc tế', '2025-09-28 09:15:00.000000', 'Quản lý dự án sản xuất thiết bị điện tử quy mô lớn.', 2, '2025-12-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Project Management","Agile","Manufacturing"],"experience":"5 năm quản lý dự án","certificates":null,"career":"Project Manager","descriptionRequirements":null}', '30-45 triệu', '2025-10-20', 'REJECTED', 'Quản lý Dự án Sản xuất', '2025-11-04 11:37:17.372279'),
	(9, 'Hỗ trợ xăng xe, phụ cấp công trình, bảo hiểm tai nạn', '2025-09-29 08:00:00.000000', 'Quản lý thi công các công trình dân dụng và công nghiệp.', 3, '2025-12-31', 'Fulltime', 'Bình Dương', NULL, '{"skills":["Xây dựng","Quản lý dự án","An toàn lao động"],"experience":"5 năm Chỉ huy trưởng","career":"Construction Manager"}', '28-40 triệu', '2025-10-01', 'APPROVED', 'Chỉ huy trưởng công trình', '2025-09-29 08:00:00.000000'),
	(10, 'Bảo hiểm, thưởng công trình hoàn thành đúng hạn', '2025-09-29 09:30:00.000000', 'Thiết kế kết cấu công trình dân dụng.', 3, '2025-12-15', 'Fulltime', 'Bình Dương', NULL, '{"skills":["Kết cấu","AutoCAD","SAP2000"],"experience":"3 năm thiết kế","career":"Structural Engineer"}', '20-30 triệu', '2025-10-05', 'APPROVED', 'Kỹ sư Kết cấu', '2025-09-29 09:30:00.000000'),
	(11, 'Phụ cấp công trình xa, bảo hiểm tai nạn', '2025-09-30 08:15:00.000000', 'Giám sát công trình xây dựng nhà xưởng công nghiệp.', 3, '2025-12-25', 'Fulltime', 'Thuận An, Bình Dương', NULL, '{"skills":["Giám sát","Xây dựng","An toàn"],"experience":"3 năm giám sát","career":"Site Supervisor"}', '18-25 triệu', '2025-10-10', 'APPROVED', 'Giám sát công trình', '2025-09-30 08:15:00.000000'),
	(12, 'Hỗ trợ ăn ở, bảo hiểm lao động, thưởng hoàn thành công trình', '2025-09-30 10:45:00.000000', 'Triển khai bản vẽ thi công và bóc tách khối lượng.', 3, '2025-12-30', 'Fulltime', 'Bình Dương', NULL, '{"skills":["AutoCAD","Dự toán","Thi công"],"experience":"2 năm bóc tách","certificates":null,"career":"Kỹ sư Xây dựng","descriptionRequirements":null}', '15-22 triệu', '2025-10-12', 'APPROVED', 'Kỹ sư Xây dựng', '2025-10-30 11:27:32.621927'),
	(13, 'Bảo hiểm sức khỏe cao cấp, thưởng dự án, du lịch công ty hàng năm', '2025-10-01 16:23:21.037372', 'Thiết kế và phát triển các API hiệu suất cao cho hệ thống thương mại điện tử lớn.', 1, '2026-02-28', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Spring Cloud","Java","Microservices","Kafka","NoSQL"],"experience":"5 năm kinh nghiệm phát triển Java backend","certificates":"Chứng chỉ AWS Certified Developer","career":"Senior Backend Developer","descriptionRequirements":"Tư duy logic tốt, khả năng làm việc độc lập và team-work"}', '25-35 triệu', '2025-10-01', 'APPROVED', 'Senior Java Backend Developer', '2025-10-01 16:25:49.039988'),
	(14, 'Thưởng hiệu suất 2 lần/năm, trợ cấp ăn trưa, khám sức khỏe định kỳ', '2025-10-01 19:35:49.334874', 'Phát triển và bảo trì dịch vụ lõi cho nền tảng thanh toán trực tuyến.', 1, '2026-01-30', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Docker","PostgreSQL","Django","Python"],"experience":"3 năm kinh nghiệm Python/Django","certificates":"Không yêu cầu","career":"Backend Developer","descriptionRequirements":"Cẩn thận, tỉ mỉ, có trách nhiệm cao với dữ liệu"}', '18-25 triệu', '2025-10-01', 'APPROVED', 'Python Backend Developer (Fintech)', '2025-10-23 14:49:12.111501'),
	(15, 'nguyen thai bao nguyen thai bao', '2025-10-29 21:58:02.546158', 'việc nhẹ lương cao 500000000000000000000', 1, '2025-11-20', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Python","Machine Learning"],"experience":"3 nam data","certificates":"Chung chi Google Analytics","career":"Data Analyst","descriptionRequirements":"nan5g5w5555555ssssssssssssssssssssssssssssssss v1"}', '20-30 trieu', '2025-10-29', 'APPROVED', 'Lập trình', '2025-10-29 22:11:31.990396'),
	(16, 'Lương tháng 13, bảo hiểm full, hỗ trợ làm việc từ xa 2 ngày/tuần', '2025-11-07 16:55:47.752397', 'Tham gia phát triển ứng dụng web frontend bằng ReactJS và TypeScript, phối hợp với đội backend', 1, '2025-12-31', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["ReactJS","TypeScript","REST API"],"experience":"1-3 năm","certificates":"Frontend Certificate","career":"Frontend Developer","descriptionRequirements":"Thích UI/UX, tư duy logic"}', '18-25 triệu', '2025-11-07', 'PENDING', 'Frontend ReactJS Developer', '2025-11-07 16:55:47.752397'),
	(17, 'Thưởng dự án, bảo hiểm 100%, hỗ trợ chi phí học chứng chỉ AWS', '2025-11-07 17:02:15.876292', 'Thiết kế và triển khai hệ thống cloud backend sử dụng NodeJS và AWS Lambda', 1, '2025-12-28', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["NodeJS","AWS Lambda","MongoDB"],"experience":"3 năm trở lên","certificates":"AWS Certified Developer","career":"Cloud Engineer","descriptionRequirements":"Chủ động, có khả năng giải quyết vấn đề"}', '25-35 triệu', '2025-11-07', 'APPROVED', 'Cloud Backend Engineer', '2025-11-07 17:02:56.908433'),
	(18, 'Làm việc quốc tế, hỗ trợ học tiếng Anh, thưởng performance 2 lần/năm', '2025-11-07 17:06:31.822637', 'Tham gia dự án quốc tế phát triển hệ thống ERP bằng Java & Angular', 1, '2025-12-21', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Java","Angular","REST API"],"experience":"3 năm","certificates":"Fullstack Developer","career":"Fullstack Developer","descriptionRequirements":"Giao tiếp tốt, làm việc độc lập"}', '30-40 triệu', '2025-11-07', 'PENDING', 'Fullstack Java-Angular Developer', '2025-11-07 17:06:31.822637');


-- Dumping database structure for notification_db
CREATE DATABASE IF NOT EXISTS `notification_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `notification_db`;

-- Dumping structure for table notification_db.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `read_flag` bit(1) NOT NULL,
  `receiver_id` bigint(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table notification_db.notifications: ~27 rows (approximately)
INSERT INTO `notifications` (`id`, `created_at`, `message`, `read_flag`, `receiver_id`, `title`) VALUES
	(1, '2025-10-31 14:01:54.352513', 'Tin tuyển dụng Kỹ sư phần mềm nhúng của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt ✅'),
	(2, '2025-10-31 14:02:46.567057', 'Tin tuyển dụng Chuyên viên Phân tích Dữ liệu của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt ✅'),
	(3, '2025-10-31 14:03:37.998538', 'Tin tuyển dụng Kỹ sư Điện tử của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt ✅'),
	(4, '2025-10-31 14:59:56.120182', 'Tin tuyển dụng Quản lý Dự án Sản xuất của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt ✅'),
	(5, '2025-10-31 17:33:35.602867', 'Tin tuyển dụng Kỹ sư phần mềm nhúng của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt ✅'),
	(6, '2025-10-31 18:14:46.186722', 'Nguyễn Thái Bảo đã ứng tuyển vào tin "Kỹ sư phần mềm nhúng"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(7, '2025-10-31 18:40:00.674495', 'Tin tuyển dụng "Kỹ sư Điện tử" của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt'),
	(8, '2025-10-31 18:40:40.143855', 'Nguyễn Thái Bảo đã ứng tuyển vào tin "Kỹ sư Điện tử"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(9, '2025-10-31 18:43:58.901056', 'Trần Văn Lợi đã ứng tuyển vào tin "Kỹ sư Điện tử"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(10, '2025-11-04 11:37:17.461703', 'Tin "Quản lý Dự án Sản xuất" của bạn đã bị từ chối. Lý do: Không phù hợp', b'1', 2, 'Tin tuyển dụng bị từ chối'),
	(11, '2025-11-04 16:12:21.939375', 'Nguyễn Văn A đã ứng tuyển vào tin "Kỹ sư Điện tử"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(12, '2025-11-04 16:13:01.872339', 'Trần Thị B đã ứng tuyển vào tin "Kỹ sư Điện tử"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(13, '2025-11-04 17:24:47.557199', 'Nguyễn Thái Bảo đã ứng tuyển vào tin "Kỹ sư Điện tử"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(14, '2025-11-04 17:26:18.319540', 'Nguyễn Thái Bảo đã ứng tuyển vào tin "Kỹ sư Điện tử"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(15, '2025-11-05 13:51:29.322901', 'Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin "Kỹ sư Điện tử" đã được duyệt.', b'0', 6, 'Hồ sơ ứng tuyển được duyệt'),
	(16, '2025-11-05 13:52:24.252862', 'Hồ sơ ứng tuyển vào tin "Kỹ sư Điện tử" bị từ chối. Lý do: Không phù hợp', b'1', 32, 'Hồ sơ ứng tuyển bị từ chối'),
	(17, '2025-11-05 14:27:20.678931', 'Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin "Kỹ sư Điện tử" đã được duyệt.', b'1', 32, 'Hồ sơ ứng tuyển được duyệt'),
	(18, '2025-11-05 14:35:24.670531', 'Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin "Kỹ sư Điện tử" đã được duyệt.', b'1', 32, 'Hồ sơ ứng tuyển được duyệt'),
	(19, '2025-11-05 14:35:34.007200', 'Hồ sơ ứng tuyển vào tin "Kỹ sư Điện tử" bị từ chối. Lý do: Không phù hợp', b'1', 3, 'Hồ sơ ứng tuyển bị từ chối'),
	(20, '2025-11-05 14:41:58.385266', 'Hồ sơ ứng tuyển vào tin "Kỹ sư Điện tử" bị từ chối. Lý do: Không phù hợp', b'1', 3, 'Hồ sơ ứng tuyển bị từ chối'),
	(21, '2025-11-05 14:43:30.624694', 'Hồ sơ ứng tuyển vào tin "Kỹ sư Điện tử" bị từ chối. Lý do: Không phù hợp', b'1', 32, 'Hồ sơ ứng tuyển bị từ chối'),
	(22, '2025-11-05 14:45:00.738854', 'Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin "Kỹ sư Điện tử" đã được duyệt.', b'1', 3, 'Hồ sơ ứng tuyển được duyệt'),
	(23, '2025-11-05 15:58:29.666848', 'Nguyễn Thái Bảo đã ứng tuyển vào tin "Kỹ sư phần mềm nhúng"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(24, '2025-11-05 16:03:10.151005', 'Nguyễn Thái Bảo đã ứng tuyển vào tin "Chuyên viên Phân tích Dữ liệu"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(25, '2025-11-05 16:15:15.745785', 'Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin "Kỹ sư phần mềm nhúng" đã được duyệt.', b'1', 32, 'Hồ sơ ứng tuyển được duyệt'),
	(26, '2025-11-05 16:15:27.189045', 'Hồ sơ ứng tuyển vào tin "Kỹ sư phần mềm nhúng" bị từ chối. Lý do: Không phù hợp', b'1', 32, 'Hồ sơ ứng tuyển bị từ chối'),
	(27, '2025-11-07 17:02:57.024552', 'Tin tuyển dụng "Cloud Backend Engineer" của bạn đã được phê duyệt.', b'1', 1, 'Tin tuyển dụng được duyệt');


-- Dumping database structure for payment_db
CREATE DATABASE IF NOT EXISTS `payment_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `payment_db`;

-- Dumping structure for table payment_db.payment_plan
CREATE TABLE IF NOT EXISTS `payment_plan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKsi15tlu8mqg9rj20a3pfyi8xv` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table payment_db.payment_plan: ~3 rows (approximately)
INSERT INTO `payment_plan` (`id`, `created_at`, `description`, `duration_days`, `name`, `price`) VALUES
	(1, NULL, 'Đăng tối đa 3 tin tuyển / tháng. Gợi ý ứng viên thông minh - xem thông tin cơ bản. Hỗ trợ qua email. Hiển thị tin trong 30 ngày', 30, 'Gói Cơ Bản', 499000),
	(2, NULL, 'Đăng 10 tin tuyển dụng / tháng. Gợi ý ứng viên thông minh - xem thông tin đầy đủ. Hỗ trợ 24/7. Thời gian hiển thị tin: 30 ngày', 30, 'Gói Nâng Cao', 1499000),
	(3, NULL, 'Không giới hạn số tin tuyển dụng. Gợi ý ứng viên thông minh - xem thông tin đầy đủ. Chăm sóc khách hàng riêng. Thời gian hiển thị tin: 60 ngày', 60, 'Gói Chuyên Nghiệp', 2499000);


-- Dumping structure for table payment_db.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) NOT NULL,
  `pay_url` varchar(255) DEFAULT NULL,
  `qr_code_url` varchar(255) DEFAULT NULL,
  `recruiter_id` bigint(20) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `plan_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmf7n8wo2rwrxsd6f3t9ub2mep` (`order_id`),
  KEY `FKnv97km6c9386aewcc18nyqqs2` (`plan_id`),
  CONSTRAINT `FKnv97km6c9386aewcc18nyqqs2` FOREIGN KEY (`plan_id`) REFERENCES `payment_plan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table payment_db.payment: ~4 rows (approximately)
INSERT INTO `payment` (`id`, `amount`, `created_at`, `method`, `order_id`, `pay_url`, `qr_code_url`, `recruiter_id`, `status`, `updated_at`, `plan_id`) VALUES
	(1, 499000, '2025-10-23 13:48:54.238396', 'Momo', 'ORD-1761202134234', NULL, NULL, 2, 'SUCCESS', '2025-10-23 13:48:57.128779', 1),
	(2, 499000, '2025-11-04 11:34:13.704173', 'Momo', 'ORD-1762230853704', NULL, NULL, 20, 'SUCCESS', '2025-11-04 11:34:16.772244', 1),
	(3, 1499000, '2025-11-04 11:35:07.021005', 'Momo', 'ORD-1762230907021', NULL, NULL, 20, 'SUCCESS', '2025-11-04 11:35:10.035500', 2),
	(4, 1499000, '2025-11-07 16:49:49.490217', 'Momo', 'ORD-1762508989489', NULL, NULL, 2, 'SUCCESS', '2025-11-07 16:49:54.397861', 2);


-- Dumping structure for table payment_db.subscription
CREATE TABLE IF NOT EXISTS `subscription` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `end_at` datetime(6) DEFAULT NULL,
  `recruiter_id` bigint(20) DEFAULT NULL,
  `start_at` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `plan_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1gm0nnny0pvrlmxninmm1uor6` (`plan_id`),
  CONSTRAINT `FK1gm0nnny0pvrlmxninmm1uor6` FOREIGN KEY (`plan_id`) REFERENCES `payment_plan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table payment_db.subscription: ~4 rows (approximately)
INSERT INTO `subscription` (`id`, `created_at`, `end_at`, `recruiter_id`, `start_at`, `status`, `plan_id`) VALUES
	(1, '2025-10-23 13:48:57.139376', '2025-11-07 16:49:54.401953', 2, '2025-10-23 13:48:57.139376', 'CANCELLED', 1),
	(2, '2025-11-04 11:34:16.786600', '2025-11-04 11:35:10.040554', 20, '2025-11-04 11:34:16.785470', 'CANCELLED', 1),
	(3, '2025-11-04 11:35:10.041590', '2025-12-04 11:35:10.041590', 20, '2025-11-04 11:35:10.041590', 'ACTIVE', 2),
	(4, '2025-11-07 16:49:54.403329', '2025-12-07 16:49:54.403329', 2, '2025-11-07 16:49:54.403329', 'ACTIVE', 2);


-- Dumping database structure for profile_db
CREATE DATABASE IF NOT EXISTS `profile_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `profile_db`;

-- Dumping structure for table profile_db.candidates
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `career_goal` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` tinyint(4) DEFAULT NULL CHECK (`gender` between 0 and 2),
  `hobbies` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `social` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnm2ss73jii2hdupmpphl6agry` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.candidates: ~17 rows (approximately)
INSERT INTO `candidates` (`id`, `address`, `career_goal`, `dob`, `email`, `full_name`, `gender`, `hobbies`, `phone`, `role`, `social`) VALUES
	(3, 'Quận 1, TP. Hồ Chí Minh', 'Trở thành chuyên gia backend, tối ưu hiệu năng và mở rộng hệ thống.', '2002-01-09', 'tranloi09012002@gmail.com', 'Trần Văn Lợi', 0, 'Đọc sách công nghệ, tham gia hackathon', '0901234567', 'USER', 'linkedin.com/in/nguyenvana'),
	(5, 'Quận 1, TP. Hồ Chí Minh', 'Trở thành Backend Developer giỏi về hệ thống lớn.', '2000-05-12', 'nguyenvana@gmail.com', 'Nguyễn Văn A', 0, 'Chơi bóng đá, đọc sách IT', '0901111111', 'USER', 'linkedin.com/in/nguyenvana'),
	(6, 'Quận 3, TP. Hồ Chí Minh', 'Trở thành Business Analyst và Product Owner.', '1999-11-02', 'tranthib@gmail.com', 'Trần Thị B', 1, 'Nấu ăn, tham gia CLB tình nguyện', '0902222222', 'USER', 'linkedin.com/in/tranthib'),
	(7, 'Quận 5, TP. Hồ Chí Minh', 'Trở thành Mobile Developer Android.', '2001-03-15', 'levanc@gmail.com', 'Lê Văn C', 0, 'Chơi game, lập trình mobile', '0903333333', 'USER', 'linkedin.com/in/levanc'),
	(8, 'Quận 10, TP. Hồ Chí Minh', 'Trở thành QA Engineer chuyên nghiệp.', '2000-07-20', 'phamthid@gmail.com', 'Phạm Thị D', 1, 'Đọc sách, nghe nhạc', '0904444444', 'USER', 'linkedin.com/in/phamthid'),
	(9, 'Đường Điện Biên Phủ, Bình Thạnh, TP.Hồ Chí Minh', 'Trở thành Data Scientist, chuyên về AI/ML trong thương mại điện tử.', '1998-09-30', 'hoangvane@gmail.com', 'Hoàng Văn E', 0, 'Phân tích dữ liệu mở, đọc sách kinh tế, đi bộ buổi tối', '0905555555', 'USER', 'linkedin.com/in/hoangvane'),
	(10, 'Đường Phan Văn Trị, Gò Vấp, TP.Hồ Chí Minh', 'Trở thành Network Engineer và chuyên về Cloud Networking.', '2001-12-10', 'dangthif@gmail.com', 'Đặng Thị F', 1, 'Lắp ráp PC, bóng đá, xem phim hành động', '0906666666', 'USER', 'linkedin.com/in/dangthif'),
	(11, 'Lê Văn Khương, Quận 12, TP.Hồ Chí Minh', 'Trở thành IT Support và System Admin, phát triển sang Cloud.', '1999-04-25', 'buivang@gmail.com', 'Bùi Văn G', 0, 'Nấu ăn, game FPS, du lịch biển', '0907777777', 'USER', 'linkedin.com/in/buivang'),
	(12, 'Khu phố 6, Thủ Đức, TP.Hồ Chí Minh', 'Trở thành researcher trong lĩnh vực y sinh và môi trường.', '2000-08-14', 'nguyenthih@gmail.com', 'Nguyễn Thị H', 1, 'Làm vườn, vẽ tranh, yoga', '0908888888', 'USER', 'linkedin.com/in/nguyenthih'),
	(13, 'Mai Chí Thọ, Thủ Đức, TP.Hồ Chí Minh', 'Trở thành Security Engineer, giải quyết vấn đề về cyber defense.', '2001-06-18', 'tranvani@gmail.com', 'Trần Văn I', 0, 'CTF, đọc báo công nghệ, leo núi', '0909999999', 'USER', 'linkedin.com/in/tranvani'),
	(14, 'Quận 7, TP. Hồ Chí Minh', 'Trở thành chuyên gia điều dưỡng ICU.', '1997-02-11', 'lethij@gmail.com', 'Lê Thị J', 1, 'Tham gia công tác xã hội, đọc sách y khoa', '0910000001', 'USER', 'linkedin.com/in/lethij'),
	(15, 'Quận Bình Tân, TP. Hồ Chí Minh', 'Trở thành Giám đốc tài chính (CFO).', '1995-06-05', 'phamvank@gmail.com', 'Phạm Văn K', 0, 'Chơi golf, đọc sách tài chính', '0910000002', 'USER', 'linkedin.com/in/phamvank'),
	(16, 'Quận Tân Bình, TP. Hồ Chí Minh', 'Trở thành PR Manager trong lĩnh vực FMCG.', '1998-01-19', 'hoangthil@gmail.com', 'Hoàng Thị L', 1, 'Viết blog, du lịch', '0910000003', 'USER', 'linkedin.com/in/hoangthil'),
	(17, 'Quận Phú Nhuận, TP. Hồ Chí Minh', 'Trở thành Kiến trúc sư trưởng trong công ty quốc tế.', '1996-10-09', 'dovanm@gmail.com', 'Đỗ Văn M', 0, 'Vẽ tranh, chụp ảnh kiến trúc', '0910000004', 'USER', 'linkedin.com/in/dovanm'),
	(18, 'Quận Gò Vấp, TP. Hồ Chí Minh', 'Trở thành giảng viên Tiếng Anh tại trường ĐH.', '1999-12-22', 'vuthin@gmail.com', 'Vũ Thị N', 1, 'Đọc sách, dạy học online', '0910000005', 'USER', 'linkedin.com/in/vuthin'),
	(19, 'Khu công nghiệp VSIP, Thuận An, Bình Dương', 'Trở thành Head of Supply Chain, tối ưu chi phí và nâng cao hiệu suất vận hành', '1994-03-21', 'ngovano@gmail.com', 'Ngô Văn O', 0, 'Bóng rổ, du lịch, nghiên cứu giải pháp logistics xanh', '0910000006', 'USER', 'linkedin.com/in/ngovano'),
	(32, 'Hà Nội', 'Senior Fullstack Engineer', '2003-02-10', 'bao123nguyen456@gmail.com', 'Nguyễn Thái Bảo', 0, 'Code, Du lịch', '0387776610', 'USER', 'https://linkedin.com/in/nguyenvana');

-- Dumping structure for table profile_db.certificates
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `expiry_date` date DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `issuer` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt8r0o54nmp2jussm9qm3xedvu` (`candidate_id`),
  CONSTRAINT `FKt8r0o54nmp2jussm9qm3xedvu` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.certificates: ~28 rows (approximately)
INSERT INTO `certificates` (`id`, `expiry_date`, `issue_date`, `issuer`, `name`, `candidate_id`) VALUES
	(5, NULL, '2023-01-01', 'British Council', 'IELTS 6.5', 3),
	(6, NULL, '2022-06-15', 'Oracle', 'Chứng chỉ Java OCP', 3),
	(9, NULL, '2021-06-01', 'Microsoft', 'MOS Excel', 6),
	(10, NULL, '2021-01-01', 'IIBC', 'TOEIC 750', 6),
	(11, NULL, '2023-01-01', 'Google', 'Chứng chỉ Android Developer', 7),
	(12, NULL, '2022-01-01', 'ISTQB', 'ISTQB Foundation Level', 8),
	(13, NULL, '2020-01-01', 'Coursera', 'Chứng chỉ Data Analyst Coursera', 9),
	(14, NULL, '2020-06-01', 'Google', 'Google Data Analytics', 9),
	(15, NULL, '2023-01-01', 'Cisco', 'CCNA', 10),
	(16, NULL, '2022-01-01', 'IIBC', 'TOEIC 700', 10),
	(17, NULL, '2021-01-01', 'Microsoft', 'MOS', 11),
	(18, NULL, '2021-06-01', 'Amazon', 'AWS Certified Cloud Practitioner', 11),
	(19, NULL, '2022-01-01', 'IIBC', 'TOEIC 650', 12),
	(20, NULL, '2022-01-01', 'IUH', 'Chứng chỉ Lab Safety', 12),
	(21, NULL, '2023-01-01', 'EC-Council', 'CEH v11', 13),
	(22, NULL, '2023-06-01', 'CompTIA', 'CompTIA Security+', 13),
	(23, NULL, '2019-01-01', 'NCSBN', 'Chứng chỉ Điều dưỡng quốc tế NCLEX', 14),
	(24, NULL, '2017-01-01', 'CFA Institute', 'CFA Level 1', 15),
	(25, NULL, '2020-01-01', 'Google', 'Google Digital Marketing', 16),
	(26, NULL, '2018-01-01', 'RIBA', 'Chứng chỉ Kiến trúc quốc tế RIBA', 17),
	(27, NULL, '2021-01-01', 'British Council', 'IELTS 8.0', 18),
	(28, NULL, '2021-06-01', 'TESOL International', 'TESOL', 18),
	(29, NULL, '2016-01-01', 'APICS', 'APICS CPIM', 19),
	(30, NULL, '2016-06-01', 'IASSC', 'Lean Six Sigma Yellow Belt', 19),
	(31, NULL, '2023-06-01', 'Amazon', 'AWS Solutions Architect', 32),
	(32, NULL, '2022-03-15', 'Oracle', 'Oracle Certified Java Programmer', 32),
	(33, NULL, '2022-01-01', 'British Council', 'IELTS 6.0', 5),
	(34, NULL, '2023-03-01', 'Amazon', 'AWS Cloud Practitioner', 5);

-- Dumping structure for table profile_db.educations
CREATE TABLE IF NOT EXISTS `educations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `gpa` varchar(255) DEFAULT NULL,
  `graduation_year` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `school` varchar(255) DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqftk86h96y7tf81tor4sm5ufx` (`candidate_id`),
  CONSTRAINT `FKqftk86h96y7tf81tor4sm5ufx` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.educations: ~17 rows (approximately)
INSERT INTO `educations` (`id`, `gpa`, `graduation_year`, `major`, `school`, `candidate_id`) VALUES
	(3, '3.5/4.0', '2023', 'Khoa học máy tính', 'Đại học Công nghiệp TP.HCM (IUH)', 3),
	(5, '3.6/4.0', '2021', 'Hệ thống thông tin quản lý', 'Đại học Kinh Tế TP.HCM', 6),
	(6, '3.2/4.0', '2023', 'Kỹ thuật phần mềm', 'Đại học Công nghệ thông tin (UIT)', 7),
	(7, '3.7/4.0', '2022', 'Công nghệ thông tin', 'Đại học Sư phạm Kỹ thuật TP.HCM', 8),
	(8, '3.8/4.0', '2020', 'Khoa học dữ liệu', 'Đại học Khoa học Tự nhiên', 9),
	(9, '3.1/4.0', '2023', 'Mạng máy tính', 'Đại học Công nghiệp TP.HCM (IUH)', 10),
	(10, '3.3/4.0', '2021', 'Hệ thống thông tin', 'Đại học Mở TP.HCM', 11),
	(11, '3.0/4.0', '2022', 'Công nghệ sinh học', 'Đại học Nông Lâm TP.HCM', 12),
	(12, '3.5/4.0', '2023', 'An ninh mạng', 'Đại học Tôn Đức Thắng', 13),
	(13, '3.2/4.0', '2019', 'Điều dưỡng', 'Đại học Y Dược TP.HCM', 14),
	(14, '3.6/4.0', '2017', 'Tài chính - Ngân hàng', 'Đại học Kinh Tế TP.HCM', 15),
	(15, '3.5/4.0', '2020', 'Truyền thông - Quan hệ công chúng', 'Đại học Khoa học Xã hội & Nhân văn', 16),
	(16, '3.1/4.0', '2018', 'Kiến trúc', 'Đại học Kiến trúc TP.HCM', 17),
	(17, '3.9/4.0', '2021', 'Sư phạm Tiếng Anh', 'Đại học Sư phạm TP.HCM', 18),
	(18, '3.4/4.0', '2016', 'Quản lý chuỗi cung ứng', 'Đại học Kinh tế TPHCM (UEH)', 19),
	(19, '3.5', '2021', 'CNTT', 'ĐH Bách Khoa', 32),
	(20, '3.4/4.0', '2022', 'Công nghệ thông tin', 'Đại học Bách Khoa TP.HCM', 5);

-- Dumping structure for table profile_db.experiences
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5pts9l4acfs3e1h5u3y35sudc` (`candidate_id`),
  CONSTRAINT `FK5pts9l4acfs3e1h5u3y35sudc` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.experiences: ~18 rows (approximately)
INSERT INTO `experiences` (`id`, `description`, `candidate_id`) VALUES
	(5, 'Thực tập tại công ty ABC (6 tháng)', 3),
	(7, 'Trợ giảng tại trường ĐH (1 năm)', 6),
	(8, 'Thực tập tại VNG (3 tháng)', 7),
	(9, 'Thực tập Tester tại TMA Solutions', 8),
	(10, 'Data Analyst tại Shopee (1 năm)\nFreelancer phân tích dữ liệu cho startup', 9),
	(11, 'Thực tập Network Admin tại VNPT\ncấu hình router cho công ty nhỏ', 10),
	(12, 'Intern IT Helpdesk tại Sacombank\nhỗ trợ người dùng Office 365', 11),
	(13, 'Nghiên cứu tại phòng thí nghiệm trường\ntham gia đề tài cấp bộ', 12),
	(14, 'Intern Security Analyst tại CMC\ntham gia pentest cho web app', 13),
	(15, 'Điều dưỡng tại Bệnh viện Chợ Rẫy (3 năm 6 tháng)', 14),
	(16, 'Chuyên viên tín dụng tại Vietcombank (5 năm)', 15),
	(17, 'Chuyên viên PR tại Công ty Truyền thông XYZ (2 năm 8 tháng)', 16),
	(18, 'Kiến trúc sư tại Công ty Xây dựng ABC (4 năm 2 tháng)', 17),
	(19, 'Giáo viên Tiếng Anh tại Trung tâm Ngoại ngữ ABC (1 năm 4 tháng)', 18),
	(20, 'Supply Chain Specialist tại DHL (4 năm 3 tháng)\nLogistics Supervisor tại Công ty Vận tải ABC (2 năm 6 tháng)', 19),
	(21, 'FPT Software - Backend Developer (2022-2024)', 32),
	(22, 'VNG - Intern (2021)', 32),
	(23, 'Thực tập tại FPT Software (6 tháng)', 5);

-- Dumping structure for table profile_db.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgig3nmlud86yc0dju1hmsl1kh` (`candidate_id`),
  CONSTRAINT `FKgig3nmlud86yc0dju1hmsl1kh` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.projects: ~18 rows (approximately)
INSERT INTO `projects` (`id`, `description`, `candidate_id`) VALUES
	(5, 'Website thương mại điện tử\nhệ thống quản lý sinh viên', 3),
	(7, 'Hệ thống quản lý thư viện\nwebsite bán hàng', 6),
	(8, 'Ứng dụng mobile quản lý chi tiêu', 7),
	(9, 'Website đặt vé máy bay\nhệ thống e-learning', 8),
	(10, 'Dự báo doanh thu bán hàng\nhệ thống gợi ý sản phẩm', 9),
	(11, 'Xây dựng mạng LAN cho trường học\nmô hình firewall 2 lớp', 10),
	(12, 'Website tin tức\nhệ thống quản lý văn phòng nhỏ', 11),
	(13, 'Ứng dụng enzyme trong xử lý chất thải\nphát triển chế phẩm vi sinh', 12),
	(14, 'Hệ thống IDS/IPS\nứng dụng secure login với JWT', 13),
	(15, 'Tham gia dự án chăm sóc bệnh nhân ICU', 14),
	(16, 'Tổ chức sự kiện thương hiệu\nchiến dịch marketing online', 16),
	(17, 'Thiết kế nhà phố\ntòa nhà văn phòng', 17),
	(18, 'Thiết kế giáo trình tiếng Anh giao tiếp online', 18),
	(19, 'Tối ưu hóa tuyến phân phối khu vực miền Nam\nTriển khai WMS (Warehouse Management System) cho kho trung tâm', 19),
	(20, 'Hệ thống quản lý nhân sự', 32),
	(21, 'Ứng dụng đặt lịch khám bệnh', 32),
	(22, 'Hệ thống quản lý nhân viên', 5),
	(23, 'website bán sách', 5);

-- Dumping structure for table profile_db.skills
CREATE TABLE IF NOT EXISTS `skills` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbg4atlinglmgeysrqern5rs9k` (`candidate_id`),
  CONSTRAINT `FKbg4atlinglmgeysrqern5rs9k` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.skills: ~68 rows (approximately)
INSERT INTO `skills` (`id`, `name`, `candidate_id`) VALUES
	(11, 'Java', 3),
	(12, 'Spring Boot', 3),
	(13, 'SQL', 3),
	(14, 'Docker', 3),
	(15, 'ReactJS', 3),
	(16, 'Git', 3),
	(17, 'React', 3),
	(22, 'MySQL', 6),
	(23, 'HTML/CSS', 6),
	(24, 'JavaScript', 6),
	(25, 'NodeJS', 6),
	(26, 'Kotlin', 7),
	(27, 'Android', 7),
	(28, 'Firebase', 7),
	(29, 'Manual Test', 8),
	(30, 'Selenium', 8),
	(31, 'Postman', 8),
	(32, 'Python', 9),
	(33, 'Pandas', 9),
	(34, 'SQL', 9),
	(35, 'Tableau', 9),
	(36, 'Power BI', 9),
	(37, 'Cisco', 10),
	(38, 'CCNA', 10),
	(39, 'Linux Server', 10),
	(40, 'Wireshark', 10),
	(41, 'Windows Server', 11),
	(42, 'SQL Server', 11),
	(43, 'Excel', 11),
	(44, 'PowerShell', 11),
	(45, 'PCR', 12),
	(46, 'Excel', 12),
	(47, 'Data Analysis', 12),
	(48, 'R programming', 12),
	(49, 'Kali Linux', 13),
	(50, 'Burp Suite', 13),
	(51, 'OWASP', 13),
	(52, 'Splunk', 13),
	(53, 'Chăm sóc bệnh nhân', 14),
	(54, 'cấp cứu', 14),
	(55, 'giao tiếp', 14),
	(56, 'Phân tích tài chính', 15),
	(57, 'quản lý rủi ro', 15),
	(58, 'Excel nâng cao', 15),
	(59, 'Content marketing', 16),
	(60, 'PR', 16),
	(61, 'thuyết trình', 16),
	(62, 'AutoCAD', 17),
	(63, 'SketchUp', 17),
	(64, '3Ds Max', 17),
	(65, 'Tiếng Anh C1', 18),
	(66, 'giao tiếp', 18),
	(67, 'soạn bài giảng', 18),
	(68, 'Quản lý chuỗi cung ứng', 19),
	(69, 'WMS', 19),
	(70, 'SAP MM', 19),
	(71, 'Excel nâng cao', 19),
	(72, 'Dự báo nhu cầu', 19),
	(73, 'Đàm phán với nhà cung cấp', 19),
	(74, 'Java', 32),
	(75, 'Spring Boot', 32),
	(76, 'React', 32),
	(77, 'Docker', 32),
	(78, 'AWS', 32),
	(79, 'Java', 5),
	(80, 'Spring Boot', 5),
	(81, 'SQL', 5),
	(82, 'Git', 5);


-- Dumping database structure for storage_db
CREATE DATABASE IF NOT EXISTS `storage_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `storage_db`;

-- Dumping structure for table storage_db.files
CREATE TABLE IF NOT EXISTS `files` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `object_name` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK39voviokl3jcxsxrbi06aqbak` (`object_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table storage_db.files: ~12 rows (approximately)
INSERT INTO `files` (`id`, `category`, `file_name`, `file_type`, `object_name`, `uploaded_at`, `user_id`) VALUES
	(1, 'AVATAR', 'z6957495558064_4df324704621e057139567b8e0c19db3.jpg', 'image/jpeg', 'e6187942-fa58-49a6-9cd6-5ca88852fb39_z6957495558064_4df324704621e057139567b8e0c19db3.jpg', '2025-11-04 14:54:56.922812', 32),
	(2, 'CV', 'PhanTichChucNangHeThong.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'a05d74b0-6f23-4c24-98cd-4eddc0166bb8_PhanTichChucNangHeThong.docx', '2025-11-05 16:03:10.036262', 32),
	(3, 'AVATAR', NULL, NULL, NULL, '2025-10-01 14:30:37.126532', 33),
	(4, 'CV', 'OnTapCK.pdf', 'application/pdf', '3d32ca3c-e07f-4a85-80ab-198c42187ea4_OnTapCK.pdf', '2025-10-01 15:30:40.128093', 33),
	(5, 'CV', 'SSRC_TeachMe.pdf', 'application/pdf', 'b5fb5743-c455-44e8-a65b-c8b7076399b8_SSRC_TeachMe.pdf', '2025-10-31 18:43:58.782702', 3),
	(6, 'AVATAR', 'z6957495558064_4df324704621e057139567b8e0c19db3.jpg', 'image/jpeg', '66568606-6a36-46d8-88ea-d56586358650_z6957495558064_4df324704621e057139567b8e0c19db3.jpg', '2025-10-14 21:16:42.820879', 34),
	(7, 'CV', NULL, NULL, NULL, '2025-10-14 18:36:17.309381', 34),
	(8, 'AVATAR', 'icon.png', 'image/png', 'e48c295d-3694-4d6b-bebf-40090caf53b5_icon.png', '2025-10-31 18:42:05.175268', 3),
	(9, 'CV', 'SSRC_TeachMe.pdf', 'application/pdf', 'bee16153-86da-4fbf-b6bc-1e01fe926a8f_SSRC_TeachMe.pdf', '2025-11-04 16:12:18.842841', 5),
	(10, 'CV', 'CMM_CMMI_SoSanh_ISOvsCMM.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '349d4d0e-04cd-41f1-89f2-3f9f92eb0f8a_CMM_CMMI_SoSanh_ISOvsCMM.docx', '2025-11-04 16:13:01.807751', 6),
	(12, 'AVATAR', 'spring.jpg', 'image/jpeg', '7be23066-d39b-43f8-bfae-1a15a5918ec7_spring.jpg', '2025-11-04 16:52:26.289218', 5),
	(13, 'AVATAR', 'z6957495558064_4df324704621e057139567b8e0c19db3.jpg', 'image/jpeg', '91c2f0f3-b7ea-4fbf-ba21-4c8bbe5ab7bd_z6957495558064_4df324704621e057139567b8e0c19db3.jpg', '2025-11-07 19:07:45.978825', 1);


-- Dumping database structure for user_db
CREATE DATABASE IF NOT EXISTS `user_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `user_db`;

-- Dumping structure for table user_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK716hgxp60ym1lifrdgp67xt5k` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table user_db.roles: ~3 rows (approximately)
INSERT INTO `roles` (`id`, `description`, `role_name`) VALUES
	(1, 'Quyền dành cho người dùng thông thường', 'USER'),
	(2, 'Quyền dành cho quản trị viên hệ thống', 'ADMIN'),
	(3, 'Quyền dành cho nhà tuyển dụng', 'EMPLOYER');

-- Dumping structure for table user_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `active` bit(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table user_db.users: ~26 rows (approximately)
INSERT INTO `users` (`id`, `email`, `full_name`, `active`, `password`, `role_id`) VALUES
	(1, 'tranthiyenduy08@gmail.com', 'Trần Thị Yến Duy', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 2),
	(2, 'nguyenthaibao9a1tg2017@gmail.com', 'Nguyễn Thái Bảo', b'1', '$2a$10$AMRJgGt4Wk.5dOM3Ecm1uuDb22XmdzDsUNs5gVR6iaPKPs0gxgFeK', 3),
	(3, 'tranloi09012002@gmail.com', 'Trần Văn Lợi', b'1', '$2a$10$QuQ1pdm0/sPAobp9WGuI0OXV1Sg7lNHiZpLGntrm3azJ9./DViX1q', 1),
	(4, 'phuongnhigougou@gmail.com', 'Phương Nhi', b'1', '$2a$10$bVTLSmQtaMxxW8MpfUlDHuS.sJiERQtfWwTulALVpKE6juRPsKwmK', 1),
	(5, 'nguyenvana@gmail.com', 'Nguyễn Văn A', b'1', '$2a$10$oU7LgqMsP5EnQCdeTZDWreyrgp2Dc95A7TG86na.A/wwxfXS7iqUy', 1),
	(6, 'tranthib@gmail.com', 'Trần Thị B', b'1', '$2a$10$GTYLMRqv48Ub.6eL1Qyi8.jlOaEJIwviXh6z5C37i/DGBdjJYkrZG', 1),
	(7, 'levanc@gmail.com', 'Lê Văn C', b'1', '$2a$10$XcQ7lsyKxALz6xLY/xj1F.VGm8l0X9I3kAh4tnB7UO7vygGRc.ysm', 1),
	(8, 'phamthid@gmail.com', 'Phạm Thị D', b'1', '$2a$10$ZreMNLQwO.N7o6dpVZUIue7f5kzMQfDya1Y821EWxKRS1QAcSVxf2', 1),
	(9, 'hoangvane@gmail.com', 'Hoàng Văn E', b'1', '$2a$10$jy3Y22bhiNxgUnDttXZR4uDp9nummKtB9nTSpoZWWoyEiFDz2DsNu', 1),
	(10, 'dangthif@gmail.com', 'Đặng Thị F', b'1', '$2a$10$EwKkWYGekBBKseYBL5O.9euWE1pX8.T/Z5/6PgcVNLh6Wr3dqqrF2', 1),
	(11, 'buivang@gmail.com', 'Bùi Văn G', b'1', '$2a$10$L4aWT1w2GFzGkD3izwdqE.lD5DIxypnlsi9kG2BfSSsWSRYZAJxGq', 1),
	(12, 'nguyenthih@gmail.com', 'Nguyễn Thị H', b'1', '$2a$10$ikc0MLVjgJ7ax180at9Dh.ff56HZbYRpEaG02kxeP2y6blKiRpCPG', 1),
	(13, 'tranvani@gmail.com', 'Trần Văn I', b'1', '$2a$10$M3tLj8yxKM5y5LIwARwqZeN.E.yYgDLdsxgk3vB1RjYGwWMSMgCB6', 1),
	(14, 'lethij@gmail.com', 'Lê Thị J', b'1', '$2a$10$M77jPnfPMY36aUujjSfGVuO5Rd9yilh2iNv/T.Ps9ONhmmTc0iebO', 1),
	(15, 'phamvank@gmail.com', 'Phạm Văn K', b'1', '$2a$10$mwn23hGuMvfs93Kr26CmMeVSM18rx9qWHAbQ8idfgiQXGihZxzldm', 1),
	(16, 'hoangthil@gmail.com', 'Hoàng Thị L', b'1', '$2a$10$2dKrerkYTmoMpIc3Qam3Y.2oEqxtuncCG81tDWsRvp7QccWs.GdAq', 1),
	(17, 'dovanm@gmail.com', 'Đỗ Văn M', b'1', '$2a$10$.PaxcQQ1nbRcLHOKayvFQuISylBNJgA37hpzzBIwM5FBPRN1KjcAy', 1),
	(18, 'vuthin@gmail.com', 'Vũ Thị N', b'1', '$2a$10$aPWccFFneCtVGHqJi1/FWO2wfZEOIXdPXG3YzqAYwY78jnPh8Trkq', 1),
	(19, 'ngovano@gmail.com', 'Ngô Văn O', b'1', '$2a$10$x/XleaFn284fkOP16JTMluocogpL8jEdJc1IT4hRh4lPKuDZQUc1u', 1),
	(20, 'levantuan123@gmail.com', 'Lê Văn Tuấn', b'1', '$2a$10$OAcYwD4.Bg58zLt2F6WmQ.CAgA0LirDPYpBefFjubAAm4FlgxZklu', 3),
	(21, 'nguyentuankiet111@gmail.com', 'Nguyễn Tuấn Kiệt', b'1', '$2a$10$sQd3DbiV1/PQaKXMV1wfOumm2ksLaAhqSkrRrI6pb4hLhJSYwKGuW', 3),
	(28, 'nguyenthaibao102803@gmail.com', 'Nguyễn Thái Bảo', b'1', '$2a$10$7D3/zWz5rD.XMMEfMoPrVOzgqm9Y/NNas9D0/WqS2zbrPEob0GHKC', 1),
	(29, 'thaibao102803@gmail.com', 'Nguyễn Thái Bảo', b'1', '$2a$10$o9GC56oA1pgGGz.tbVtsyefMVp8Shw7J6IwZbYph.JXcRIaEOaiWu', 1),
	(32, 'bao123nguyen456@gmail.com', 'Nguyễn Thái Bảo', b'1', '$2a$10$dlRa038TGD7B5wGSMfbTd.03m08l4C3Dz.FHU.c1Rz2emUKIQBfCi', 1),
	(33, 'nguyenan123a@gmail.com', 'Nguyễn Trường An', b'1', '$2a$10$QI7rBu3.SLCN56xnpAd8muTaz3A/l7ilY2K7spl.KSknfDlmN89/G', 1),
	(34, 'nguyenthaibao100203@gmail.com', 'Nguyễn Thái Bảo', b'1', '$2a$10$JHwoKqP3bm7DWN8uXWxPIO7BFE0K0iN5UVRRbkh4Lfa8e4jzpevmG', 1);

-- Dumping structure for table user_db.verification_tokens
CREATE TABLE IF NOT EXISTS `verification_tokens` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  `temp_full_name` varchar(255) DEFAULT NULL,
  `temp_password` varchar(255) DEFAULT NULL,
  `user_data` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

