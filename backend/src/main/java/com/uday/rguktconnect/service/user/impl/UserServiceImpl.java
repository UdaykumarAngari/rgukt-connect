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
                .build();

        String accessToken = jwtUtil.generateAccessToken(
            user.getUniversityEmail(),
            user.getIdNumber()
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
}
