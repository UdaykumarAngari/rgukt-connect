package com.uday.rguktconnect.service.posts;

import com.uday.rguktconnect.dto.CommentRequestDTO;
import com.uday.rguktconnect.dto.CommentResponseDTO;

import java.util.List;

public interface CommentService {

    CommentResponseDTO addComment(String email, Long postId, CommentRequestDTO requestDTO);

    List<CommentResponseDTO> getCommentsForPost(String email, Long postId);

    CommentResponseDTO toggleLikeComment(String email, Long commentId);

    void deleteComment(String email, Long commentId);
}
