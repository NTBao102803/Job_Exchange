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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table application_db.applications: ~36 rows (approximately)
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
	(17, '2025-11-05 16:03:10.103912', 32, 'PhanTichChucNangHeThong.docx', 'a05d74b0-6f23-4c24-98cd-4eddc0166bb8_PhanTichChucNangHeThong.docx', 6, NULL, 'PENDING'),
	(18, '2025-11-18 09:15:22.123456', 35, 'CV_LeMinhDuc_ReactNative.pdf', 'uuid-1001_cv_leminhduc.pdf', 19, NULL, 'APPROVED'),
	(19, '2025-11-18 14:30:11.654321', 36, 'CV_PhamThuyTrang_Vue.pdf', 'uuid-1002_cv_thuytrang.pdf', 1, 'Chưa đủ kinh nghiệm React Native', 'REJECTED'),
	(20, '2025-11-19 10:22:33.987654', 37, 'CV_TranQuangHuy_NodeJS.pdf', 'uuid-1003_cv_quanghuy.pdf', 20, NULL, 'APPROVED'),
	(21, '2025-11-19 16:45:12.111111', 38, 'CV_PhuongThao_DataEngineer.pdf', 'uuid-1004_cv_phuongthao.pdf', 21, NULL, 'PENDING'),
	(22, '2025-11-20 08:10:55.222333', 39, 'CV_VoHoangNam_Flutter.pdf', 'uuid-1005_cv_hoangnam.pdf', 22, NULL, 'APPROVED'),
	(23, '2025-11-20 11:33:44.555666', 40, 'CV_DangKhoa_Golang.pdf', 'uuid-1006_cv_dangkhoa.pdf', 20, NULL, 'PENDING'),
	(24, '2025-11-21 13:20:01.777888', 42, 'CV_BuiQuangVinh_DevOps.pdf', 'uuid-1007_cv_quangvinh.pdf', 23, NULL, 'APPROVED'),
	(25, '2025-11-22 09:05:30.999111', 43, 'CV_TrinhDiemMy_Security.pdf', 'uuid-1008_cv_diemmy.pdf', 24, NULL, 'PENDING'),
	(26, '2025-11-23 14:40:15.123456', 45, 'CV_VuTienDat_AI.pdf', 'uuid-1009_cv_tiendat.pdf', 25, NULL, 'APPROVED'),
	(27, '2025-11-24 10:15:45.654321', 46, 'CV_TranNgocAnh_PM.pdf', 'uuid-1010_cv_ngocanh.pdf', 27, 'Chưa có kinh nghiệm quản lý sản phẩm', 'REJECTED'),
	(28, '2025-11-25 11:30:22.987654', 47, 'CV_NguyenVanHung_Embedded.pdf', 'uuid-1011_cv_vanhung.pdf', 28, NULL, 'PENDING'),
	(29, '2025-11-26 15:20:11.111222', 48, 'CV_DinhThiLan_BA.pdf', 'uuid-1012_cv_thilan.pdf', 29, NULL, 'APPROVED'),
	(30, '2025-11-27 09:45:33.333444', 49, 'CV_PhamQuangMinh_QA.pdf', 'uuid-1013_cv_quangminh.pdf', 30, NULL, 'PENDING'),
	(31, '2025-11-28 13:10:55.555666', 51, 'CV_HoangVanThanh_Cloud.pdf', 'uuid-1014_cv_vanthanh.pdf', 31, NULL, 'APPROVED'),
	(32, '2025-11-29 16:25:44.777888', 52, 'CV_NguyenPhuongLinh_Vue.pdf', 'uuid-1015_cv_phuonglinh.pdf', 32, NULL, 'PENDING'),
	(33, '2025-11-30 10:50:22.999111', 53, 'CV_TranVanThang_SysAdmin.pdf', 'uuid-1016_cv_vanthang.pdf', 33, 'Chưa có kinh nghiệm thực tế', 'REJECTED'),
	(34, '2025-12-01 14:15:11.123456', 54, 'CV_VuThuyDuong_DataAnalyst.pdf', 'uuid-1017_cv_thuyduong.pdf', 34, NULL, 'APPROVED'),
	(35, '2025-12-02 11:40:33.654321', 55, 'CV_BuiQuangHuy_PHP.pdf', 'uuid-1018_cv_quanghuy.pdf', 35, NULL, 'PENDING'),
	(36, '2025-12-03 15:05:55.987654', 56, 'CV_DangThiNgoc_iOS.pdf', 'uuid-1019_cv_thingoc.pdf', 36, NULL, 'APPROVED'),
	(37, '2025-12-04 09:30:22.111222', 57, 'CV_PhamVanSon_Android.pdf', 'uuid-1020_cv_vanson.pdf', 37, NULL, 'PENDING'),
	(38, '2025-12-05 13:55:44.333444', 58, 'CV_TrinhVanLong_Network.pdf', 'uuid-1021_cv_vanlong.pdf', 38, NULL, 'APPROVED'),
	(39, '2025-11-28 12:25:56.963015', 3, 'CV-Nguyễn_Thái_Bảo-đã nén.pdf', '866cce3d-36a1-4fd0-8d18-52ec9f51a29b_CV-Nguyễn_Thái_Bảo-đã nén.pdf', 38, NULL, 'APPROVED'),
	(40, '2025-12-02 09:06:37.996609', 3, 'Bìa.docx', '6139b5e4-b0aa-4a02-9014-63963aa5a80f_Bìa.docx', 35, NULL, 'REJECTED'),
	(41, '2025-12-02 09:22:44.232875', 61, '03-Template-trinh-bay-bai-bao.docx', '1917a67e-b5fa-4582-9386-383147990c33_03-Template-trinh-bay-bai-bao.docx', 35, NULL, 'APPROVED');


-- Dumping database structure for comment_db
CREATE DATABASE IF NOT EXISTS `comment_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `comment_db`;

-- Dumping structure for table comment_db.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `employer_id` bigint(20) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `parent_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlri30okf66phtcgbe5pok7cc0` (`parent_id`),
  CONSTRAINT `FKlri30okf66phtcgbe5pok7cc0` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table comment_db.comments: ~25 rows (approximately)
INSERT INTO `comments` (`id`, `author_name`, `content`, `created_at`, `employer_id`, `rating`, `role`, `user_id`, `parent_id`) VALUES
	(1, 'Trần Văn Lợi', 'công việc nhiều phúc lợi', '2025-11-18 07:41:24.717912', 2, 4, NULL, 3, NULL),
	(2, 'Công ty TNHH Công Nghệ ABC', 'cảm ơn bạn', '2025-11-18 07:42:46.794468', 2, NULL, NULL, NULL, 1),
	(3, 'Trần Văn Lợi', 'cảm ơn công ty đã cho tôi 1 công việc phù hợp', '2025-11-18 07:43:28.471352', 2, NULL, NULL, 3, 2),
	(4, 'Nguyễn Thái Bảo', 'rất nhiều vị trí cho các bạn lựa chọn nên thử', '2025-11-18 07:45:48.273110', 2, 5, NULL, 32, NULL),
	(5, 'Nguyễn Thái Bảo', 'tệ', '2025-11-18 07:47:19.851620', 2, 1, NULL, 32, NULL),
	(6, 'Lê Minh Đức', 'Môi trường rất trẻ, công nghệ mới, leader hỗ trợ nhiệt tình', '2025-11-19 10:30:00.000000', 1, 5, NULL, 35, NULL),
	(7, 'Công ty TNHH Công Nghệ ABC', 'Cảm ơn bạn Đức, chúc bạn luôn thành công!', '2025-11-19 11:15:00.000000', 1, NULL, NULL, NULL, 6),
	(8, 'Phạm Thùy Trang', 'Phỏng vấn nhanh, quy trình rõ ràng', '2025-11-20 14:20:00.000000', 2, 4, NULL, 36, NULL),
	(9, 'Nguyễn Văn A', 'Lương cạnh tranh, phúc lợi tốt', '2025-11-21 09:10:00.000000', 1, 5, NULL, 5, NULL),
	(10, 'Trần Quang Huy', 'Được làm việc với team quốc tế', '2025-11-22 17:45:00.000000', 2, 5, NULL, 37, NULL),
	(11, 'Võ Hoàng Nam', 'Nhiều cơ hội học hỏi công nghệ mới', '2025-11-23 12:30:00.000000', 4, 5, NULL, 39, NULL),
	(12, 'Đặng Khoa', 'Môi trường startup năng động', '2025-11-24 15:20:00.000000', 1, 4, NULL, 40, NULL),
	(13, 'Huỳnh Thị Kim Ngân', 'Team design rất sáng tạo', '2025-11-25 10:45:00.000000', 4, 5, NULL, 41, NULL),
	(14, 'Bùi Quang Vinh', 'Hạ tầng cloud hiện đại', '2025-11-26 14:10:00.000000', 1, 5, NULL, 42, NULL),
	(15, 'Trịnh Thị Diễm My', 'Có nhiều CTF nội bộ', '2025-11-27 11:55:00.000000', 2, 5, NULL, 43, NULL),
	(16, 'Vũ Tiến Đạt', 'Được dùng GPU mạnh để train model', '2025-11-28 16:30:00.000000', 1, 5, NULL, 45, NULL),
	(17, 'Trần Thị Ngọc Ánh', 'Product team rất chuyên nghiệp', '2025-11-29 09:20:00.000000', 1, 4, NULL, 46, NULL),
	(18, 'Nguyễn Văn Hùng', 'Làm việc với hardware thực tế', '2025-11-30 13:45:00.000000', 2, 5, NULL, 47, NULL),
	(19, 'Đinh Thị Lan', 'Được đào tạo phân tích nghiệp vụ', '2025-12-01 10:15:00.000000', 4, 5, NULL, 48, NULL),
	(20, 'Phạm Quang Minh', 'Có lab test đầy đủ thiết bị', '2025-12-02 14:40:00.000000', 1, 4, NULL, 49, NULL),
	(21, 'Lê Thị Kim Liên', 'Team mobile rất đoàn kết', '2025-12-03 11:25:00.000000', 4, 5, NULL, 50, NULL),
	(22, 'Hoàng Văn Thành', 'Học được nhiều về multi-cloud', '2025-12-04 15:50:00.000000', 4, 5, NULL, 51, NULL),
	(23, 'Nguyễn Thị Phương Linh', 'Frontend team dùng công nghệ mới', '2025-12-05 09:30:00.000000', 2, 4, NULL, 52, NULL),
	(24, 'Trần Văn Thắng', 'Quản trị hệ thống lớn', '2025-12-06 12:15:00.000000', 1, 5, NULL, 53, NULL),
	(25, 'Vũ Thị Thùy Dương', 'Báo cáo đẹp, dữ liệu chính xác', '2025-12-07 16:40:00.000000', 4, 5, NULL, 54, NULL);


-- Dumping database structure for employer_db
CREATE DATABASE IF NOT EXISTS `employer_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `employer_db`;

