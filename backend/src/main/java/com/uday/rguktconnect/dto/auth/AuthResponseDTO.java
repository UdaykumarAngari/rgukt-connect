package com.uday.rguktconnect.dto.auth;

import com.uday.rguktconnect.dto.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private UserResponseDTO user;
    private String accessToken;
}