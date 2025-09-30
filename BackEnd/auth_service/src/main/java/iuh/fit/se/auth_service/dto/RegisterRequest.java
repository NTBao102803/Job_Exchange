package iuh.fit.se.auth_service.dto;

import lombok.*;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class RegisterRequest {
    @NotNull(message = "fullName không được null")
    @NotBlank(message = "fullName không được để trống")
    @Size(min = 3, max = 50, message = "fullName phải có độ dài từ 3 đến 50 ký tự")
    private String fullName;

    @NotNull(message = "Email không được null")
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được dài quá 100 ký tự")
    private String email;

    @NotNull(message = "Password không được null")
    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, max = 100, message = "Password phải có độ dài từ 8 đến 100 ký tự")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$",
            message = "Password phải chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt, tối thiểu 8 ký tự"
    )
    private String passWord;

    @NotNull(message = "Role không được null")
    @NotBlank(message = "Role không được để trống")
    private String roleName;
}
