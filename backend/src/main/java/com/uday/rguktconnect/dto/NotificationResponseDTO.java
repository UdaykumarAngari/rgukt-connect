package com.uday.rguktconnect.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponseDTO {
    private Long id;
    private String type; // CONNECTION_REQUEST, CONNECTION_ACCEPTED
    private Long senderId;
    private String senderName;
    private String senderPhoto;
    private Long relatedId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
