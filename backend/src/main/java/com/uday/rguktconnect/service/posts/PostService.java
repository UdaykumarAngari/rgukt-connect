package com.uday.rguktconnect.service.posts;

import com.uday.rguktconnect.dto.PostCreateRequestDTO;
import com.uday.rguktconnect.dto.PostResponseDTO;

import java.util.List;
public interface PostService {

    PostResponseDTO createPost(String authorEmail, PostCreateRequestDTO requestDTO);

    List<PostResponseDTO> getAllPosts(String currentEmail);

    PostResponseDTO toggleLikePost(String email, Long postId);

    void deletePost(String email, Long postId);
}
