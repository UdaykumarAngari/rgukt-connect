package com.uday.rguktconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.uday.rguktconnect")
public class RguktConnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(RguktConnectApplication.class, args);
	}

}
