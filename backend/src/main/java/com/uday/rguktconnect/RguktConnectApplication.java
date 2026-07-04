package com.uday.rguktconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.net.URI;
import java.net.URISyntaxException;

@SpringBootApplication
public class RguktConnectApplication {
	public static void main(String[] args) {
		configureDatabaseProperties();
		SpringApplication.run(RguktConnectApplication.class, args);
	}

	private static void configureDatabaseProperties() {
		String dbUrl = System.getenv("DB_URL");
		String username = System.getenv("DB_USERNAME");
		String password = System.getenv("DB_PASSWORD");

		if (dbUrl == null || dbUrl.trim().isEmpty()) {
			dbUrl = System.getenv("DATABASE_URL");
		}

		if (dbUrl != null && !dbUrl.trim().isEmpty()) {
			if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
				try {
					URI uri = new URI(dbUrl);
					String host = uri.getHost();
					int port = uri.getPort();
					String dbName = uri.getPath();
					String userInfo = uri.getUserInfo();
					
					if (userInfo != null) {
						String[] userParts = userInfo.split(":");
						username = userParts[0];
						if (userParts.length > 1) {
							password = userParts[1];
						}
					}
					
					dbUrl = "jdbc:postgresql://" + host + (port != -1 ? ":" + port : "") + dbName;
				} catch (URISyntaxException e) {
					dbUrl = dbUrl.replace("postgres://", "jdbc:postgresql://")
								 .replace("postgresql://", "jdbc:postgresql://");
				}
			} else if (!dbUrl.startsWith("jdbc:")) {
				dbUrl = "jdbc:" + dbUrl;
			}
			
			System.setProperty("spring.datasource.url", dbUrl);
			if (username != null) {
				System.setProperty("spring.datasource.username", username);
			}
			if (password != null) {
				System.setProperty("spring.datasource.password", password);
			}
		}
	}
}