-- Dumping structure for table employer_db.companies
CREATE TABLE IF NOT EXISTS `companies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `business_license` varchar(255) DEFAULT NULL,
  `company_address` varchar(255) DEFAULT NULL,
  `company_description` varchar(2000) DEFAULT NULL,
  `company_field` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_size` varchar(255) DEFAULT NULL,
  `company_social` varchar(255) DEFAULT NULL,
  `company_website` varchar(255) DEFAULT NULL,
  `tax_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table employer_db.companies: ~4 rows (approximately)
INSERT INTO `companies` (`id`, `business_license`, `company_address`, `company_description`, `company_field`, `company_name`, `company_size`, `company_social`, `company_website`, `tax_code`) VALUES
	(1, '032165465', 'Quận 3, TP. Hồ Chí Minh', 'Chuyên cung cấp giải pháp phần mềm quản lý doanh nghiệp, tích hợp AI/ML và dịch vụ Cloud.', 'Công nghệ thông tin', 'Công ty TNHH Công Nghệ ABC', '100-500 nhân viên', 'linkedin.com/company/abc-tech', 'www.abctech.com.vn', '032165465'),
	(2, '0912345678', 'Quận 1, TP. Hồ Chí Minh', 'Tập đoàn hàng đầu trong lĩnh vực sản xuất thiết bị điện tử và linh kiện công nghệ cao.', 'Sản xuất công nghiệp', 'Tập đoàn XYZ', '500-1000 nhân viên', 'linkedin.com/company/xyzcorp', 'www.xyzcorp.com', '0912345678'),
	(3, NULL, 'Thuận An, Bình Dương', 'Doanh nghiệp chuyên về xây dựng dân dụng và công nghiệp, với đội ngũ kỹ sư giàu kinh nghiệm.', 'Xây dựng - Bất động sản', 'Công ty TNHH Một Thành Viên Tuấn Kiệt', '50-100 nhân viên', 'facebook.com/tuan-kiet-construction', 'www.tuankiet.com.vn', NULL),
	(4, '0312345678', 'Quận 1, TP. Hồ Chí Minh', 'Công ty công nghệ tiên phong về AI và Cloud Native', 'Công nghệ thông tin', 'VinaTech Solutions', '200-500 nhân viên', 'linkedin.com/company/vinatech', 'www.vinatech.vn', '0312345678');

-- Dumping structure for table employer_db.employers
CREATE TABLE IF NOT EXISTS `employers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `auth_user_id` bigint(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','WAITING_APPROVAL','WAITING_OTP') DEFAULT NULL,
  `company_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKqc5dry5qy5prsgul22acrt8am` (`email`),
  UNIQUE KEY `UKja5vd75vngrn92o2sj1kcxvry` (`company_id`),
  CONSTRAINT `FK9tmeja6paluk1wnagq2e2uimb` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table employer_db.employers: ~4 rows (approximately)
INSERT INTO `employers` (`id`, `auth_user_id`, `email`, `full_name`, `phone`, `position`, `status`, `company_id`) VALUES
	(1, 2, 'nguyenthaibao9a1tg2017@gmail.com', 'Nguyễn Thái Bảo', '0387776610', 'Giám đốc điều hành', 'APPROVED', 1),
	(2, 20, 'levantuan123@gmail.com', 'Lê Văn Tuấn', '0987654321', 'Trưởng phòng nhân sự', 'APPROVED', 2),
	(3, 21, 'nguyentuankiet111@gmail.com', 'Nguyễn Tuấn Kiệt', '0909198842', 'Giám đốc', 'PENDING', 3),
	(4, 65, 'vinatech.hr@gmail.com', 'VinaTech HR', '0909998888', 'HR Manager', 'APPROVED', 4);


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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table job_db.jobs: ~38 rows (approximately)
INSERT INTO `jobs` (`id`, `benefits`, `created_at`, `description`, `employer_id`, `end_date`, `job_type`, `location`, `reject_reason`, `requirements`, `salary`, `start_date`, `status`, `title`, `updated_at`) VALUES
	(1, 'Bảo hiểm, thưởng Tết, hỗ trợ học phí khóa học nâng cao', '2025-09-23 14:04:04.897697', 'Phát triển dịch vụ backend cho hệ thống tuyển dụng, sử dụng Java và Spring Boot.', 1, '2025-12-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Java","Spring Boot","SQL"],"experience":"2 năm Java","certificates":"TOEIC 700","career":"Backend Developer","descriptionRequirements":"Hoạt bát, năng động"}', '15-20 triệu', '2025-10-01', 'APPROVED', 'Java Backend Developer', '2025-09-23 17:31:32.365924'),
	(2, 'Thưởng quý, du lịch hằng năm', '2025-09-23 17:03:38.784357', 'Phân tích dữ liệu để hỗ trợ quyết định kinh doanh, làm việc với Python, ML.', 1, '2025-10-03', 'Parttime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Python","Machine Learning"],"experience":"3 năm Data","certificates":"Google Analytics","career":"Data Analyst","descriptionRequirements":"Kỹ năng giao tiếp tốt"}', '20-30 triệu', '2025-09-23', 'APPROVED', 'Data Scientist', '2025-09-23 17:37:55.084538'),
	(3, 'Laptop công ty, bảo hiểm, team building mỗi quý', '2025-09-26 09:10:00.000000', 'Thiết kế và phát triển giao diện web hiện đại bằng ReactJS.', 1, '2025-11-30', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["ReactJS","HTML","CSS","Redux"],"experience":"2 năm Frontend","career":"Frontend Developer"}', '18-25 triệu', '2025-10-05', 'APPROVED', 'Frontend Developer (ReactJS)', '2025-09-26 09:10:00.000000'),
	(4, 'Bảo hiểm sức khỏe, thưởng năng suất', '2025-09-27 08:20:00.000000', 'Triển khai giải pháp DevOps, CI/CD và quản lý hệ thống Cloud.', 1, '2025-12-15', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Docker","Kubernetes","CI/CD","Linux"],"experience":"3 năm DevOps","certificates":null,"career":"DevOps Engineer","descriptionRequirements":null}', '25-35 triệu', '2025-10-10', 'APPROVED', 'DevOps Engineer', '2025-10-23 17:03:10.011236'),
	(5, 'Thưởng dự án, xe đưa đón, bảo hiểm cao cấp', '2025-09-25 14:51:43.177943', 'Tham gia phát triển phần mềm nhúng cho thiết bị điện tử.', 2, '2026-02-28', 'Fulltime', 'Quận 1, TP. Hồ Chí Minh', NULL, '{"skills":["C","C++","Embedded Systems"],"experience":"3 năm Embedded","certificates":null,"career":"Embedded Engineer","descriptionRequirements":null}', '25-35 triệu', '2025-09-25', 'APPROVED', 'Kỹ sư phần mềm nhúng', '2025-11-29 09:40:48.010588'),
	(6, 'Ăn trưa miễn phí, thưởng cuối năm', '2025-09-25 15:38:50.216851', 'Thực hiện phân tích dữ liệu sản xuất, tối ưu hóa quy trình.', 2, '2025-11-23', 'Fulltime', 'Quận 1, TP. Hồ Chí Minh', NULL, '{"skills":["SQL","Python","Excel","Power BI"],"experience":"3 năm Data Analyst","certificates":null,"career":"Data Analyst","descriptionRequirements":null}', '18-28 triệu', '2025-09-25', 'APPROVED', 'Chuyên viên Phân tích Dữ liệu', '2025-10-31 14:02:46.546413'),
	(7, 'Hỗ trợ đào tạo, cơ hội thăng tiến nhanh', '2025-09-27 10:00:00.000000', 'Thiết kế mạch điện tử cho các thiết bị công nghệ cao.', 2, '2025-12-20', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Electronics","PCB","Microcontroller"],"experience":"2 năm Hardware","certificates":null,"career":"Electronics Engineer","descriptionRequirements":null}', '22-32 triệu', '2025-10-15', 'APPROVED', 'Kỹ sư Điện tử', '2025-11-29 09:53:43.386818'),
	(8, 'Bảo hiểm, du lịch hàng năm, môi trường quốc tế', '2025-09-28 09:15:00.000000', 'Quản lý dự án sản xuất thiết bị điện tử quy mô lớn.', 2, '2025-12-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Project Management","Agile","Manufacturing"],"experience":"5 năm quản lý dự án","certificates":"","career":"Project Manager","descriptionRequirements":"chăm chỉ, siêng năng"}', '30-45 triệu', '2025-10-20', 'APPROVED', 'Quản lý Dự án Sản xuất', '2025-11-29 08:50:09.850981'),
	(9, 'Hỗ trợ xăng xe, phụ cấp công trình, bảo hiểm tai nạn', '2025-09-29 08:00:00.000000', 'Quản lý thi công các công trình dân dụng và công nghiệp.', 3, '2025-12-31', 'Fulltime', 'Bình Dương', NULL, '{"skills":["Xây dựng","Quản lý dự án","An toàn lao động"],"experience":"5 năm Chỉ huy trưởng","career":"Construction Manager"}', '28-40 triệu', '2025-10-01', 'APPROVED', 'Chỉ huy trưởng công trình', '2025-09-29 08:00:00.000000'),
	(10, 'Bảo hiểm, thưởng công trình hoàn thành đúng hạn', '2025-09-29 09:30:00.000000', 'Thiết kế kết cấu công trình dân dụng.', 3, '2025-12-15', 'Fulltime', 'Bình Dương', NULL, '{"skills":["Kết cấu","AutoCAD","SAP2000"],"experience":"3 năm thiết kế","career":"Structural Engineer"}', '20-30 triệu', '2025-10-05', 'APPROVED', 'Kỹ sư Kết cấu', '2025-09-29 09:30:00.000000'),
	(11, 'Phụ cấp công trình xa, bảo hiểm tai nạn', '2025-09-30 08:15:00.000000', 'Giám sát công trình xây dựng nhà xưởng công nghiệp.', 3, '2025-12-25', 'Fulltime', 'Thuận An, Bình Dương', NULL, '{"skills":["Giám sát","Xây dựng","An toàn"],"experience":"3 năm giám sát","career":"Site Supervisor"}', '18-25 triệu', '2025-10-10', 'APPROVED', 'Giám sát công trình', '2025-09-30 08:15:00.000000'),
	(12, 'Hỗ trợ ăn ở, bảo hiểm lao động, thưởng hoàn thành công trình', '2025-09-30 10:45:00.000000', 'Triển khai bản vẽ thi công và bóc tách khối lượng.', 3, '2025-12-30', 'Fulltime', 'Bình Dương', NULL, '{"skills":["AutoCAD","Dự toán","Thi công"],"experience":"2 năm bóc tách","certificates":null,"career":"Kỹ sư Xây dựng","descriptionRequirements":null}', '15-22 triệu', '2025-10-12', 'APPROVED', 'Kỹ sư Xây dựng', '2025-10-30 11:27:32.621927'),
	(13, 'Bảo hiểm sức khỏe cao cấp, thưởng dự án, du lịch công ty hàng năm', '2025-10-01 16:23:21.037372', 'Thiết kế và phát triển các API hiệu suất cao cho hệ thống thương mại điện tử lớn.', 1, '2026-02-28', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Spring Cloud","Java","Microservices","Kafka","NoSQL"],"experience":"5 năm kinh nghiệm phát triển Java backend","certificates":"Chứng chỉ AWS Certified Developer","career":"Senior Backend Developer","descriptionRequirements":"Tư duy logic tốt, khả năng làm việc độc lập và team-work"}', '25-35 triệu', '2025-10-01', 'APPROVED', 'Senior Java Backend Developer', '2025-10-01 16:25:49.039988'),
	(14, 'Thưởng hiệu suất 2 lần/năm, trợ cấp ăn trưa, khám sức khỏe định kỳ', '2025-10-01 19:35:49.334874', 'Phát triển và bảo trì dịch vụ lõi cho nền tảng thanh toán trực tuyến.', 1, '2026-01-30', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Docker","PostgreSQL","Django","Python"],"experience":"3 năm kinh nghiệm Python/Django","certificates":"Không yêu cầu","career":"Backend Developer","descriptionRequirements":"Cẩn thận, tỉ mỉ, có trách nhiệm cao với dữ liệu"}', '18-25 triệu', '2025-10-01', 'APPROVED', 'Python Backend Developer (Fintech)', '2025-10-23 14:49:12.111501'),
	(15, 'nguyen thai bao nguyen thai bao', '2025-10-29 21:58:02.546158', 'việc nhẹ lương cao 500000000000000000000', 1, '2025-11-20', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["Python","Machine Learning"],"experience":"3 nam data","certificates":"Chung chi Google Analytics","career":"Data Analyst","descriptionRequirements":"nan5g5w5555555ssssssssssssssssssssssssssssssss v1"}', '20-30 trieu', '2025-10-29', 'APPROVED', 'Lập trình', '2025-10-29 22:11:31.990396'),
	(16, 'Lương tháng 13, bảo hiểm full, hỗ trợ làm việc từ xa 2 ngày/tuần', '2025-11-07 16:55:47.752397', 'Tham gia phát triển ứng dụng web frontend bằng ReactJS và TypeScript, phối hợp với đội backend', 1, '2025-12-31', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["ReactJS","TypeScript","REST API"],"experience":"1-3 năm","certificates":"Frontend Certificate","career":"Frontend Developer","descriptionRequirements":"Thích UI/UX, tư duy logic"}', '18-25 triệu', '2025-11-07', 'APPROVED', 'Frontend ReactJS Developer', '2025-11-29 08:55:42.552716'),
	(17, 'Thưởng dự án, bảo hiểm 100%, hỗ trợ chi phí học chứng chỉ AWS', '2025-11-07 17:02:15.876292', 'Thiết kế và triển khai hệ thống cloud backend sử dụng NodeJS và AWS Lambda', 1, '2025-12-28', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', NULL, '{"skills":["NodeJS","AWS Lambda","MongoDB"],"experience":"3 năm trở lên","certificates":"AWS Certified Developer","career":"Cloud Engineer","descriptionRequirements":"Chủ động, có khả năng giải quyết vấn đề"}', '25-35 triệu', '2025-11-07', 'APPROVED', 'Cloud Backend Engineer', '2025-12-01 05:34:35.824855'),
	(18, 'Làm việc quốc tế, hỗ trợ học tiếng Anh, thưởng performance 2 lần/năm', '2025-11-07 17:06:31.822637', 'Tham gia dự án quốc tế phát triển hệ thống ERP bằng Java & Angular', 1, '2025-12-21', 'Fulltime', 'Quận 3, TP. Hồ Chí Minh', 'không phù hợp với tiêu chuẩn', '{"skills":["Java","Angular","REST API"],"experience":"3 năm","certificates":"Fullstack Developer","career":"Fullstack Developer","descriptionRequirements":"Giao tiếp tốt, làm việc độc lập"}', '30-40 triệu', '2025-11-07', 'REJECTED', 'Fullstack Java-Angular Developer', '2025-11-29 09:17:47.546945'),
	(19, 'Bảo hiểm cao cấp, 16 ngày phép, Macbook Pro', '2025-11-10 10:00:00.000000', 'Phát triển ứng dụng Mobile đa nền tảng cho ngân hàng số', 1, '2026-03-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["React Native","TypeScript","Redux"],"experience":"3+ năm","career":"Mobile Developer"}', '25-40 triệu', '2025-11-01', 'APPROVED', 'Senior React Native Developer', '2025-11-10 10:00:00.000000'),
	(20, 'Thưởng lương tháng 13+14, cổ phiếu', '2025-11-12 14:20:00.000000', 'Xây dựng hệ thống thanh toán realtime, xử lý hàng triệu TPS', 2, '2026-04-15', 'Fulltime', 'TP. Hồ Chí Minh', 'không phù hợp với tiêu chuẩn', '{"skills":["Golang","Microservices","Kafka"],"experience":"4+ năm","certificates":null,"career":"Backend Engineer","descriptionRequirements":null}', '30-45 triệu', '2025-11-15', 'REJECTED', 'Backend Engineer (Golang)', '2025-12-02 09:04:35.835464'),
	(21, 'Remote 3 ngày/tuần, budget học tập 50tr/năm', '2025-11-15 09:30:00.000000', 'Xây dựng Data Lake, pipeline lớn trên AWS/GCP', 1, '2026-05-20', 'Fulltime', 'Hà Nội / TP.HCM (Hybrid)', NULL, '{"skills":["Python","Spark","Airflow","AWS"],"experience":"4+ năm","career":"Data Engineer"}', '35-50 triệu', '2025-11-20', 'APPROVED', 'Data Engineer (Senior)', '2025-11-15 09:30:00.000000'),
	(22, 'Du lịch team building 2 lần/năm', '2025-11-18 11:00:00.000000', 'Phát triển app thương mại điện tử', 4, '2026-02-28', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Flutter","Dart","Provider/GetX"],"experience":"2+ năm","certificates":null,"career":"Mobile Developer","descriptionRequirements":null}', '18-30 triệu', '2025-11-10', 'APPROVED', 'Flutter Mobile Developer', '2025-11-29 09:17:55.312632'),
	(23, 'Chứng chỉ AWS miễn phí', '2025-11-08 16:45:00.000000', 'Triển khai hạ tầng cloud-native', 1, '2026-01-31', 'Fulltime', 'Quận 1, TP.HCM', NULL, '{"skills":["Kubernetes","Terraform","CI/CD","AWS"],"experience":"3+ năm","career":"DevOps Engineer"}', '28-45 triệu', '2025-11-05', 'APPROVED', 'DevOps Engineer (Kubernetes)', '2025-11-08 16:45:00.000000'),
	(24, 'Đào tạo CEH, CISSP miễn phí', '2025-11-20 13:10:00.000000', 'Tham gia SOC, xử lý incident', 2, '2026-06-30', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["SIEM","Firewall","Penetration Testing"],"experience":"3+ năm","career":"Security Engineer"}', '30-50 triệu', '2025-11-25', 'APPROVED', 'Cybersecurity Specialist', '2025-11-20 13:10:00.000000'),
	(25, 'GPU cá nhân, hội thảo quốc tế', '2025-11-16 08:00:00.000000', 'Xây dựng mô hình LLM, computer vision', 1, '2026-12-31', 'Fulltime', 'Quận 3, TP.HCM', NULL, '{"skills":["Python","PyTorch","LLM","Docker"],"experience":"3+ năm","career":"ML Engineer"}', '40-70 triệu', '2025-11-18', 'APPROVED', 'AI/ML Engineer', '2025-11-16 08:00:00.000000'),
	(26, 'Làm việc hybrid, thưởng dự án', '2025-11-13 09:15:00.000000', 'Phát triển hệ thống ERP doanh nghiệp', 4, '2026-03-15', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["C#",".NET Core","Blazor","SQL Server"],"experience":"2+ năm"}', '22-35 triệu', '2025-11-12', 'APPROVED', 'Fullstack .NET Developer', '2025-11-13 09:15:00.000000'),
	(27, 'Cổ phiếu, du lịch quốc tế', '2025-11-19 14:30:00.000000', 'Quản lý sản phẩm từ ý tưởng đến ra mắt', 1, '2026-04-30', 'Fulltime', 'Quận 1, TP.HCM', NULL, '{"skills":["Agile","Jira","Figma"],"experience":"3+ năm","certificates":null,"career":null,"descriptionRequirements":null}', '30-50 triệu', '2025-11-20', 'APPROVED', 'Product Manager', '2025-11-29 09:23:55.888755'),
	(28, 'Hỗ trợ ăn ở, xe đưa đón', '2025-11-14 10:00:00.000000', 'Phát triển firmware cho thiết bị IoT', 2, '2026-02-28', 'Fulltime', 'Bình Dương', 'không phù hợp', '{"skills":["C","Embedded Linux","RTOS"],"experience":"2+ năm","certificates":null,"career":null,"descriptionRequirements":null}', '20-32 triệu', '2025-11-15', 'APPROVED', 'Embedded Software Engineer', '2025-12-02 08:50:12.720651'),
	(29, 'Đào tạo chứng chỉ CBAP', '2025-11-22 11:20:00.000000', 'Phân tích yêu cầu, viết BRD', 4, '2026-05-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["SQL","UML","Jira"],"experience":"1+ năm"}', '18-28 triệu', '2025-11-25', 'APPROVED', 'Business Analyst', '2025-11-22 11:20:00.000000'),
	(30, 'Remote full, thiết bị test', '2025-11-25 15:45:00.000000', 'Xây dựng framework test tự động', 1, '2026-06-30', 'Fulltime', 'Hà Nội', NULL, '{"skills":["Selenium","Cypress","Java"],"experience":"2+ năm","certificates":null,"career":null,"descriptionRequirements":null}', '20-30 triệu', '2025-11-28', 'APPROVED', 'QA Automation Engineer', '2025-11-29 09:25:27.369630'),
	(31, 'Chứng chỉ AWS miễn phí', '2025-11-27 09:00:00.000000', 'Thiết kế kiến trúc cloud', 4, '2026-07-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["AWS","Terraform","Docker"],"experience":"3+ năm"}', '28-45 triệu', '2025-11-30', 'APPROVED', 'Cloud Engineer (AWS)', '2025-11-27 09:00:00.000000'),
	(32, 'Remote 4 ngày/tuần', '2025-11-29 13:30:00.000000', 'Phát triển dashboard quản trị', 2, '2026-08-15', 'Fulltime', 'Đà Nẵng', NULL, '{"skills":["Vue.js","Nuxt.js","Vuetify"],"experience":"2+ năm"}', '18-28 triệu', '2025-12-01', 'APPROVED', 'Frontend Vue.js Developer', '2025-11-29 13:30:00.000000'),
	(33, 'Hỗ trợ chứng chỉ Linux', '2025-12-02 10:15:00.000000', 'Quản trị server, backup', 1, '2026-09-30', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Linux","Docker","Nginx"],"experience":"2+ năm","certificates":null,"career":null,"descriptionRequirements":null}', '20-30 triệu', '2025-12-05', 'APPROVED', 'System Administrator', '2025-11-29 09:32:59.229063'),
	(34, 'Đào tạo DAX, M Query', '2025-12-07 11:00:00.000000', 'Xây dựng báo cáo kinh doanh', 4, '2026-10-31', 'Fulltime', 'Hà Nội', NULL, '{"skills":["Power BI","SQL","DAX"],"experience":"1+ năm"}', '18-25 triệu', '2025-12-10', 'APPROVED', 'Data Analyst (Power BI)', '2025-12-07 11:00:00.000000'),
	(35, 'Làm việc hybrid', '2025-12-12 14:20:00.000000', 'Phát triển CRM nội bộ', 2, '2026-11-30', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["PHP","Laravel","MySQL"],"experience":"2+ năm","certificates":null,"career":null,"descriptionRequirements":null}', '18-28 triệu', '2025-12-15', 'APPROVED', 'PHP Laravel Developer', '2025-12-02 08:59:46.258360'),
	(36, 'Macbook Pro, iPhone test', '2025-12-17 09:45:00.000000', 'Phát triển app ngân hàng', 1, '2026-12-31', 'Fulltime', 'Hà Nội', 'không phù hợp\n', '{"skills":["Swift","SwiftUI","Xcode"],"experience":"3+ năm","certificates":null,"career":null,"descriptionRequirements":null}', '25-40 triệu', '2025-12-20', 'REJECTED', 'iOS Developer (Swift)', '2025-11-29 09:34:21.949239'),
	(37, 'Thiết bị test cao cấp', '2025-12-22 16:00:00.000000', 'Phát triển app giao hàng', 4, '2027-01-31', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Kotlin","Jetpack","Retrofit"],"experience":"2+ năm"}', '22-35 triệu', '2025-12-25', 'APPROVED', 'Android Developer (Kotlin)', '2025-12-22 16:00:00.000000'),
	(38, 'Chứng chỉ CCNP Security', '2025-12-28 10:30:00.000000', 'Thiết kế mạng an toàn', 2, '2027-02-28', 'Fulltime', 'TP. Hồ Chí Minh', NULL, '{"skills":["Firewall","VPN","IDS/IPS"],"experience":"3+ năm"}', '28-45 triệu', '2026-01-01', 'PENDING', 'Network Security Engineer', '2025-12-28 10:30:00.000000');


-- Dumping database structure for message_db
CREATE DATABASE IF NOT EXISTS `message_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `message_db`;

-- Dumping structure for table message_db.conversations
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `candidate_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `employer_id` bigint(20) DEFAULT NULL,
  `last_message` varchar(255) DEFAULT NULL,
  `last_message_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe5whawrnqrlwxp02dxx16w8mp` (`candidate_id`,`employer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table message_db.conversations: ~9 rows (approximately)
INSERT INTO `conversations` (`id`, `candidate_id`, `created_at`, `employer_id`, `last_message`, `last_message_at`) VALUES
	(2, 3, NULL, 1, 'em muốn ứng tuyển vào vị trí...', '2025-11-25 11:15:23.200337'),
	(3, 3, NULL, 2, 'tuần nghỉ 7 cn', '2025-12-02 10:30:41.342724'),
	(4, 3, NULL, 3, 'công ty đã phá sản', '2025-11-18 09:37:55.629237'),
	(5, 35, NULL, 1, 'Dạ em rảnh thứ 6 ạ', '2025-11-19 09:30:15.561724'),
	(6, 37, NULL, 2, 'Em có thể gửi thêm portfolio không ạ?', '2025-11-20 14:45:22.483835'),
	(7, 61, NULL, 2, 'bạn có thể vào trang tôi coi lại danh sách công việc nào phù hợp', '2025-12-02 10:30:09.681979'),
	(8, 3, NULL, 4, NULL, NULL),
	(9, 61, NULL, 4, NULL, NULL),
	(10, 61, NULL, 1, NULL, NULL);

-- Dumping structure for table message_db.conversation_jobs
CREATE TABLE IF NOT EXISTS `conversation_jobs` (
  `conversation_id` bigint(20) NOT NULL,
  `job_id` bigint(20) DEFAULT NULL,
  KEY `FKpj5xqydxyern2qltu58rp9k5i` (`conversation_id`),
  CONSTRAINT `FKpj5xqydxyern2qltu58rp9k5i` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table message_db.conversation_jobs: ~13 rows (approximately)
INSERT INTO `conversation_jobs` (`conversation_id`, `job_id`) VALUES
	(2, 14),
	(2, 17),
	(3, 7),
	(4, 12),
	(5, 19),
	(6, 20),
	(2, 25),
	(3, 38),
	(7, 35),
	(3, 35),
	(8, 37),
	(9, 37),
	(10, 16);

-- Dumping structure for table message_db.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `conversation_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `sender_id` bigint(20) DEFAULT NULL,
  `sender_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table message_db.messages: ~76 rows (approximately)
INSERT INTO `messages` (`id`, `content`, `conversation_id`, `created_at`, `is_read`, `read_at`, `sender_id`, `sender_type`) VALUES
	(1, 'Xin chào', 2, '2025-11-15 21:07:10.317485', b'1', '2025-11-15 14:09:02.375133', 3, 'USER'),
	(2, 'hello', 2, '2025-11-15 21:09:11.306269', b'1', '2025-11-15 14:10:30.525861', 1, 'EMPLOYER'),
	(3, '2', 2, '2025-11-15 21:10:36.087832', b'1', '2025-11-15 14:23:38.673052', 3, 'USER'),
	(4, '3', 2, '2025-11-15 21:10:46.381058', b'1', '2025-11-15 14:11:14.912583', 1, 'EMPLOYER'),
	(5, '4', 2, '2025-11-15 21:10:53.155445', b'1', '2025-11-15 14:23:38.673052', 3, 'USER'),
	(6, '5', 2, '2025-11-15 21:11:01.555258', b'1', '2025-11-15 14:11:14.912583', 1, 'EMPLOYER'),
	(7, '13213', 2, '2025-11-15 21:17:52.256031', b'1', '2025-11-15 14:23:38.673052', 3, 'USER'),
	(8, 'Khi tôi nhắn', 2, '2025-11-15 21:25:31.446690', b'1', '2025-11-15 14:28:26.411619', 3, 'USER'),
	(9, 'bên này thì sao', 2, '2025-11-15 21:28:19.056813', b'1', '2025-11-15 14:31:01.517417', 1, 'EMPLOYER'),
	(10, 'ok', 2, '2025-11-15 21:31:05.730630', b'1', '2025-11-24 10:06:21.410236', 3, 'USER'),
	(11, 'ok', 2, '2025-11-15 21:31:14.155880', b'1', '2025-11-24 10:06:21.410236', 3, 'USER'),
	(12, '1 2 3', 2, '2025-11-15 21:33:03.120118', b'1', '2025-11-24 10:06:21.410236', 3, 'USER'),
	(13, 'hello', 3, '2025-11-18 15:27:08.101492', b'1', '2025-11-18 08:27:11.110207', 3, 'USER'),
	(14, 'chào bạn', 3, '2025-11-18 15:27:42.443796', b'1', '2025-11-18 08:27:48.737805', 2, 'EMPLOYER'),
	(15, 'Chào ad', 4, '2025-11-18 16:01:05.453675', b'0', NULL, 3, 'USER'),
	(16, '123', 4, '2025-11-18 16:01:54.577086', b'0', NULL, 3, 'USER'),
	(17, 'sssss', 4, '2025-11-18 16:03:09.596601', b'0', NULL, 3, 'USER'),
	(18, 'cảm ơn', 4, '2025-11-18 16:06:00.442586', b'0', NULL, 3, 'USER'),
	(19, '123', 4, '2025-11-18 16:06:11.256913', b'0', NULL, 3, 'EMPLOYER'),
	(20, 'aaa', 4, '2025-11-18 16:06:22.739689', b'0', NULL, 3, 'USER'),
	(21, 'chào bạn', 4, '2025-11-18 16:07:53.023314', b'0', NULL, 3, 'EMPLOYER'),
	(22, 'hello', 4, '2025-11-18 16:08:06.876657', b'0', NULL, 3, 'USER'),
	(23, '132', 2, '2025-11-18 16:09:15.557019', b'1', '2025-11-24 10:06:21.410236', 3, 'USER'),
	(24, 'chào bạn', 4, '2025-11-18 16:09:47.883442', b'0', NULL, 3, 'EMPLOYER'),
	(25, 'xin chào', 3, '2025-11-18 16:10:29.019876', b'1', '2025-11-18 09:10:48.369965', 3, 'USER'),
	(26, 'xin chào', 3, '2025-11-18 16:10:53.935581', b'1', '2025-11-18 09:11:03.364171', 2, 'EMPLOYER'),
	(27, 'tôi muốn hỏi công việc', 3, '2025-11-18 16:11:17.459254', b'1', '2025-11-18 09:11:21.146628', 3, 'USER'),
	(28, 'tôi muốn hỏi công việc', 3, '2025-11-18 16:11:30.700615', b'1', '2025-11-18 09:14:49.386794', 2, 'EMPLOYER'),
	(29, 'chào bạn', 3, '2025-11-18 16:14:55.786688', b'1', '2025-11-18 09:15:17.649617', 3, 'USER'),
	(30, 'tôi có thể giúp gì cho bạn', 3, '2025-11-18 16:15:17.481443', b'1', '2025-11-18 09:31:49.237427', 2, 'EMPLOYER'),
	(31, 'Em muốn được tư vấn công việc...', 4, '2025-11-18 16:32:15.517444', b'0', NULL, 3, 'USER'),
	(32, 'công việc nào bạn', 4, '2025-11-18 16:32:56.574299', b'0', NULL, 3, 'EMPLOYER'),
	(33, 'kha kha kh', 4, '2025-11-18 16:34:09.703468', b'0', NULL, 3, 'EMPLOYER'),
	(34, 'fdfdfdfd', 4, '2025-11-18 16:34:44.745496', b'0', NULL, 3, 'EMPLOYER'),
	(35, 'hahahaa', 4, '2025-11-18 16:35:47.705887', b'0', NULL, 3, 'USER'),
	(36, 'sđfđfdf', 4, '2025-11-18 16:36:14.469990', b'0', NULL, 3, 'EMPLOYER'),
	(37, 'công ty đã phá sản', 4, '2025-11-18 16:37:55.626295', b'0', NULL, 3, 'EMPLOYER'),
	(38, 'Chào anh, em vừa ứng tuyển vị trí React Native ạ', 5, '2025-11-19 09:20:00.317485', b'1', '2025-11-19 09:22:00.375133', 35, 'USER'),
	(39, 'Chào em, anh đã nhận được CV. Em có thể phỏng vấn online thứ 6 tuần này không?', 5, '2025-11-19 09:25:00.306269', b'1', '2025-11-19 09:27:30.525861', 1, 'EMPLOYER'),
	(40, 'Dạ được ạ, em rảnh từ 14h trở đi', 5, '2025-11-19 09:27:00.087832', b'1', '2025-11-24 10:06:25.558982', 35, 'USER'),
	(41, 'Ok em, anh sẽ gửi link Zoom nhé', 5, '2025-11-19 09:30:15.557019', b'0', NULL, 1, 'EMPLOYER'),
	(42, 'Chào chị, em ứng tuyển vị trí NodeJS ạ', 6, '2025-11-20 14:30:00.101492', b'1', '2025-11-20 14:32:11.110207', 37, 'USER'),
	(43, 'Chào em, chị thấy CV em rất tốt. Em có thể gửi thêm portfolio không ạ?', 6, '2025-11-20 14:35:00.443796', b'1', '2025-11-20 14:37:48.737805', 2, 'EMPLOYER'),
	(44, 'Dạ em gửi ngay ạ', 6, '2025-11-20 14:40:00.453675', b'1', '2025-12-02 09:53:44.878772', 37, 'USER'),
	(45, 'Em có thể gửi thêm portfolio không ạ?', 6, '2025-11-20 14:45:22.626295', b'1', '2025-12-02 09:53:44.878772', 37, 'USER'),
	(46, 'chào bạn', 2, '2025-11-25 18:14:21.143484', b'1', '2025-11-25 11:15:00.157285', 1, 'EMPLOYER'),
	(47, 'chào bạn', 2, '2025-11-25 18:14:42.136075', b'1', '2025-11-25 11:15:00.157285', 1, 'EMPLOYER'),
	(48, 'em muốn ứng tuyển vào vị trí...', 2, '2025-11-25 18:15:23.193987', b'1', '2025-11-25 13:08:23.060973', 3, 'USER'),
	(49, 'alo', 3, '2025-11-28 18:27:04.096152', b'1', '2025-11-28 11:27:18.563323', 2, 'EMPLOYER'),
	(50, 'hello', 3, '2025-11-28 18:30:38.761481', b'1', '2025-11-28 11:30:44.528109', 3, 'USER'),
	(51, 'xin chào', 3, '2025-11-28 18:30:50.076111', b'1', '2025-11-28 11:30:55.727824', 2, 'EMPLOYER'),
	(52, 'ok', 3, '2025-11-28 18:30:55.789457', b'1', '2025-12-02 09:53:58.883952', 3, 'USER'),
	(53, 'Hello. Tôi đang có 1 ví trí mới bạn có hứng thú không ?', 3, '2025-12-02 16:54:53.019754', b'1', '2025-12-02 09:57:31.599939', 2, 'EMPLOYER'),
	(54, 'vị trí nào vậy ạ', 3, '2025-12-02 16:57:59.549114', b'1', '2025-12-02 09:58:32.380970', 3, 'USER'),
	(55, 'dev', 3, '2025-12-02 16:58:47.225558', b'1', '2025-12-02 09:59:00.141874', 2, 'EMPLOYER'),
	(56, 'còn vị trí nào khác không', 3, '2025-12-02 17:00:56.707368', b'1', '2025-12-02 10:01:10.423638', 3, 'USER'),
	(57, 'Bạn mong muốn vị trí nào', 3, '2025-12-02 17:05:59.090504', b'1', '2025-12-02 10:06:19.379097', 2, 'EMPLOYER'),
	(58, 'test', 3, '2025-12-02 17:06:54.315738', b'1', '2025-12-02 10:07:37.675787', 3, 'USER'),
	(59, 'hoặc là desgin', 3, '2025-12-02 17:07:11.969196', b'1', '2025-12-02 10:07:37.675787', 3, 'USER'),
	(60, 'test thì tôi đã full', 3, '2025-12-02 17:22:48.706727', b'1', '2025-12-02 10:23:24.400988', 2, 'EMPLOYER'),
	(61, 'tôi còn desgin', 3, '2025-12-02 17:23:15.957330', b'1', '2025-12-02 10:23:24.400988', 2, 'EMPLOYER'),
	(62, 'xin chào', 7, '2025-12-02 17:25:02.677281', b'1', '2025-12-02 10:27:16.465678', 61, 'USER'),
	(63, 'lương như nào ạ', 3, '2025-12-02 17:25:44.790980', b'1', '2025-12-02 10:26:39.581892', 3, 'USER'),
	(64, 'hãy tư vấn thêm cho tôi công việc bên bạn', 7, '2025-12-02 17:26:18.883068', b'1', '2025-12-02 10:27:16.465678', 61, 'USER'),
	(65, 'đãi ngộ như nào ạ', 3, '2025-12-02 17:26:36.074922', b'1', '2025-12-02 10:26:39.581892', 3, 'USER'),
	(66, 'nếu thử việc thì 8tr', 3, '2025-12-02 17:27:10.104673', b'1', '2025-12-02 10:28:08.733526', 2, 'EMPLOYER'),
	(67, 'chính thức 10tr', 3, '2025-12-02 17:27:14.777570', b'1', '2025-12-02 10:28:08.733526', 2, 'EMPLOYER'),
	(68, 'bạn muốn ứng tuyển công việc gì', 7, '2025-12-02 17:27:35.383028', b'1', '2025-12-02 10:27:59.046088', 2, 'EMPLOYER'),
	(69, 'vậy còn đãi ngộ', 3, '2025-12-02 17:28:27.722036', b'1', '2025-12-02 10:30:14.471416', 3, 'USER'),
	(70, 'tôi muốn ứng tuyển vào dev', 7, '2025-12-02 17:28:48.339523', b'1', '2025-12-02 10:29:05.066932', 61, 'USER'),
	(71, 'test cũng được ạ', 7, '2025-12-02 17:28:55.445192', b'1', '2025-12-02 10:29:05.066932', 61, 'USER'),
	(72, '2 vị trí đó tạm thời không còn ạ', 7, '2025-12-02 17:29:41.858411', b'1', '2025-12-02 10:30:48.310272', 2, 'EMPLOYER'),
	(73, 'bạn có thể vào trang tôi coi lại danh sách công việc nào phù hợp', 7, '2025-12-02 17:30:09.676357', b'1', '2025-12-02 10:30:48.310272', 2, 'EMPLOYER'),
	(74, '1 năm được du lịch 2 lần', 3, '2025-12-02 17:30:27.396311', b'1', '2025-12-02 10:30:59.657422', 2, 'EMPLOYER'),
	(75, 'thưởng tháng 13', 3, '2025-12-02 17:30:34.446561', b'1', '2025-12-02 10:30:59.657422', 2, 'EMPLOYER'),
	(76, 'tuần nghỉ 7 cn', 3, '2025-12-02 17:30:41.339874', b'1', '2025-12-02 10:30:59.657422', 2, 'EMPLOYER');

-- Dumping structure for table message_db.unread_counts
CREATE TABLE IF NOT EXISTS `unread_counts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint(20) DEFAULT NULL,
  `count` int(11) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5q8gnas0cdxsh2d90b8vroxfx` (`conversation_id`,`user_id`,`user_type`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table message_db.unread_counts: ~18 rows (approximately)
INSERT INTO `unread_counts` (`id`, `conversation_id`, `count`, `user_id`, `user_type`) VALUES
	(3, 2, 0, 3, 'USER'),
	(4, 2, 0, 1, 'EMPLOYER'),
	(5, 3, 0, 3, 'USER'),
	(6, 3, 0, 2, 'EMPLOYER'),
	(7, 4, 0, 3, 'USER'),
	(8, 4, 0, 3, 'EMPLOYER'),
	(9, 5, 0, 35, 'USER'),
	(10, 5, 0, 1, 'EMPLOYER'),
	(11, 6, 0, 37, 'USER'),
	(12, 6, 0, 2, 'EMPLOYER'),
	(13, 7, 0, 61, 'USER'),
	(14, 7, 0, 2, 'EMPLOYER'),
	(15, 8, 0, 3, 'USER'),
	(16, 8, 0, 4, 'EMPLOYER'),
	(17, 9, 0, 61, 'USER'),
	(18, 9, 0, 4, 'EMPLOYER'),
	(19, 10, 0, 61, 'USER'),
	(20, 10, 0, 1, 'EMPLOYER');


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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table notification_db.notifications: ~62 rows (approximately)
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
	(27, '2025-11-07 17:02:57.024552', 'Tin tuyển dụng "Cloud Backend Engineer" của bạn đã được phê duyệt.', b'1', 1, 'Tin tuyển dụng được duyệt'),
	(28, '2025-11-19 10:35:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí Senior React Native đã được duyệt.', b'0', 35, 'Hồ sơ được duyệt'),
	(29, '2025-11-19 15:00:00.000000', 'Hồ sơ ứng tuyển vị trí Frontend bị từ chối.', b'1', 36, 'Hồ sơ bị từ chối'),
	(30, '2025-11-20 09:00:00.000000', 'Bạn có ứng viên mới ứng tuyển vị trí Golang Backend', b'1', 2, 'Ứng viên mới'),
	(31, '2025-11-21 12:15:00.000000', 'Tin tuyển dụng AI/ML Engineer đã được duyệt.', b'1', 1, 'Tin tuyển dụng được duyệt'),
	(32, '2025-11-22 14:30:00.000000', 'Nguyễn Văn Hoàng đã ứng tuyển vào vị trí Fullstack .NET', b'0', 4, 'Ứng viên mới'),
	(33, '2025-11-23 10:45:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí DevOps đã được duyệt.', b'1', 42, 'Hồ sơ được duyệt'),
	(34, '2025-11-24 16:20:00.000000', 'Tin tuyển dụng Flutter Developer đang chờ duyệt.', b'0', 4, 'Tin đang chờ duyệt'),
	(35, '2025-11-25 11:55:00.000000', 'Bạn có 3 ứng viên mới cho vị trí Cybersecurity', b'1', 2, 'Ứng viên mới'),
	(36, '2025-11-26 13:40:00.000000', 'Hồ sơ ứng tuyển vị trí Product Manager bị từ chối.', b'0', 46, 'Hồ sơ bị từ chối'),
	(37, '2025-11-27 15:15:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí Embedded đã được duyệt.', b'1', 47, 'Hồ sơ được duyệt'),
	(38, '2025-11-28 09:30:00.000000', 'Tin tuyển dụng QA Automation đã được duyệt.', b'0', 1, 'Tin tuyển dụng được duyệt'),
	(39, '2025-11-29 14:45:00.000000', 'Bạn có ứng viên mới ứng tuyển vị trí Cloud Engineer', b'1', 4, 'Ứng viên mới'),
	(40, '2025-11-30 10:20:00.000000', 'Hồ sơ ứng tuyển vị trí Vue.js Developer đang chờ xử lý.', b'0', 52, 'Hồ sơ đang chờ'),
	(41, '2025-12-01 12:55:00.000000', 'Tin tuyển dụng System Admin bị từ chối.', b'1', 1, 'Tin bị từ chối'),
	(42, '2025-12-02 16:10:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí Data Analyst đã được duyệt.', b'0', 54, 'Hồ sơ được duyệt'),
	(43, '2025-12-03 11:35:00.000000', 'Bạn có 2 ứng viên mới cho vị trí PHP Laravel', b'1', 2, 'Ứng viên mới'),
	(44, '2025-12-04 14:50:00.000000', 'Hồ sơ ứng tuyển vị trí iOS Developer đang chờ duyệt.', b'0', 56, 'Hồ sơ đang chờ'),
	(45, '2025-12-05 09:25:00.000000', 'Tin tuyển dụng Android Developer đã được duyệt.', b'1', 4, 'Tin tuyển dụng được duyệt'),
	(46, '2025-12-06 13:40:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí Network Security đã được duyệt.', b'0', 58, 'Hồ sơ được duyệt'),
	(47, '2025-12-07 15:55:00.000000', 'Bạn đã nhận được 5 bình luận mới từ ứng viên.', b'1', 1, 'Bình luận mới'),
	(48, '2025-12-08 10:30:00.000000', 'Tin tuyển dụng mới của bạn đã được duyệt.', b'0', 4, 'Tin tuyển dụng được duyệt'),
	(49, '2025-12-09 12:45:00.000000', 'Có 4 ứng viên mới ứng tuyển trong 24h qua.', b'1', 2, 'Ứng viên mới'),
	(50, '2025-12-10 14:20:00.000000', 'Hồ sơ ứng tuyển vị trí Fullstack Python bị từ chối.', b'0', 62, 'Hồ sơ bị từ chối'),
	(51, '2025-12-11 16:35:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí DBA đã được duyệt.', b'1', 63, 'Hồ sơ được duyệt'),
	(52, '2025-12-12 11:10:00.000000', 'Tin tuyển dụng IT Support đang chờ duyệt.', b'1', 1, 'Tin đang chờ duyệt'),
	(53, '2025-12-13 13:25:00.000000', 'Bạn có tin nhắn mới từ ứng viên.', b'1', 35, 'Tin nhắn mới'),
	(54, '2025-12-14 15:40:00.000000', 'Hồ sơ ứng tuyển vị trí Graphic Designer đã được duyệt.', b'1', 61, 'Hồ sơ được duyệt'),
	(55, '2025-12-15 09:55:00.000000', 'Tin tuyển dụng Marketing Executive bị từ chối.', b'1', 4, 'Tin bị từ chối'),
	(56, '2025-12-16 12:00:00.000000', 'Chúc mừng! Hồ sơ ứng tuyển vị trí HR Specialist đã được duyệt.', b'0', 60, 'Hồ sơ được duyệt'),
	(57, '2025-12-17 14:15:00.000000', 'Bạn có 3 ứng viên mới cho vị trí Senior React Native', b'1', 1, 'Ứng viên mới'),
	(58, '2025-12-02 08:59:46.438762', 'Tin tuyển dụng "PHP Laravel Developer" của bạn đã được phê duyệt.', b'1', 2, 'Tin tuyển dụng được duyệt'),
	(60, '2025-12-02 09:04:35.952681', 'Tin "Backend Engineer (Golang)" của bạn đã bị từ chối. Lý do: không phù hợp với tiêu chuẩn', b'1', 2, 'Tin tuyển dụng bị từ chối'),
	(61, '2025-12-02 09:22:46.390917', 'Hoàng Thị Kim Ngọc đã ứng tuyển vào tin "PHP Laravel Developer"', b'1', 2, 'Ứng viên mới ứng tuyển'),
	(62, '2025-12-02 09:23:19.256742', 'Chúc mừng! Hồ sơ ứng tuyển của bạn vào tin "PHP Laravel Developer" đã được duyệt.', b'1', 61, 'Hồ sơ ứng tuyển được duyệt'),
	(63, '2025-12-02 09:23:35.121892', 'Hồ sơ ứng tuyển vào tin "PHP Laravel Developer" bị từ chối. Lý do: Không phù hợp', b'1', 3, 'Hồ sơ ứng tuyển bị từ chối');


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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table payment_db.payment: ~6 rows (approximately)
INSERT INTO `payment` (`id`, `amount`, `created_at`, `method`, `order_id`, `pay_url`, `qr_code_url`, `recruiter_id`, `status`, `updated_at`, `plan_id`) VALUES
	(1, 499000, '2025-10-23 13:48:54.238396', 'Momo', 'ORD-1761202134234', NULL, NULL, 2, 'SUCCESS', '2025-10-23 13:48:57.128779', 1),
	(2, 499000, '2025-11-04 11:34:13.704173', 'Momo', 'ORD-1762230853704', NULL, NULL, 20, 'SUCCESS', '2025-11-04 11:34:16.772244', 1),
	(3, 1499000, '2025-11-04 11:35:07.021005', 'Momo', 'ORD-1762230907021', NULL, NULL, 20, 'SUCCESS', '2025-11-04 11:35:10.035500', 2),
	(4, 1499000, '2025-11-07 16:49:49.490217', 'Momo', 'ORD-1762508989489', NULL, NULL, 2, 'SUCCESS', '2025-11-07 16:49:54.397861', 2),
	(5, 2499000, '2025-11-24 07:44:24.808780', 'Mã QR Ngân Hàng', 'ORD-1763970264807', NULL, NULL, 2, 'PENDING', NULL, 3),
	(6, 2499000, '2025-11-25 13:06:50.487638', 'Mã QR Ngân Hàng', 'ORD-1764076010483', NULL, NULL, 2, 'PENDING', NULL, 3);

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

-- Dumping data for table payment_db.subscription: ~3 rows (approximately)
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

-- Dumping data for table profile_db.candidates: ~47 rows (approximately)
INSERT INTO `candidates` (`id`, `address`, `career_goal`, `dob`, `email`, `full_name`, `gender`, `hobbies`, `phone`, `role`, `social`) VALUES
	(3, 'Quận 1, TP. Hồ Chí Minh', 'Trở thành chuyên gia backend, tối ưu hiệu năng và mở rộng hệ thống.\n', '2002-01-09', 'tranloi09012002@gmail.com', 'Trần Văn Lợi', 0, 'Đọc sách công nghệ, tham gia hackathon\n', '0901234567', 'USER', 'linkedin.com/in/nguyenvana'),
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
	(32, 'Hà Nội', 'Senior Fullstack Engineer', '2003-02-10', 'bao123nguyen456@gmail.com', 'Nguyễn Thái Bảo', 0, 'Code, Du lịch', '0387776610', 'USER', 'https://linkedin.com/in/nguyenvana'),
	(35, 'Quận Tân Bình, TP.HCM', 'Senior React Native Developer', '1995-07-12', 'leminhduc95@gmail.com', 'Lê Minh Đức', 0, 'Chơi guitar, chạy bộ', '0901234561', 'USER', 'linkedin.com/in/leminhduc95'),
	(36, 'Quận 7, TP.HCM', 'Frontend Engineer (Vue/React)', '1999-03-18', 'phamthuytrang99@gmail.com', 'Phạm Thùy Trang', 1, 'Vẽ tranh, yoga', '0912345672', 'USER', 'linkedin.com/in/phamthuytrang99'),
	(37, 'Bình Thạnh, TP.HCM', 'Backend NodeJS Engineer', '2000-11-25', 'tranquanghuy2000@gmail.com', 'Trần Quang Huy', 0, 'Game online, gym', '0923456783', 'USER', 'linkedin.com/in/tranquanghuy2000'),
	(38, 'Quận 3, TP.HCM', 'Data Engineer', '2002-05-30', 'nguyenthiphuongthao02@gmail.com', 'Nguyễn Thị Phương Thảo', 1, 'Du lịch, chụp ảnh', '0934567894', 'USER', 'linkedin.com/in/phuongthao02'),
	(39, 'Thủ Đức, TP.HCM', 'Flutter Mobile Developer', '2001-09-15', 'vohoangnam2001@gmail.com', 'Võ Hoàng Nam', 0, 'Bóng rổ, đọc sách', '0945678905', 'USER', 'linkedin.com/in/vohoangnam2001'),
	(40, 'Quận 10, TP.HCM', 'Golang Backend Developer', '2003-01-08', 'dangkhoi2003@gmail.com', 'Đặng Khoa', 0, 'Code, cà phê', '0956789016', 'USER', 'linkedin.com/in/dangkhoa2003'),
	(41, 'Gò Vấp, TP.HCM', 'UI/UX Designer', '2000-12-20', 'huynhthikimngan@gmail.com', 'Huỳnh Thị Kim Ngân', 1, 'Thiết kế, nghe nhạc', '0967890127', 'USER', 'linkedin.com/in/kimngan'),
	(42, 'Bình Tân, TP.HCM', 'DevOps Engineer', '1998-06-14', 'buiquangvinh98@gmail.com', 'Bùi Quang Vinh', 0, 'Linux, xe máy', '0978901238', 'USER', 'linkedin.com/in/quangvinh98'),
	(43, 'Quận 9, TP.HCM', 'Cybersecurity Analyst', '2002-08-22', 'trinhthidiemmy2002@gmail.com', 'Trịnh Thị Diễm My', 1, 'CTF, phim kinh dị', '0989012349', 'USER', 'linkedin.com/in/diemmy2002'),
	(44, 'Quận Phú Nhuận, TP.HCM', 'Fullstack .NET Developer', '2000-04-05', 'nguyenvanhoang2000@gmail.com', 'Nguyễn Văn Hoàng', 0, 'Bóng đá, code', '0901122334', 'USER', 'linkedin.com/in/vanhoang2000'),
	(45, 'Quận 1, TP.HCM', 'AI/ML Engineer', '1997-10-20', 'vutiendat1997@gmail.com', 'Vũ Tiến Đạt', 0, 'Deep Learning, đọc sách', '0902233445', 'USER', 'linkedin.com/in/tiendat1997'),
	(46, 'Quận 4, TP.HCM', 'Product Manager', '2001-06-11', 'tranthingocanh2001@gmail.com', 'Trần Thị Ngọc Ánh', 1, 'Viết blog, du lịch', '0903344556', 'USER', 'linkedin.com/in/ngocanh2001'),
	(47, 'Bình Dương', 'Embedded Engineer', '1999-02-28', 'nguyenvanhung1999@gmail.com', 'Nguyễn Văn Hùng', 0, 'Điện tử, xe máy', '0904455667', 'USER', 'linkedin.com/in/vanhung1999'),
	(48, 'Hà Nội', 'Business Analyst', '2000-09-03', 'dinhthilan2000@gmail.com', 'Đinh Thị Lan', 1, 'Phân tích dữ liệu, yoga', '0905566778', 'USER', 'linkedin.com/in/thilan2000'),
	(49, 'Đà Nẵng', 'QA Engineer', '2002-12-17', 'phamquangminh2002@gmail.com', 'Phạm Quang Minh', 0, 'Test tự động, game', '0906677889', 'USER', 'linkedin.com/in/quangminh2002'),
	(50, 'Quận 12, TP.HCM', 'Mobile Developer (React Native)', '1998-11-05', 'lethikimlien1998@gmail.com', 'Lê Thị Kim Liên', 1, 'Thiết kế app, nấu ăn', '0907788990', 'USER', 'linkedin.com/in/kimlien1998'),
	(51, 'Cần Thơ', 'Cloud Engineer', '2001-03-22', 'hoangvanthanh2001@gmail.com', 'Hoàng Văn Thành', 0, 'AWS, GCP', '0908899001', 'USER', 'linkedin.com/in/vanthanh2001'),
	(52, 'Quận 8, TP.HCM', 'Frontend Developer (Vue)', '2003-07-14', 'nguyenthiphuonglinh2003@gmail.com', 'Nguyễn Thị Phương Linh', 1, 'Vue, Nuxt', '0909900112', 'USER', 'linkedin.com/in/phuonglinh2003'),
	(53, 'Hải Phòng', 'System Admin', '1996-05-19', 'tranvanthang1996@gmail.com', 'Trần Văn Thắng', 0, 'Linux, Docker', '0910011223', 'USER', 'linkedin.com/in/vanthang1996'),
	(54, 'Nha Trang', 'Data Analyst', '2000-08-30', 'vuthithuyduong2000@gmail.com', 'Vũ Thị Thùy Dương', 1, 'Power BI, SQL', '0911122334', 'USER', 'linkedin.com/in/thuyduong2000'),
	(55, 'Quận 11, TP.HCM', 'Backend PHP Developer', '1999-01-25', 'buiquanghuy1999@gmail.com', 'Bùi Quang Huy', 0, 'Laravel, MySQL', '0912233445', 'USER', 'linkedin.com/in/quanghuy1999'),
	(56, 'Biên Hòa', 'iOS Developer', '2002-04-09', 'dangthingoc2002@gmail.com', 'Đặng Thị Ngọc', 1, 'Swift, SwiftUI', '0913344556', 'USER', 'linkedin.com/in/thingoc2002'),
	(57, 'Vũng Tàu', 'Android Developer', '2001-10-16', 'phamvanson2001@gmail.com', 'Phạm Văn Sơn', 0, 'Kotlin, Jetpack', '0914455667', 'USER', 'linkedin.com/in/vanson2001'),
	(58, 'Long An', 'Network Engineer', '1998-12-01', 'trinhvanlong1998@gmail.com', 'Trịnh Văn Long', 0, 'CCNA, Firewall', '0915566778', 'USER', 'linkedin.com/in/vanlong1998'),
	(59, 'Tiền Giang', 'Marketing Executive', '2000-06-27', 'nguyenthihoa2000@gmail.com', 'Nguyễn Thị Hoa', 1, 'Content, SEO', '0916677889', 'USER', 'linkedin.com/in/thihoa2000'),
	(60, 'Đồng Nai', 'HR Specialist', '2003-09-12', 'levanminh2003@gmail.com', 'Lê Văn Minh', 0, 'Tuyển dụng, đào tạo', '0917788990', 'USER', 'linkedin.com/in/vanminh2003'),
	(61, 'Quận 6, TP.HCM', 'Graphic Designer', '1997-11-08', 'hoangthikimngoc1997@gmail.com', 'Hoàng Thị Kim Ngọc', 1, 'Photoshop, Illustrator', '0918899001', 'USER', 'linkedin.com/in/kimngoc1997'),
	(62, 'Hóc Môn, TP.HCM', 'Fullstack Python Developer', '2002-02-14', 'tranvanphong2002@gmail.com', 'Trần Văn Phong', 0, 'Django, React', '0919900112', 'USER', 'linkedin.com/in/vanphong2002'),
	(63, 'Củ Chi, TP.HCM', 'Database Administrator', '1999-07-21', 'vuthithanh1999@gmail.com', 'Vũ Thị Thanh', 1, 'Oracle, PostgreSQL', '0920011223', 'USER', 'linkedin.com/in/thithanh1999'),
	(64, 'Bình Chánh, TP.HCM', 'IT Support', '2001-04-05', 'nguyenvanbinh2001@gmail.com', 'Nguyễn Văn Bình', 0, 'Windows, Office 365', '0921122334', 'USER', 'linkedin.com/in/vanbinh2001');

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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.certificates: ~28 rows (approximately)
INSERT INTO `certificates` (`id`, `expiry_date`, `issue_date`, `issuer`, `name`, `candidate_id`) VALUES
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
	(33, NULL, '2022-01-01', 'British Council', 'IELTS 6.0', 5),
	(34, NULL, '2023-03-01', 'Amazon', 'AWS Cloud Practitioner', 5),
	(39, NULL, '2023-06-01', 'Amazon', 'AWS Solutions Architect', 32),
	(40, NULL, '2022-03-15', 'Oracle', 'Oracle Certified Java Programmer', 32),
	(47, NULL, '2023-01-01', 'British Council', 'IELTS 6.5', 3),
	(48, NULL, '2022-06-15', 'Oracle', 'Chứng chỉ Java OCP', 3);

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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.educations: ~47 rows (approximately)
INSERT INTO `educations` (`id`, `gpa`, `graduation_year`, `major`, `school`, `candidate_id`) VALUES
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
	(20, '3.4/4.0', '2022', 'Công nghệ thông tin', 'Đại học Bách Khoa TP.HCM', 5),
	(23, '3.5', '2021', 'CNTT', 'ĐH Bách Khoa', 32),
	(24, '3.6/4.0', '2017', 'Kỹ thuật phần mềm', 'ĐH Bách Khoa TP.HCM', 35),
	(25, '3.5/4.0', '2021', 'Công nghệ thông tin', 'ĐH Công nghiệp TP.HCM', 36),
	(26, '3.7/4.0', '2022', 'Khoa học máy tính', 'ĐH Khoa học Tự nhiên', 37),
	(27, '3.4/4.0', '2024', 'Hệ thống thông tin', 'ĐH Kinh tế TP.HCM', 38),
	(28, '3.8/4.0', '2023', 'Kỹ thuật phần mềm', 'ĐH FPT', 39),
	(29, '3.3/4.0', '2025', 'Công nghệ thông tin', 'ĐH Sư phạm Kỹ thuật', 40),
	(30, '3.9/4.0', '2022', 'Thiết kế đồ họa', 'ĐH Mỹ thuật TP.HCM', 41),
	(31, '3.6/4.0', '2020', 'Mạng máy tính', 'ĐH Bách Khoa Hà Nội', 42),
	(32, '3.5/4.0', '2024', 'An ninh mạng', 'Học viện Kỹ thuật Mật mã', 43),
	(33, '3.7/4.0', '2022', 'Công nghệ thông tin', 'ĐH Tôn Đức Thắng', 44),
	(34, '3.8/4.0', '2019', 'Trí tuệ nhân tạo', 'ĐH Bách Khoa TP.HCM', 45),
	(35, '3.4/4.0', '2023', 'Quản trị kinh doanh', 'ĐH Kinh tế Quốc dân', 46),
	(36, '3.6/4.0', '2021', 'Điện tử viễn thông', 'ĐH Bách Khoa Hà Nội', 47),
	(37, '3.5/4.0', '2022', 'Hệ thống thông tin quản lý', 'ĐH Mở TP.HCM', 48),
	(38, '3.7/4.0', '2024', 'Kỹ thuật phần mềm', 'ĐH Công nghệ Thông tin', 49),
	(39, '3.6/4.0', '2020', 'Công nghệ thông tin', 'ĐH Sài Gòn', 50),
	(40, '3.8/4.0', '2023', 'Kỹ thuật máy tính', 'ĐH Bách Khoa Đà Nẵng', 51),
	(41, '3.5/4.0', '2025', 'Công nghệ thông tin', 'ĐH Greenwich', 52),
	(42, '3.4/4.0', '2018', 'Mạng máy tính', 'ĐH Bách Khoa Hà Nội', 53),
	(43, '3.7/4.0', '2022', 'Khoa học dữ liệu', 'ĐH Kinh tế TP.HCM', 54),
	(44, '3.6/4.0', '2021', 'Công nghệ thông tin', 'ĐH Công nghiệp Hà Nội', 55),
	(45, '3.8/4.0', '2024', 'Kỹ thuật phần mềm', 'ĐH FPT Hà Nội', 56),
	(46, '3.5/4.0', '2023', 'Công nghệ thông tin', 'ĐH Đà Nẵng', 57),
	(47, '3.7/4.0', '2020', 'Mạng máy tính', 'ĐH Bách Khoa TP.HCM', 58),
	(48, '3.6/4.0', '2022', 'Marketing', 'ĐH Kinh tế TP.HCM', 59),
	(49, '3.5/4.0', '2025', 'Quản trị nhân sự', 'ĐH Lao động Xã hội', 60),
	(51, '3.7/4.0', '2024', 'Khoa học máy tính', 'ĐH Công nghệ Thông tin', 62),
	(52, '3.6/4.0', '2021', 'Hệ thống thông tin', 'ĐH Mở Hà Nội', 63),
	(53, '3.5/4.0', '2023', 'Công nghệ thông tin', 'ĐH Sư phạm Kỹ thuật TP.HCM', 64),
	(61, '3.9/4.0', '2019', 'Thiết kế đồ họa', 'ĐH Kiến trúc TP.HCM', 61),
	(62, '3.5/4.0', '2023', 'Khoa học máy tính', 'Đại học Công nghiệp TP.HCM (IUH)', 3);

-- Dumping structure for table profile_db.experiences
CREATE TABLE IF NOT EXISTS `experiences` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5pts9l4acfs3e1h5u3y35sudc` (`candidate_id`),
  CONSTRAINT `FK5pts9l4acfs3e1h5u3y35sudc` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.experiences: ~18 rows (approximately)
INSERT INTO `experiences` (`id`, `description`, `candidate_id`) VALUES
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
	(23, 'Thực tập tại FPT Software (6 tháng)', 5),
	(26, 'FPT Software - Backend Developer (2022-2024)', 32),
	(27, 'VNG - Intern (2021)', 32),
	(31, 'Thực tập tại công ty ABC (6 tháng)', 3);

-- Dumping structure for table profile_db.projects
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgig3nmlud86yc0dju1hmsl1kh` (`candidate_id`),
  CONSTRAINT `FKgig3nmlud86yc0dju1hmsl1kh` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.projects: ~19 rows (approximately)
INSERT INTO `projects` (`id`, `description`, `candidate_id`) VALUES
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
	(22, 'Hệ thống quản lý nhân viên', 5),
	(23, 'website bán sách', 5),
	(28, 'Hệ thống quản lý nhân sự', 32),
	(29, 'Ứng dụng đặt lịch khám bệnh', 32),
	(36, 'Website thương mại điện tử', 3),
	(37, 'hệ thống quản lý sinh viên', 3);

-- Dumping structure for table profile_db.skills
CREATE TABLE IF NOT EXISTS `skills` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `candidate_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbg4atlinglmgeysrqern5rs9k` (`candidate_id`),
  CONSTRAINT `FKbg4atlinglmgeysrqern5rs9k` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=270 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table profile_db.skills: ~188 rows (approximately)
INSERT INTO `skills` (`id`, `name`, `candidate_id`) VALUES
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
	(79, 'Java', 5),
	(80, 'Spring Boot', 5),
	(81, 'SQL', 5),
	(82, 'Git', 5),
	(97, 'Java', 32),
	(98, 'Spring Boot', 32),
	(99, 'React', 32),
	(100, 'Docker', 32),
	(101, 'AWS', 32),
	(102, 'React Native', 35),
	(103, 'TypeScript', 35),
	(104, 'Redux', 35),
	(105, 'Firebase', 35),
	(106, 'Vue.js', 36),
	(107, 'Vuex', 36),
	(108, 'TailwindCSS', 36),
	(109, 'Figma', 36),
	(110, 'Node.js', 37),
	(111, 'Express', 37),
	(112, 'NestJS', 37),
	(113, 'MongoDB', 37),
	(114, 'Python', 38),
	(115, 'Spark', 38),
	(116, 'Airflow', 38),
	(117, 'AWS', 38),
	(118, 'Flutter', 39),
	(119, 'Dart', 39),
	(120, 'Provider', 39),
	(121, 'GetX', 39),
	(122, 'Golang', 40),
	(123, 'Gin', 40),
	(124, 'PostgreSQL', 40),
	(125, 'Docker', 40),
	(126, 'Figma', 41),
	(127, 'Adobe XD', 41),
	(128, 'Photoshop', 41),
	(129, 'UI/UX', 41),
	(130, 'Kubernetes', 42),
	(131, 'Terraform', 42),
	(132, 'Jenkins', 42),
	(133, 'AWS', 42),
	(134, 'Ethical Hacking', 43),
	(135, 'Burp Suite', 43),
	(136, 'Metasploit', 43),
	(137, 'SIEM', 43),
	(138, 'C#', 44),
	(139, '.NET Core', 44),
	(140, 'Blazor', 44),
	(141, 'SQL Server', 44),
	(142, 'PyTorch', 45),
	(143, 'TensorFlow', 45),
	(144, 'LLM', 45),
	(145, 'Computer Vision', 45),
	(146, 'Product Management', 46),
	(147, 'Agile', 46),
	(148, 'Jira', 46),
	(149, 'Figma', 46),
	(150, 'C', 47),
	(151, 'C++', 47),
	(152, 'Embedded Linux', 47),
	(153, 'RTOS', 47),
	(154, 'SQL', 48),
	(155, 'Power BI', 48),
	(156, 'Excel', 48),
	(157, 'Tableau', 48),
	(158, 'Selenium', 49),
	(159, 'Cypress', 49),
	(160, 'Postman', 49),
	(161, 'JMeter', 49),
	(162, 'React Native', 50),
	(163, 'Redux', 50),
	(164, 'Firebase', 50),
	(165, 'Android', 50),
	(166, 'AWS', 51),
	(167, 'GCP', 51),
	(168, 'Docker', 51),
	(169, 'CI/CD', 51),
	(170, 'Vue.js', 52),
	(171, 'Nuxt.js', 52),
	(172, 'Vuetify', 52),
	(173, 'Pinia', 52),
	(174, 'Linux', 53),
	(175, 'Docker', 53),
	(176, 'Nginx', 53),
	(177, 'Firewall', 53),
	(178, 'Power BI', 54),
	(179, 'SQL', 54),
	(180, 'Python', 54),
	(181, 'DAX', 54),
	(182, 'PHP', 55),
	(183, 'Laravel', 55),
	(184, 'MySQL', 55),
	(185, 'API', 55),
	(186, 'Swift', 56),
	(187, 'SwiftUI', 56),
	(188, 'Xcode', 56),
	(189, 'CoreData', 56),
	(190, 'Kotlin', 57),
	(191, 'Jetpack Compose', 57),
	(192, 'Room', 57),
	(193, 'Retrofit', 57),
	(194, 'CCNA', 58),
	(195, 'Firewall', 58),
	(196, 'VPN', 58),
	(197, 'Routing', 58),
	(198, 'Content Marketing', 59),
	(199, 'SEO', 59),
	(200, 'Google Analytics', 59),
	(201, 'Facebook Ads', 59),
	(202, 'Recruitment', 60),
	(203, 'Training', 60),
	(204, 'HRIS', 60),
	(205, 'Labor Law', 60),
	(210, 'Django', 62),
	(211, 'React', 62),
	(212, 'PostgreSQL', 62),
	(213, 'REST API', 62),
	(214, 'Oracle', 63),
	(215, 'PL/SQL', 63),
	(216, 'Backup', 63),
	(217, 'Performance Tuning', 63),
	(218, 'Windows Server', 64),
	(219, 'Office 365', 64),
	(220, 'Active Directory', 64),
	(221, 'Troubleshooting', 64),
	(259, 'Photoshop', 61),
	(260, 'Illustrator', 61),
	(261, 'After Effects', 61),
	(262, 'Premiere', 61),
	(263, 'Java', 3),
	(264, 'Spring Boot', 3),
	(265, 'SQL', 3),
	(266, 'Docker', 3),
	(267, 'ReactJS', 3),
	(268, 'Git', 3),
	(269, 'React', 3);


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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table storage_db.files: ~11 rows (approximately)
INSERT INTO `files` (`id`, `category`, `file_name`, `file_type`, `object_name`, `uploaded_at`, `user_id`) VALUES
	(2, 'CV', 'PhanTichChucNangHeThong.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'a05d74b0-6f23-4c24-98cd-4eddc0166bb8_PhanTichChucNangHeThong.docx', '2025-11-05 16:03:10.036262', 32),
	(4, 'CV', 'OnTapCK.pdf', 'application/pdf', '3d32ca3c-e07f-4a85-80ab-198c42187ea4_OnTapCK.pdf', '2025-10-01 15:30:40.128093', 33),
	(5, 'CV', 'Bìa.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '6139b5e4-b0aa-4a02-9014-63963aa5a80f_Bìa.docx', '2025-12-02 09:06:37.207953', 3),
	(7, 'CV', NULL, NULL, NULL, '2025-10-14 18:36:17.309381', 34),
	(9, 'CV', 'SSRC_TeachMe.pdf', 'application/pdf', 'bee16153-86da-4fbf-b6bc-1e01fe926a8f_SSRC_TeachMe.pdf', '2025-11-04 16:12:18.842841', 5),
	(10, 'CV', 'CMM_CMMI_SoSanh_ISOvsCMM.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '349d4d0e-04cd-41f1-89f2-3f9f92eb0f8a_CMM_CMMI_SoSanh_ISOvsCMM.docx', '2025-11-04 16:13:01.807751', 6),
	(15, 'AVATAR', 'mariadb-3.jpg', 'image/jpeg', '3744d557-0e8b-4369-9d3e-814b22611882_mariadb-3.jpg', '2025-11-28 10:35:37.103866', 3),
	(16, 'AVATAR', 'minio-logo.jpg', 'image/jpeg', 'a0cf856c-01e9-4546-8ae0-6d46fde170bd_minio-logo.jpg', '2025-11-28 09:54:56.381206', 61),
	(17, 'AVATAR', 'spring.jpg', 'image/jpeg', 'cabab56a-301c-4cc6-9c54-507e7f6efd5c_spring.jpg', '2025-11-28 11:00:20.293424', 2),
	(18, 'AVATAR', 'icon.png', 'image/png', '131771bb-8a33-4ec2-ba82-62aa7a078e47_icon.png', '2025-11-28 11:25:28.321855', 20),
	(19, 'CV', '03-Template-trinh-bay-bai-bao.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '1917a67e-b5fa-4582-9386-383147990c33_03-Template-trinh-bay-bai-bao.docx', '2025-12-02 09:22:42.983993', 61);


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
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table user_db.users: ~55 rows (approximately)
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
	(35, 'leminhduc95@gmail.com', 'Lê Minh Đức', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(36, 'phamthuytrang99@gmail.com', 'Phạm Thùy Trang', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(37, 'tranquanghuy2000@gmail.com', 'Trần Quang Huy', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(38, 'nguyenthiphuongthao02@gmail.com', 'Nguyễn Thị Phương Thảo', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(39, 'vohoangnam2001@gmail.com', 'Võ Hoàng Nam', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(40, 'dangkhoi2003@gmail.com', 'Đặng Khoa', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(41, 'huynhthikimngan@gmail.com', 'Huỳnh Thị Kim Ngân', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(42, 'buiquangvinh98@gmail.com', 'Bùi Quang Vinh', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(43, 'trinhthidiemmy2002@gmail.com', 'Trịnh Thị Diễm My', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(44, 'nguyenvanhoang2000@gmail.com', 'Nguyễn Văn Hoàng', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(45, 'vutiendat1997@gmail.com', 'Vũ Tiến Đạt', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(46, 'tranthingocanh2001@gmail.com', 'Trần Thị Ngọc Ánh', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(47, 'nguyenvanhung1999@gmail.com', 'Nguyễn Văn Hùng', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(48, 'dinhthilan2000@gmail.com', 'Đinh Thị Lan', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(49, 'phamquangminh2002@gmail.com', 'Phạm Quang Minh', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(50, 'lethikimlien1998@gmail.com', 'Lê Thị Kim Liên', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(51, 'hoangvanthanh2001@gmail.com', 'Hoàng Văn Thành', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(52, 'nguyenthiphuonglinh2003@gmail.com', 'Nguyễn Thị Phương Linh', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(53, 'tranvanthang1996@gmail.com', 'Trần Văn Thắng', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(54, 'vuthithuyduong2000@gmail.com', 'Vũ Thị Thùy Dương', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(55, 'buiquanghuy1999@gmail.com', 'Bùi Quang Huy', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(56, 'dangthingoc2002@gmail.com', 'Đặng Thị Ngọc', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(57, 'phamvanson2001@gmail.com', 'Phạm Văn Sơn', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(58, 'trinhvanlong1998@gmail.com', 'Trịnh Văn Long', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(59, 'nguyenthihoa2000@gmail.com', 'Nguyễn Thị Hoa', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(60, 'levanminh2003@gmail.com', 'Lê Văn Minh', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(61, 'hoangthikimngoc1997@gmail.com', 'Hoàng Thị Kim Ngọc', b'1', '$2a$10$nP6Vo4JGU5JS0wiPGEgideF9ObE5QBwhpznSBsyhUYsOUaPEFInYi', 1),
	(62, 'tranvanphong2002@gmail.com', 'Trần Văn Phong', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(63, 'vuthithanh1999@gmail.com', 'Vũ Thị Thanh', b'1', '$2a$10$0jZYk8joJvVAgHbLTH2LeOYyvxRIt.lXHU7j6DZiwghCfrQ1VK8z2', 1),
	(64, 'nguyenvanbinh2001@gmail.com', 'Nguyễn Văn Bình', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 1),
	(65, 'vinatech.hr@gmail.com', 'VinaTech HR', b'1', '$2a$10$RMALgA6UQPapPgFZt8wSzeXQ8qtyh0Me7Ahp6uErECG.SeM/KHasm', 3);

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
