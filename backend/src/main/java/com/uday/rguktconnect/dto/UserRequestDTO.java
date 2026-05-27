package com.uday.rguktconnect.dto;

import lombok.Data;

import java.security.SecureRandom;

@Data
public class UserRequestDTO {
    private String idNumber;
    private String name;
    private String universityEmail;
    private String personalEmail;
    private String mobileNumber;
    private String password;
    private String batch;
    private String branch;
}
