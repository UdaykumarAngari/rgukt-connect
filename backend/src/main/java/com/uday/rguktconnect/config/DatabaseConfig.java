package com.uday.rguktconnect.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource.hikari")
    public HikariDataSource dataSource() {
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
        } else {
            // Local fallback
            dbUrl = "jdbc:postgresql://localhost:5432/rgukt_connect";
            if (username == null) {
                username = "postgres";
            }
        }

        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .url(dbUrl)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
