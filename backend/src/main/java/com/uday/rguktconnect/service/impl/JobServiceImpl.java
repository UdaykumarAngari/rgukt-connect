package com.uday.rguktconnect.service.impl;

import com.uday.rguktconnect.dto.JobCreateRequestDTO;
import com.uday.rguktconnect.dto.JobResponseDTO;
import com.uday.rguktconnect.entity.Job;
import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.repository.JobRepository;
import com.uday.rguktconnect.repository.user.UserRepository;
import com.uday.rguktconnect.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDTO> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobResponseDTO createJob(String authorEmail, JobCreateRequestDTO requestDTO) {
        User user = userRepository.findByUniversityEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("User identity not found"));

        // RBAC check: only Alumni or Admins can post jobs
        if (!"ALUMNI".equalsIgnoreCase(user.getRole()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only Alumni or Admins can post job opportunities.");
        }

        Job job = new Job();
        job.setCompany(requestDTO.getCompany());
        job.setRole(requestDTO.getRole());
        job.setLocation(requestDTO.getLocation());
        job.setSalary(requestDTO.getSalary());
        job.setApplyUrl(requestDTO.getApplyUrl());
        job.setType(requestDTO.getType());
        job.setExpiresAt(requestDTO.getExpiresAt());
        job.setPostedBy(user);
        job.setReferralAvailable(requestDTO.isReferralAvailable());
        job.setCategory(requestDTO.getCategory());

        Job savedJob = jobRepository.save(job);
        return mapToDTO(savedJob);
    }

    @Override
    public void deleteJob(String userEmail, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User user = userRepository.findByUniversityEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!job.getPostedBy().getId().equals(user.getId()) && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("You are not authorized to delete this job posting");
        }

        jobRepository.delete(job);
    }

    private JobResponseDTO mapToDTO(Job job) {
        return JobResponseDTO.builder()
                .id(job.getId())
                .company(job.getCompany())
                .role(job.getRole())
                .location(job.getLocation())
                .salary(job.getSalary())
                .applyUrl(job.getApplyUrl())
                .type(job.getType())
                .postedBy(job.getPostedBy().getName())
                .postedById(job.getPostedBy().getId())
                .referralAvailable(job.isReferralAvailable())
                .category(job.getCategory())
                .createdAt(job.getCreatedAt())
                .expiresAt(job.getExpiresAt())
                .build();
    }
}
