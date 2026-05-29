package com.uday.rguktconnect.service;
//
//import com.uday.rguktconnect.entity.User;
//import com.uday.rguktconnect.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import java.util.List;
//

import com.uday.rguktconnect.dto.AuthRequestDTO;
import com.uday.rguktconnect.dto.AuthResponseDTO;
import com.uday.rguktconnect.dto.UserRegisterRequestDTO;
import com.uday.rguktconnect.dto.UserResponseDTO;
//import com.uday.rguktconnect.dto.UserRequestDTO;


public interface UserService {
    UserResponseDTO registerUser(UserRegisterRequestDTO requestDTO);
    AuthResponseDTO loginUser(AuthRequestDTO loginRequest);

    boolean isUserSessionValid(String email);
}












//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public User createUser(User user){
//        System.out.println(user.getName());
//        System.out.println(user.getEmail());
//        return userRepository.save(user);
//    }
//    //get all users
//    public List<User> getAllUsers() {
//
//        return userRepository.findAll();
//    }
//
//    // Get User By ID
//    public User getUserById(Long id) {
//        return userRepository.findById(id).orElse(null);
//    }
//
//    // Delete User
//    public void deleteUser(Long id) {
//        userRepository.deleteById(id);
//    }
//
//}
