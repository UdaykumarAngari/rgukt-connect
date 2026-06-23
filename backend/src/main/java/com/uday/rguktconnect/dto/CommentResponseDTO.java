package com.uday.rguktconnect.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CommentResponseDTO {
    private Long id;
    private Long postId;
    private Long authorId;
    private String author;
    private String authorTitle;
    private String authorAvatar;
    private String content;
    private String timestamp;
    private int likes;
    private boolean likedByMe;
    private List<CommentResponseDTO> replies;
}
