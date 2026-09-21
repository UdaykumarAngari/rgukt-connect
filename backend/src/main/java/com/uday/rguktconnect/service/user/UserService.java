package com.uday.rguktconnect.service.user;

import com.uday.rguktconnect.dto.auth.AuthRequestDTO;
import com.uday.rguktconnect.dto.auth.AuthResponseDTO;
import com.uday.rguktconnect.dto.user.UserRegisterRequestDTO;
import com.uday.rguktconnect.dto.user.UserResponseDTO;
 
public interface UserService {
    UserResponseDTO registerUser(UserRegisterRequestDTO requestDTO);
    AuthResponseDTO loginUser(AuthRequestDTO loginRequest);

    boolean isUserSessionValid(String email);

    void generateForgotPasswordOtp(String email);
    boolean verifyOtpAndResetPassword(String email, String otp, String newPassword);

    void sendRegistrationOtp(String email, String idNumber);
}