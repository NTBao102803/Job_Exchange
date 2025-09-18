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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Random;

@Service
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
            CandidateRequest candidateRequest = new CandidateRequest();
//            ProfileRequest profileRequest = new ProfileRequest();
            candidateRequest.setUserId(user.getId());
            candidateRequest.setEmail(user.getEmail());
            candidateRequest.setRole(role.getRoleName());
            candidateRequest.setFullName(user.getFullName());

            try {
                restTemplate.postForObject(
                        "http://localhost:8082/api/candidate/internal",
                        candidateRequest,
                        Void.class);            } catch (Exception ex) {
                throw new RuntimeException("Không thể tạo profile cho user trong user-service", ex);
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
    public AuthResponse login(AuthRequest loginRequest) {
        // Tìm user theo email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // Kiểm tra tài khoản đã xác thực chưa
        if (!user.getIsActive()) {
            throw new RuntimeException("Tài khoản chưa được xác thực qua OTP");
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getPassWord(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // Load UserDetails
        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());

        // Tạo Access Token và Refresh Token
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new AuthResponse(accessToken, refreshToken, user);
    }
}
