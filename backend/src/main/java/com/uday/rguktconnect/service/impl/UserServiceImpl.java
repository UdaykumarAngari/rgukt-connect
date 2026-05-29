package com.uday.rguktconnect.service.impl;

import com.uday.rguktconnect.dto.AuthResponseDTO;
import com.uday.rguktconnect.dto.UserRequestDTO;
import com.uday.rguktconnect.dto.UserResponseDTO;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.repository.UserRepository;
import com.uday.rguktconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.uday.rguktconnect.security.JwtUtil;
import java.net.PasswordAuthentication;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserResponseDTO registerUser(UserRequestDTO requestDTO){

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
        user.setBranch(requestDTO.getBranch());
        user.setBatch(requestDTO.getBatch());
        user.setMobileNumber(requestDTO.getMobileNumber());
        user.setUserType(requestDTO.getUserType());
        //encrypting password

        String securePassword = passwordEncoder.encode(requestDTO.getPassword());
        user.setPassword(securePassword);

        User savedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(savedUser.getId())
                .idNumber(savedUser.getIdNumber())
                .name(savedUser.getName())
                .universityEmail(savedUser.getUniversityEmail())
                .personalEmail(savedUser.getPersonalEmail())
                .branch(savedUser.getBranch())
                .batch(savedUser.getBatch())
                .mobileNumber(savedUser.getMobileNumber())
                .userType(savedUser.getUserType())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    @Override
    public AuthResponseDTO loginUser(UserRequestDTO loginRequest){
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
                .personalEmail(user.getPersonalEmail())
                .branch(user.getBranch())
                .batch(user.getBatch())
                .mobileNumber(user.getMobileNumber())
                .userType(user.getUserType())
                .createdAt(user.getCreatedAt())
                .build();

        String accessToken = jwtUtil.generateAccessToken(
            user.getUniversityEmail(),
            user.getIdNumber(),
            user.getBranch(),
            user.getUserType()
        );

        return AuthResponseDTO.builder()
                .user(safeUser)
                .accessToken(accessToken)
                .refreshToken("Mock Phase 2 refresh token")
                .build();
    }

    @Override
    public boolean isUserSessionValid(String email) {
        // Check if the user exists in MySQL. Returns true if present, false if not.
        return userRepository.findByUniversityEmail(email).isPresent();
    }
}

