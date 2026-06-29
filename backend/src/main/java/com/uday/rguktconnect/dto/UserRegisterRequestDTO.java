package com.uday.rguktconnect.dto;

import lombok.Data;

@Data
public class UserRegisterRequestDTO {
    private String idNumber;       
    private String name;             
    private String universityEmail; 
    private String password;
    private String role;
}