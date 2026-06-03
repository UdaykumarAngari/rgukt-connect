package com.uday.rguktconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequestDTO {
    private String name;
    private String mobileNumber;
    private String personalEmail;
    private String branch;
    private String batch;
    private String description;
    private String githubUrl;
    private String linkedinUrl;
    private Integer mentoredStudentsCount;
}