package com.uday.rguktconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobResponseDTO {
    private Long id;
    private String company;
    private String role;
    private String location;
    private String salary;
    private String applyUrl;
    private String type;
    private String postedBy;
    private Long postedById;
    private boolean referralAvailable;
    private String category;
    private LocalDateTime createdAt;
    private LocalDate expiresAt;
}
