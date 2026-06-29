package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.dto.PostCreateRequestDTO;
import com.uday.rguktconnect.dto.PostResponseDTO;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.service.FileStorageService;
import com.uday.rguktconnect.service.posts.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    private String getAuthenticatedEmail() {
        return (String) Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()
        ).getPrincipal();
    }

    @PostMapping("/media")
    public ResponseEntity<?> uploadMedia(@RequestParam("file") MultipartFile file) {
        try {
            User user = userRepository.findByUniversityEmail(getAuthenticatedEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String s3Url = fileStorageService.uploadPostMedia(file, user.getIdNumber());
            return ResponseEntity.ok(Map.of("mediaUrl", s3Url));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown upload error"));
        }
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getCommunityFeed() {
        List<PostResponseDTO> feed = postService.getAllPosts(getAuthenticatedEmail());
        return ResponseEntity.ok(feed);
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostCreateRequestDTO requestDTO) {
        try {
            PostResponseDTO post = postService.createPost(getAuthenticatedEmail(), requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown creation error"));
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId) {
        try {
            PostResponseDTO updatedPost = postService.toggleLikePost(getAuthenticatedEmail(), postId);
            return ResponseEntity.ok(updatedPost);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown like error"));
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(getAuthenticatedEmail(), postId);
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown deletion error"));
        }
    }
}
