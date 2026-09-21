package com.uday.rguktconnect.service.job;

import com.uday.rguktconnect.dto.jobs.JobCreateRequestDTO;
import com.uday.rguktconnect.dto.jobs.JobResponseDTO;

import java.util.List;

public interface JobService {
    List<JobResponseDTO> getAllJobs();
    JobResponseDTO createJob(String authorEmail, JobCreateRequestDTO requestDTO);
    void deleteJob(String userEmail, Long jobId);
}
