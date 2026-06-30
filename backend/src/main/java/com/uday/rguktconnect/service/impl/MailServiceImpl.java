package com.uday.rguktconnect.service.impl;

import com.uday.rguktconnect.service.MailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Override
    public void sendOtp(String toEmail, String otp) {
        System.out.println("OTP " + toEmail + " -> " + otp);

        if (mailSender == null) {
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject("RGUKT Connect - Password Reset OTP");
            
            String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #334155;\">" +
                    "  <div style=\"max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;\">" +
                    "    <div style=\"background-color: #800000; padding: 24px; text-align: center;\">" +
                    "      <h1 style=\"color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;\">RGUKT Connect</h1>" +
                    "    </div>" +
                    "    <div style=\"padding: 32px 24px;\">" +
                    "      <p style=\"margin-top: 0; font-size: 15px; line-height: 1.5; color: #475569;\">Dear User,</p>" +
                    "      <p style=\"font-size: 15px; line-height: 1.5; color: #475569;\">We received a request to reset the password for your account. Use the following One-Time Password (OTP) to proceed:</p>" +
                    "      <div style=\"margin: 28px 0; text-align: center;\">" +
                    "        <div style=\"display: inline-block; background-color: #fff5f5; border: 1px solid #feb2b2; color: #800000; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 12px 32px; border-radius: 12px; font-family: monospace;\">" +
                    "          " + otp + "" +
                    "        </div>" +
                    "      </div>" +
                    "      <p style=\"font-size: 13px; line-height: 1.5; color: #94a3b8;\">This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>" +
                    "    </div>" +
                    "    <div style=\"background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;\">" +
                    "      <p style=\"margin: 0; font-size: 12px; color: #94a3b8;\">&copy; 2026 RGUKT Connect. All rights reserved.</p>" +
                    "    </div>" +
                    "  </div>" +
                    "</div>";
                    
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("[OTP ERROR] Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
