package iuh.fit.se.user_service.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
@Table(name = "experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên công ty không được để trống")
    private String company;

    @NotBlank(message = "Vị trí không được để trống")
    private String position;

    @Min(value = 0, message = "Số năm phải >= 0")
    private int years;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    @JsonIgnore // ngăn lặp vô hạn json
    private Profile profile;
}
