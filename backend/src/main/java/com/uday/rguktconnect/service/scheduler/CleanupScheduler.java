package com.uday.rguktconnect.service.scheduler;

import com.uday.rguktconnect.entity.Comment;
import com.uday.rguktconnect.entity.Connection;
import com.uday.rguktconnect.entity.Post;
import com.uday.rguktconnect.repository.connection.ConnectionRepository;
import com.uday.rguktconnect.repository.posts.CommentRepository;
import com.uday.rguktconnect.repository.posts.PostRepository;
import com.uday.rguktconnect.repository.notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CleanupScheduler {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Run every 5 minutes to clean up expired data for test users
    @Scheduled(fixedRate = 300000)
    @Transactional
    public void cleanupTestUserData() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(2);

        // 1. Cleanup expired posts by test users
        List<Post> allPosts = postRepository.findAll();
        List<Post> expiredPosts = allPosts.stream()
                .filter(post -> post.getAuthor().getUniversityEmail().toLowerCase().startsWith("test")
                        && post.getCreatedAt().isBefore(cutoff))
                .collect(Collectors.toList());

        for (Post post : expiredPosts) {
            List<Comment> comments = commentRepository.findByPost(post);
            List<Comment> replies = comments.stream()
                    .filter(c -> c.getParentComment() != null)
                    .collect(Collectors.toList());
            List<Comment> topLevel = comments.stream()
                    .filter(c -> c.getParentComment() == null)
                    .collect(Collectors.toList());

            commentRepository.deleteAll(replies);
            commentRepository.flush();
            commentRepository.deleteAll(topLevel);
            commentRepository.flush();

            postRepository.delete(post);
        }

        // 2. Cleanup expired connection requests (PENDING status) involving test users
        List<Connection> allConnections = connectionRepository.findAll();
        List<Connection> expiredInvites = allConnections.stream()
                .filter(conn -> "PENDING".equalsIgnoreCase(conn.getStatus())
                        && (conn.getSender().getUniversityEmail().toLowerCase().startsWith("test")
                            || conn.getReceiver().getUniversityEmail().toLowerCase().startsWith("test"))
                        && conn.getCreatedAt().isBefore(cutoff))
                .collect(Collectors.toList());

        for (Connection conn : expiredInvites) {
            // Delete related notifications
            try {
                notificationRepository.deleteByRelatedIdAndType(conn.getId(), "CONNECTION_REQUEST");
            } catch (Exception e) {
                // ignore
            }
            connectionRepository.delete(conn);
        }
    }
}
