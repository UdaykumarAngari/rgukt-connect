package com.uday.rguktconnect.service;

import com.uday.rguktconnect.dto.JobCreateRequestDTO;
import com.uday.rguktconnect.dto.JobResponseDTO;

import java.util.List;

public interface JobService {
    List<JobResponseDTO> getAllJobs();
    JobResponseDTO createJob(String authorEmail, JobCreateRequestDTO requestDTO);
    void deleteJob(String userEmail, Long jobId);
}
