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

import java.net.PasswordAuthentication;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO registerUser(UserRequestDTO requestDTO){

        if(userRepository.existsByIdNumberOrUniversityEmail(requestDTO.getIdNumber(), requestDTO.getUniversityEmail())){
            throw new RuntimeException("User with this ID number or UniversityEmail already Exists");
        }

        // Manual Data Mapping
        User user = new User();
        user.setIdNumber(requestDTO.getIdNumber());
        user.setName(requestDTO.getName());
        user.setUniversityEmail(requestDTO.getUniversityEmail());
        user.setBranch(requestDTO.getBranch());
        user.setBatch(requestDTO.getBatch());
        user.setMobileNumber(requestDTO.getMobileNumber());

        //encrypting password

        String securePassword = passwordEncoder.encode(requestDTO.getPassword());
        user.setPassword(securePassword);

        User savedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(savedUser.getId())
                .idNumber(savedUser.getIdNumber())
                .name(savedUser.getName())
                .universityEmail(savedUser.getUniversityEmail())
                .branch(savedUser.getBranch())
                .batch(savedUser.getBatch())
                .mobileNumber(savedUser.getMobileNumber())
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
                .branch(user.getBranch())
                .batch(user.getBatch())
                .mobileNumber(user.getMobileNumber())
                .createdAt(user.getCreatedAt())
                .build();

        return AuthResponseDTO.builder()
                .user(safeUser)
                .accessToken("Mock Phase 2 access token")
                .refreshToken("Mock Phase 2 refresh token")
                .build();
    }

}
