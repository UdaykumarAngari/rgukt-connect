package com.uday.rguktconnect.repository.user;

import com.uday.rguktconnect.entity.EducationDetail;
import com.uday.rguktconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EducationDetailRepository extends JpaRepository<EducationDetail, Long> {
    List<EducationDetail> findByUser(User user); 
}