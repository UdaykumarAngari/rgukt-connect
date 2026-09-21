package com.uday.rguktconnect.service.posts;

import com.uday.rguktconnect.dto.posts.PostCreateRequestDTO;
import com.uday.rguktconnect.dto.posts.PostResponseDTO;

import java.util.List;
public interface PostService {

    PostResponseDTO createPost(String authorEmail, PostCreateRequestDTO requestDTO);

    List<PostResponseDTO> getAllPosts(String currentEmail);

    PostResponseDTO toggleLikePost(String email, Long postId);

    void deletePost(String email, Long postId);
}
