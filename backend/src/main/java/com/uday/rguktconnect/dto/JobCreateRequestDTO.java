package com.uday.rguktconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobCreateRequestDTO {
    private String company;
    private String role;
    private String location;
    private String salary;
    private String applyUrl;
    private String type;
    private boolean referralAvailable;
    private String category;
    private LocalDate expiresAt;
}
