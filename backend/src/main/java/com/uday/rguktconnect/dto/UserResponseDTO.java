package com.uday.rguktconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String idNumber;
    private String name;
    private String universityEmail;
    private String personalEmail;
    private String mobileNumber;
    private String branch;
    private String batch;
    private String userType;
    private LocalDateTime createdAt;
}