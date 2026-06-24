package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.dto.NotificationResponseDTO;
import com.uday.rguktconnect.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    private String getAuthenticatedEmail() {
        return (String) Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()
        ).getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getNotifications() {
        return ResponseEntity.ok(notificationService.getNotifications(getAuthenticatedEmail()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        long count = notificationService.getUnreadCount(getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id, getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Notification marked as read successfully"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        notificationService.markAllAsRead(getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read successfully"));
    }
}
