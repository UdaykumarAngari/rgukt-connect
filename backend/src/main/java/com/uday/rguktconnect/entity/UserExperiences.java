package com.uday.rguktconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "user_experiences")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserExperiences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    private String location;
    private String employmentType;
    private String locationType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_current_role", nullable = false)
    private boolean isCurrentRole;

    @Column(columnDefinition = "TEXT")
    private String description;

    @JsonProperty("formattedEndDate")
    public String getFormattedEndDate() {
        if (this.isCurrentRole || this.endDate == null) {
            return "Present";
        }
        return this.endDate.toString();
    }
}