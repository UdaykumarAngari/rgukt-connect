package com.uday.rguktconnect.service.posts.impl;

import com.uday.rguktconnect.dto.CommentRequestDTO;
import com.uday.rguktconnect.dto.CommentResponseDTO;
import com.uday.rguktconnect.entity.Comment;
import com.uday.rguktconnect.entity.Post;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import com.uday.rguktconnect.repository.posts.CommentRepository;
import com.uday.rguktconnect.repository.posts.PostRepository;
import com.uday.rguktconnect.repository.user.UserDetailsRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.service.posts.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Override
    public CommentResponseDTO addComment(String email, Long postId, CommentRequestDTO requestDTO) {
        User author = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("Author profile not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Target post not found"));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setContent(requestDTO.getContent());

        if (requestDTO.getParentCommentId() != null) {
            Comment parent = commentRepository.findById(requestDTO.getParentCommentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parent);
        }

        Comment savedComment = commentRepository.save(comment);
        return mapToDTO(savedComment, email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getCommentsForPost(String email, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> topLevelComments = commentRepository.findByPostAndParentCommentIsNullOrderByCreatedAtAsc(post);
        return topLevelComments.stream()
                .map(comment -> mapToDTO(comment, email))
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponseDTO toggleLikeComment(String email, Long commentId) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (comment.getLikedBy().contains(user)) {
            comment.getLikedBy().remove(user);
        } else {
            comment.getLikedBy().add(user);
        }

        Comment savedComment = commentRepository.save(comment);
        return mapToDTO(savedComment, email);
    }

    @Override
    public void deleteComment(String email, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        boolean isCommentAuthor = comment.getAuthor().getUniversityEmail().equalsIgnoreCase(email);
        boolean isPostAuthor = comment.getPost().getAuthor().getUniversityEmail().equalsIgnoreCase(email);

        if (!isCommentAuthor && !isPostAuthor) {
            throw new RuntimeException("Unauthorized comment deletion request");
        }

        commentRepository.delete(comment);
    }

    private String getRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "Just now";
        }
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 0) seconds = 0;
        if (seconds < 60) return "Just now";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h ago";
        long days = hours / 24;
        if (days < 30) return days + "d ago";
        return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("MMM d, yyyy"));
    }

    private CommentResponseDTO mapToDTO(Comment comment, String currentEmail) {
        User author = comment.getAuthor();
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

        boolean likedByMe = false;
        if (currentEmail != null) {
            likedByMe = comment.getLikedBy().stream()
                    .anyMatch(user -> user.getUniversityEmail().equalsIgnoreCase(currentEmail));
        }

        List<CommentResponseDTO> repliesDTO = comment.getReplies().stream()
                .map(reply -> mapToDTO(reply, currentEmail))
                .collect(Collectors.toList());

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .authorId(author.getId())
                .author(author.getName())
                .authorTitle(authorTitle)
                .authorAvatar(authorAvatar)
                .content(comment.getContent())
                .timestamp(getRelativeTime(comment.getCreatedAt()))
                .likes(comment.getLikedBy().size())
                .likedByMe(likedByMe)
                .replies(repliesDTO)
                .build();
    }
}
