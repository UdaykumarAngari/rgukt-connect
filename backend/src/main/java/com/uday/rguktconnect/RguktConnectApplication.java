package com.uday.rguktconnect;

import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.repository.user.UserDetailsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class RguktConnectApplication {
	public static void main(String[] args) {
		SpringApplication.run(RguktConnectApplication.class, args);
	}

	@Bean
	public CommandLineRunner initTestData(UserRepository userRepository, 
                                          UserDetailsRepository userDetailsRepository, 
                                          PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.findByUniversityEmail("test@rgukt.ac.in").isPresent()) {
				User user = new User();
				user.setIdNumber("TEST0001");
				user.setName("Test User");
				user.setUniversityEmail("test@rgukt.ac.in");
				user.setRole("STUDENT");
				user.setPassword(passwordEncoder.encode("test1234"));
				User savedUser = userRepository.save(user);

				UserDetails blankDetails = new UserDetails();
				blankDetails.setUser(savedUser);
				blankDetails.setBranch("CSE");
				blankDetails.setMobileNumber("9876543210");
				blankDetails.setMentoredStudentsCount(0);
				userDetailsRepository.save(blankDetails);
				System.out.println("Auto-created test user (test@rgukt.ac.in / test1234) successfully.");
			}
		};
	}
}
