package iuh.fit.se.auth_service.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.auth_service.config.JwtService;
import iuh.fit.se.auth_service.dto.*;
import iuh.fit.se.auth_service.event.UserCreatedEvent;
import iuh.fit.se.auth_service.model.Role;
import iuh.fit.se.auth_service.model.User;
import iuh.fit.se.auth_service.model.VerificationToken;
import iuh.fit.se.auth_service.repository.RoleRepository;
import iuh.fit.se.auth_service.repository.UserRepository;
import iuh.fit.se.auth_service.repository.VerificationTokenRepository;
import iuh.fit.se.auth_service.service.AuthService;
import iuh.fit.se.auth_service.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private KafkaTemplate<String, UserCreatedEvent> kafkaTemplate;

    public AuthServiceImpl(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void requestOtp(RegisterRequest request) {
        // Kiểm tra domain email hợp lệ trước khi gửi OTP
        if (!request.getEmail().matches("^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|outlook\\.com)$")) {
            throw new IllegalArgumentException("Chỉ chấp nhận email từ gmail.com, yahoo.com hoặc outlook.com");
        }

        // Kiểm tra email đã tồn tại trong DB
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // Kiểm tra email đã yêu cầu OTP trước đó chưa
        if (verificationTokenRepository.existsByEmailAndExpiryDateAfter(request.getEmail(), LocalDateTime.now())) {
            throw new IllegalArgumentException("Bạn đã yêu cầu OTP, vui lòng kiểm tra email hoặc đợi hết hạn");
        }

        // Tìm role (để sau xác thực dùng)
        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new IllegalArgumentException("Role không tồn tại"));

        String otp = String.format("%06d", new Random().nextInt(999999));

        ObjectMapper mapper = new ObjectMapper();
        String json;
        try {
            json = mapper.writeValueAsString(request);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi khi xử lý dữ liệu người dùng", e);
        }

        VerificationToken token = new VerificationToken();

        token.setTempFullName(request.getFullName());
        token.setTempPassword(passwordEncoder.encode(request.getPassWord()));
        token.setEmail(request.getEmail());
        token.setRoleName(role.getRoleName());

        token.setOtp(otp);
        token.setUserData(json);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(1));
        verificationTokenRepository.save(token);

        String emailContent = "<p>OTP của bạn là: <strong>" + otp + "</strong></p>";
        try {
            emailService.sendEmail(request.getEmail(), "Mã OTP xác thực", emailContent);
        } catch (MailException e) {
            throw new IllegalArgumentException("Email không tồn tại hoặc không thể gửi email đến địa chỉ này");
        }
    }

    @Override
    public AuthResponse verifyOtp(String email, String otp) {
        // 1. Kiểm tra OTP hợp lệ
        VerificationToken token = verificationTokenRepository.findByEmailAndOtp(email, otp)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã OTP hoặc OTP không hợp lệ"));

        // 2. Tạo user từ thông tin tạm
        User user = new User();
        user.setFullName(token.getTempFullName());
        user.setPassword(token.getTempPassword()); // đã được mã hoá
        user.setEmail(token.getEmail());
        user.setIsActive(true);

        Role role = roleRepository.findByRoleName(token.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));
        user.setRole(role);

        userRepository.save(user);

        // 3. Xóa token sau khi xác thực thành công
        verificationTokenRepository.delete(token);

        // 4. Gọi user-service để tạo profile (chỉ khi KHÔNG phải EMPLOYER)
        if (!"EMPLOYER".equalsIgnoreCase(role.getRoleName())) {
            RestTemplate restTemplate = new RestTemplate();

            // 1. Gọi user-service tạo Candidate
            CandidateRequest candidateRequest = new CandidateRequest();
            candidateRequest.setUserId(user.getId());
            candidateRequest.setEmail(user.getEmail());
            candidateRequest.setRole(role.getRoleName());
            candidateRequest.setFullName(user.getFullName());

            restTemplate.postForObject(
                    "http://localhost:8082/api/candidate/internal",
                    candidateRequest,
                    Void.class);

            // 2. Gọi storage-service tạo storage profile cho Candidate
            // (b) Gọi storage-service tạo storage profile rỗng
            try {
                restTemplate.postForObject(
                        "http://localhost:8083/api/storage/init?userId=" + user.getId() + "&category=AVATAR",
                        null,
                        Void.class
                );

                restTemplate.postForObject(
                        "http://localhost:8083/api/storage/init?userId=" + user.getId() + "&category=CV",
                        null,
                        Void.class
                );
            } catch (Exception ex) {
                throw new RuntimeException("Không thể tạo storage profile cho user trong storage-service", ex);
            }
        }

        // 5. Sinh JWT Token
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // 6. Trả về response
        return new AuthResponse(accessToken, refreshToken, user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole().getRoleName(), user.getIsActive());
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String otp = String.format("%06d", new Random().nextInt(999999));

        VerificationToken token = new VerificationToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(3));
        verificationTokenRepository.save(token);

        String content = "<p>Mã OTP khôi phục mật khẩu của bạn là: <strong>" + otp + "</strong></p>";
        emailService.sendEmail(email, "Khôi phục mật khẩu", content);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        VerificationToken token = verificationTokenRepository
                .findByEmailAndOtp(request.getEmail(), request.getOtp())
                .orElseThrow(() -> new RuntimeException("OTP không hợp lệ hoặc đã hết hạn"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Xóa OTP sau khi dùng
        verificationTokenRepository.delete(token);
    }

    @Override
    public void changePassword(String usernameOrEmail, ChangePasswordRequest request) {
        // Tìm user theo username/email
        User user = userRepository.findByEmail(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        // So sánh mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        // Gán mật khẩu mới đã mã hoá
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    @Override
    public AuthResponse login(AuthRequest loginRequest) {
        // Tìm user theo email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // Kiểm tra mật khẩu trước
        if (!passwordEncoder.matches(loginRequest.getPassWord(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // Nếu mật khẩu đúng mà vẫn isActive = false => TÀI KHOẢN BỊ KHÓA
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        // Load UserDetails
        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());

        // Tạo Access Token và Refresh Token
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new AuthResponse(accessToken, refreshToken, user);
    }

    @Override
    public UserResponse lockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsActive(false);
        userRepository.save(user);

        // Nếu muốn có log thay thế event, có thể ghi log tại đây
        log.info("User {} has been locked", user.getId());

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().getRoleName(),
                user.getIsActive()
        );
    }

    @Override
    public UserResponse unlockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setIsActive(true);
        userRepository.save(user);

        log.info("User {} has been unlocked", user.getId());

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().getRoleName(),
                user.getIsActive()
        );
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();

        // 2. Chuyển đổi List<User> sang List<UserResponse>
        return users.stream()
                .map(this::convertToUserResponse) // Sử dụng hàm chuyển đổi
                .collect(Collectors.toList());
    }

    // Hàm chuyển đổi từ User Entity sang UserResponse DTO
    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().getRoleName())
                .isActive(user.getIsActive())
                .build();
    }
}
