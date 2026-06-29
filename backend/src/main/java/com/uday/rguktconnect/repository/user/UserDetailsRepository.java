package com.uday.rguktconnect.repository.user;

import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    Optional<UserDetails> findByUser(User user);
}