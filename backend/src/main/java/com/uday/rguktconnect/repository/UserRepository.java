package com.uday.rguktconnect.repository;

import com.uday.rguktconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUniversityEmail(String universityEmail);

    boolean existsByIdNumberOrUniversityEmail(String idNumber, String universityEmail);

    boolean existsByIdNumber(String idNumber);
}