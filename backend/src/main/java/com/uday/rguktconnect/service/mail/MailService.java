package com.uday.rguktconnect.service.mail;

public interface MailService {
    void sendOtp(String toEmail, String otp);
    void sendRegistrationOtp(String toEmail, String otp);
}

