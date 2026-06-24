package com.uday.rguktconnect.service.notification;

import com.uday.rguktconnect.dto.NotificationResponseDTO;
import com.uday.rguktconnect.entity.Notification;
import com.uday.rguktconnect.entity.User;
import java.util.List;

public interface NotificationService {
    Notification createNotification(User sender, User recipient, String type, Long relatedId);
    List<NotificationResponseDTO> getNotifications(String email);
    void markAsRead(Long notificationId, String email);
    void markAllAsRead(String email);
    long getUnreadCount(String email);
}
