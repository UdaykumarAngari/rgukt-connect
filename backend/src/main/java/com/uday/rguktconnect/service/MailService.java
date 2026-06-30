package com.uday.rguktconnect.service;

public interface MailService {
    void sendOtp(String toEmail, String otp);
    void sendRegistrationOtp(String toEmail, String otp);
}

