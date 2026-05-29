package com.uday.rguktconnect.dto;

import lombok.Data;

@Data
public class UserRegisterRequestDTO {
    private String idNumber;        // e.g., B210999
    private String name;            // e.g., Udaykumar Angari
    private String universityEmail; // e.g., b210999@rgukt.ac.in
    private String password;
}