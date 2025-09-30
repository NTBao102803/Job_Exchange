package iuh.fit.se.match_candidate_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(indexName = "candidates")
public class CandidateIndex {
    @Id
    private Long id;

    @Field(type = FieldType.Text)
    private String fullName;

    @Field(type = FieldType.Keyword)
    private String email;

    @Field(type = FieldType.Keyword)          // lưu skills như keyword array
    private List<String> skills;

    @Field(type = FieldType.Text)
    private String experience;

    @Field(type = FieldType.Text)
    private String major;

    @Field(type = FieldType.Text)
    private String school;

    @Field(type = FieldType.Text)
    private String address; // vẫn text để match một phần

    @Field(type = FieldType.Text)
    private String careerGoal;
}
