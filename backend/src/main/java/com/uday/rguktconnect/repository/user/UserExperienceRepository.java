package com.uday.rguktconnect.repository.user;

import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserExperiences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserExperienceRepository extends JpaRepository<UserExperiences, Long> {
    List<UserExperiences> findByUser(User user); 
}