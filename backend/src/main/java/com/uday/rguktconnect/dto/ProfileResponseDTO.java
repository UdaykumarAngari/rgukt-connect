package com.uday.rguktconnect.dto;

import com.uday.rguktconnect.entity.UserExperiences;
import com.uday.rguktconnect.entity.EducationDetail;
import com.uday.rguktconnect.entity.Project;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ProfileResponseDTO {

    private Long id;

    private String idNumber;
    private String name;
    private String universityEmail;

    private String mobileNumber;
    private String personalEmail;
    private String branch;
    private String batch;
    private String profilePhoto;
    private String description;
    private String githubUrl;
    private String linkedinUrl;
    private Integer mentoredStudentsCount;

    private List<Project> projects;
    private List<UserExperiences> experiences;
    private List<EducationDetail> education;
}