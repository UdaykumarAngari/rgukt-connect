package com.uday.rguktconnect.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PostResponseDTO {
    private Long id;
    private Long authorId;
    private String author;
    private String authorTitle;
    private String authorAvatar;
    private String authorBio;
    private boolean isVerified;
    private String type; // "text", "code", "referral"
    private String content;
    private String codeSnippet;
    private String company;
    private String role;
    private String mediaUrl;
    private LocalDateTime createdAt;
    private String timestamp;
    private int likes;
    private int comments; // Placeholder or actual comments count
    private boolean likedByMe;
}
