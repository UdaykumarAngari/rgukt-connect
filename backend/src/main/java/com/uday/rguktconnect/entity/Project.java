package com.uday.rguktconnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title; // e.g., QR Intern Logger, OneCode SaaS

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "project_url")
    private String projectUrl; // Live web preview URL

    @Column(name = "repo_url")
    private String repoUrl; // GitHub codebase repository link
}