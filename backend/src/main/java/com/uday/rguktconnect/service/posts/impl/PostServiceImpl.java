package com.uday.rguktconnect.service.posts.impl;

import com.uday.rguktconnect.dto.PostCreateRequestDTO;
import com.uday.rguktconnect.dto.PostResponseDTO;
import com.uday.rguktconnect.entity.Comment;
import com.uday.rguktconnect.entity.Post;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import com.uday.rguktconnect.repository.posts.CommentRepository;
import com.uday.rguktconnect.repository.posts.PostRepository;
import com.uday.rguktconnect.repository.user.UserDetailsRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.service.posts.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public PostResponseDTO createPost(String authorEmail, PostCreateRequestDTO requestDTO) {
        User author = userRepository.findByUniversityEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("Author identity not found"));

        Post post = new Post();
        post.setAuthor(author);
        post.setType(requestDTO.getType() != null ? requestDTO.getType() : "text");
        post.setContent(requestDTO.getContent());
        post.setCodeSnippet(requestDTO.getCodeSnippet());
        post.setCompany(requestDTO.getCompany());
        post.setRole(requestDTO.getRole());
        post.setMediaUrl(requestDTO.getMediaUrl());

        Post savedPost = postRepository.save(post);
        return mapToDTO(savedPost, authorEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts(String currentEmail) {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return posts.stream()
                .map(post -> mapToDTO(post, currentEmail))
                .collect(Collectors.toList());
    }

    @Override
    public PostResponseDTO toggleLikePost(String email, Long postId) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getLikedBy().contains(user)) {
            post.getLikedBy().remove(user);
        } else {
            post.getLikedBy().add(user);
        }

        Post savedPost = postRepository.save(post);
        return mapToDTO(savedPost, email);
    }

    @Override
    public void deletePost(String email, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized deletion request");
        }

        // Fetch all comments and replies for this post
        List<Comment> comments = commentRepository.findByPost(post);
        
        // Segregate nested replies from top-level comments
        List<Comment> replies = comments.stream()
                .filter(c -> c.getParentComment() != null)
                .collect(Collectors.toList());
        List<Comment> topLevel = comments.stream()
                .filter(c -> c.getParentComment() == null)
                .collect(Collectors.toList());

        // Delete nested replies first to clear parent_id references
        commentRepository.deleteAll(replies);
        commentRepository.flush();

        // Delete top-level comments next
        commentRepository.deleteAll(topLevel);
        commentRepository.flush();

        postRepository.delete(post);
    }

    private String getRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "Just now";
        }
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 0) seconds = 0; // Handle small clock drifts
        if (seconds < 60) return "Just now";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h ago";
        long days = hours / 24;
        if (days < 30) return days + "d ago";
        return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("MMM d, yyyy"));
    }

    private PostResponseDTO mapToDTO(Post post, String currentEmail) {
        User author = post.getAuthor();
        UserDetails userDetails = userDetailsRepository.findByUser(author).orElse(null);

        String branch = (userDetails != null && userDetails.getBranch() != null) ? userDetails.getBranch() : "";
        String batch = (userDetails != null && userDetails.getBatch() != null) ? userDetails.getBatch() : "";
        String authorTitle = branch;
        if (!batch.isEmpty()) {
            authorTitle = authorTitle.isEmpty() ? "Batch " + batch : authorTitle + " | Batch " + batch;
        }
        if (authorTitle.isEmpty()) {
            authorTitle = "Verified RGUKT Member";
        }

        String authorAvatar = (userDetails != null) ? userDetails.getProfilePhoto() : null;
        String authorBio = (userDetails != null) ? userDetails.getDescription() : null;

        boolean likedByMe = false;
        if (currentEmail != null) {
            likedByMe = post.getLikedBy().stream()
                    .anyMatch(user -> user.getUniversityEmail().equalsIgnoreCase(currentEmail));
        }

        return PostResponseDTO.builder()
                .id(post.getId())
                .authorId(author.getId())
                .author(author.getName())
                .authorTitle(authorTitle)
                .authorAvatar(authorAvatar)
                .authorBio(authorBio)
                .isVerified(true)
                .type(post.getType())
                .content(post.getContent())
                .codeSnippet(post.getCodeSnippet())
                .company(post.getCompany())
                .role(post.getRole())
                .mediaUrl(post.getMediaUrl())
                .createdAt(post.getCreatedAt())
                .timestamp(getRelativeTime(post.getCreatedAt()))
                .likes(post.getLikedBy().size())
                .comments((int) commentRepository.countByPost(post))
                .likedByMe(likedByMe)
                .build();
    }
}
