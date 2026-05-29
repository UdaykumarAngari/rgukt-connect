package com.uday.rguktconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 The Foreign Key anchor that maps directly to the users table primary key 'id'
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(name = "mobile_number", length = 15)
    private String mobileNumber;

    @Column(name = "personal_email", length = 100)
    private String personalEmail;

    @Column(length = 50)
    private String branch;

    @Column(length = 10)
    private String batch;

    @Column(name = "profile_photo", columnDefinition = "LONGTEXT")
    private String profilePhoto; // Holds base64 encoded strings or image URLs

    @Column(columnDefinition = "TEXT")
    private String description; // LinkedIn-style "About Me" bio section

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "mentored_students_count")
    private Integer mentoredStudentsCount = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}