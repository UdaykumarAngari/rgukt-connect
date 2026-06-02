package com.uday.rguktconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "education_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EducationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnore // using this to not send user details in response while retrieving
    private User user;

    @Column(name = "institution_name", nullable = false)
    private String institutionName;

    @Column(nullable = false)
    private String degree;

    @Column(name = "field_of_study")
    private String fieldOfStudy;

    @Column(name = "start_year", length = 10, nullable = false)
    private String startYear;

    @Column(name = "end_year", length = 10, nullable = false)
    private String endYear;

    @Column(length = 50)
    private String grade;
}