package com.uday.rguktconnect.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponseDTO {
    private Long id;
    private String type;  
    private Long senderId;
    private String senderName;
    private String senderPhoto;
    private Long relatedId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
