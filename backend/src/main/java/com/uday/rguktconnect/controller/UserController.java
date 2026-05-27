//package com.uday.rguktconnect.controller;
//
//import com.uday.rguktconnect.entity.User;
//import com.uday.rguktconnect.repository.UserRepository;
//
//import com.uday.rguktconnect.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/users")
//public class UserController {
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping
//    public User createUser(@RequestBody User user) {
//        return userService.createUser(user);
//    }
//
//    @GetMapping
//    public java.util.List<User> getUsers() {
//        return userService.getAllUsers();
//    }
//}