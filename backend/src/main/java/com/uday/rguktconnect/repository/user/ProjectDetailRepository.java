package com.uday.rguktconnect.repository.user;

import com.uday.rguktconnect.entity.Project;
import com.uday.rguktconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectDetailRepository extends JpaRepository<Project, Long> {
    List<Project> findByUser(User user);
}