package com.uday.rguktconnect.service.notification.impl;

import com.uday.rguktconnect.dto.NotificationResponseDTO;
import com.uday.rguktconnect.entity.Notification;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import com.uday.rguktconnect.repository.notification.NotificationRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.repository.user.UserDetailsRepository;
import com.uday.rguktconnect.service.notification.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public Notification createNotification(User sender, User recipient, String type, Long relatedId) {
        Notification notification = Notification.builder()
                .sender(sender)
                .recipient(recipient)
                .type(type)
                .relatedId(relatedId)
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);

        String senderPhoto = null;
        Optional<UserDetails> detailsOpt = userDetailsRepository.findByUser(sender);
        if (detailsOpt.isPresent()) {
            senderPhoto = detailsOpt.get().getProfilePhoto();
        }

        NotificationResponseDTO dto = NotificationResponseDTO.builder()
                .id(saved.getId())
                .type(saved.getType())
                .senderId(sender.getId())
                .senderName(sender.getName())
                .senderPhoto(senderPhoto != null ? senderPhoto : "")
                .relatedId(saved.getRelatedId())
                .isRead(saved.isRead())
                .createdAt(saved.getCreatedAt())
                .build();

        messagingTemplate.convertAndSendToUser(
                recipient.getId().toString(),
                "/queue/notifications",
                dto
        );

        return saved;
    }

    @Override
    public List<NotificationResponseDTO> getNotifications(String email) {
        User recipient = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        List<Notification> notifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient);

        return notifications.stream().map(n -> {
            String senderPhoto = null;
            Optional<UserDetails> detailsOpt = userDetailsRepository.findByUser(n.getSender());
            if (detailsOpt.isPresent()) {
                senderPhoto = detailsOpt.get().getProfilePhoto();
            }

            return NotificationResponseDTO.builder()
                    .id(n.getId())
                    .type(n.getType())
                    .senderId(n.getSender().getId())
                    .senderName(n.getSender().getName())
                    .senderPhoto(senderPhoto != null ? senderPhoto : "")
                    .relatedId(n.getRelatedId())
                    .isRead(n.isRead())
                    .createdAt(n.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Access denied");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String email) {
        User recipient = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationRepository.markAllAsRead(recipient);
    }

    @Override
    public long getUnreadCount(String email) {
        User recipient = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.countByRecipientAndIsReadFalse(recipient);
    }
}
