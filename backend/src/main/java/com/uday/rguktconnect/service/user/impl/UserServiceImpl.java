package com.uday.rguktconnect.service.user.impl;

import com.uday.rguktconnect.dto.AuthRequestDTO;
import com.uday.rguktconnect.dto.AuthResponseDTO;
import com.uday.rguktconnect.dto.UserRegisterRequestDTO;
//import com.uday.rguktconnect.dto.UserRequestDTO;
import com.uday.rguktconnect.dto.UserResponseDTO;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import com.uday.rguktconnect.repository.user.UserDetailsRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.service.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.uday.rguktconnect.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.uday.rguktconnect.service.MailService mailService;

    private final java.util.Map<String, String> otpStorage = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.Map<String, java.time.LocalDateTime> otpExpiry = new java.util.concurrent.ConcurrentHashMap<>();

    @Override
    @Transactional
    public UserResponseDTO registerUser(UserRegisterRequestDTO requestDTO){

        if(userRepository.existsByIdNumberOrUniversityEmail(requestDTO.getIdNumber(), requestDTO.getUniversityEmail())){
            throw new RuntimeException("User with this ID number or UniversityEmail already Exists");
        }
        if (requestDTO.getPassword() == null || requestDTO.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be blank or null!");
        }

        // Manual Data Mapping
        User user = new User();
        user.setIdNumber(requestDTO.getIdNumber());
        user.setName(requestDTO.getName());
        user.setUniversityEmail(requestDTO.getUniversityEmail());
        if (requestDTO.getRole() != null && !requestDTO.getRole().trim().isEmpty()) {
            user.setRole(requestDTO.getRole().toUpperCase());
        } else {
            user.setRole("STUDENT");
        }

        //encrypting password

        String securePassword = passwordEncoder.encode(requestDTO.getPassword());
        user.setPassword(securePassword);

        User savedUser = userRepository.save(user);

        UserDetails blankDetails = new UserDetails();
        blankDetails.setUser(savedUser);
        blankDetails.setBranch("CSE");
        blankDetails.setMobileNumber("9876543210");
        blankDetails.setMentoredStudentsCount(0);
        userDetailsRepository.save(blankDetails);

        return UserResponseDTO.builder()
                .id(savedUser.getId())
                .idNumber(savedUser.getIdNumber())
                .name(savedUser.getName())
                .universityEmail(savedUser.getUniversityEmail())
                .createdAt(savedUser.getCreatedAt())
                .role(savedUser.getRole())
                .build();
    }

    @Override
    public AuthResponseDTO loginUser(AuthRequestDTO loginRequest){
        User user = userRepository.findByUniversityEmail(loginRequest.getUniversityEmail())
                .orElseThrow(()-> new RuntimeException("User not found with this Email"));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid email or password credentials");
        }

        UserResponseDTO safeUser = UserResponseDTO.builder()
                .id(user.getId())
                .idNumber(user.getIdNumber())
                .name(user.getName())
                .universityEmail(user.getUniversityEmail())
                .createdAt(user.getCreatedAt())
                .role(user.getRole())
                .build();

        String accessToken = jwtUtil.generateAccessToken(
            user.getUniversityEmail(),
            user.getIdNumber(),
            user.getRole()
        );

        return AuthResponseDTO.builder()
                .user(safeUser)
                .accessToken(accessToken)
                .build();
    }

    @Override
    public boolean isUserSessionValid(String email) {
        return userRepository.findByUniversityEmail(email).isPresent();
    }

    @Override
    public void generateForgotPasswordOtp(String email) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("No user registered with this university email."));

        String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
        otpStorage.put(email, otp);
        otpExpiry.put(email, java.time.LocalDateTime.now().plusMinutes(5));

        mailService.sendOtp(email, otp);
    }

    @Override
    @Transactional
    public boolean verifyOtpAndResetPassword(String email, String otp, String newPassword) {
        String storedOtp = otpStorage.get(email);
        java.time.LocalDateTime expiry = otpExpiry.get(email);

        if (storedOtp == null || expiry == null || expiry.isBefore(java.time.LocalDateTime.now())) {
            return false;
        }

        if (!storedOtp.equals(otp)) {
            return false;
        }

        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpStorage.remove(email);
        otpExpiry.remove(email);

        return true;
    }
}
