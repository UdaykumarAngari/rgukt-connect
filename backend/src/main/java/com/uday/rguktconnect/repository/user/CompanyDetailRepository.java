package com.uday.rguktconnect.repository.user;

import com.uday.rguktconnect.entity.CompanyDetail;
import com.uday.rguktconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanyDetailRepository extends JpaRepository<CompanyDetail, Long> {
    List<CompanyDetail> findByUser(User user); // 🔍 Pulls all work milestones
}