package com.uday.rguktconnect.service.user.impl;

import com.uday.rguktconnect.dto.ProfileResponseDTO;
import com.uday.rguktconnect.dto.ProfileUpdateRequestDTO;
import com.uday.rguktconnect.entity.*;
import com.uday.rguktconnect.repository.user.*;
import com.uday.rguktconnect.service.user.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.uday.rguktconnect.service.FileStorageService;
import java.util.List;
import java.util.Map;

@Service
@Transactional // Ensures transactional safety across all dynamic entity modifications
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private ProjectDetailRepository projectDetailRepository;

    @Autowired
    private UserExperienceRepository userExperienceRepository;

    @Autowired
    private EducationDetailRepository educationDetailRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Fetch complete student portfolio payload tree
    @Override
    public ProfileResponseDTO getFullProfile(String email) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsRepository.findByUser(user)
                .orElseGet(() -> {
                    UserDetails blank = new UserDetails();
                    blank.setUser(user);
                    return userDetailsRepository.save(blank);
                });

        List<Project> userProjects = projectDetailRepository.findByUser(user);
        List<EducationDetail> userEducationalDetails = educationDetailRepository.findByUser(user);
        List<UserExperiences> userExperiences = userExperienceRepository.findByUser(user);

        return ProfileResponseDTO.builder()
                .idNumber(user.getIdNumber())
                .name(user.getName())
                .universityEmail(user.getUniversityEmail())
                .mobileNumber(userDetails.getMobileNumber())
                .personalEmail(userDetails.getPersonalEmail())
                .branch(userDetails.getBranch())
                .batch(userDetails.getBatch())
                .profilePhoto(userDetails.getProfilePhoto())
                .description(userDetails.getDescription())
                .githubUrl(userDetails.getGithubUrl())
                .linkedinUrl(userDetails.getLinkedinUrl())
                .mentoredStudentsCount(userDetails.getMentoredStudentsCount())
                .projects(userProjects)
                .experiences(userExperiences)
                .education(userEducationalDetails)
                .build();
    }

    // Handles the smart initialize-and-patch strategy to prevent metadata loss
    @Override
    public void updateProfileDetails(String email, ProfileUpdateRequestDTO updateDTO) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsRepository.findByUser(user)
                .orElseGet(() -> {
                    UserDetails freshDetails = new UserDetails();
                    freshDetails.setUser(user);
                    return freshDetails;
                });

        if (updateDTO.getMobileNumber() != null) userDetails.setMobileNumber(updateDTO.getMobileNumber());
        if (updateDTO.getPersonalEmail() != null) userDetails.setPersonalEmail(updateDTO.getPersonalEmail());
        if (updateDTO.getBranch() != null) userDetails.setBranch(updateDTO.getBranch());
        if (updateDTO.getBatch() != null) userDetails.setBatch(updateDTO.getBatch());
        if (updateDTO.getDescription() != null) userDetails.setDescription(updateDTO.getDescription());
        if (updateDTO.getGithubUrl() != null) userDetails.setGithubUrl(updateDTO.getGithubUrl());
        if (updateDTO.getLinkedinUrl() != null) userDetails.setLinkedinUrl(updateDTO.getLinkedinUrl());
        if (updateDTO.getMentoredStudentsCount() != null) userDetails.setMentoredStudentsCount(updateDTO.getMentoredStudentsCount());

        userDetailsRepository.save(userDetails);
    }

    // Managing AWS S3 picture streams and purges legacy assets automatically
    @Override
    public ResponseEntity<?> uploadProfilePhoto(MultipartFile file, String email) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile folder not found"));

        String existingPhotoUrl = userDetails.getProfilePhoto();

        String s3PublicUrl = fileStorageService.uploadProfilePhoto(file, user.getIdNumber(), existingPhotoUrl);

        userDetails.setProfilePhoto(s3PublicUrl);
        userDetailsRepository.save(userDetails);

        return ResponseEntity.ok(Map.of("message", "Profile picture uploaded successfully", "profilePhoto", s3PublicUrl));
    }

    @Override
    public Project addProject(Project project, String email) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not found"));

        project.setUser(user);

        return projectDetailRepository.save(project);
    }
    @Override
    public Project updateProject(Long projectId, String email, Project projectDetails) {
        Project project = projectDetailRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project record not found with ID: " + projectId));

        if (!project.getUser().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized manipulation attempted on this project record");
        }

        project.setTitle(projectDetails.getTitle());
        project.setDescription(projectDetails.getDescription());
        project.setProjectUrl(projectDetails.getProjectUrl());
        project.setRepoUrl(projectDetails.getRepoUrl());

        return projectDetailRepository.save(project);
    }

    @Override
    public void deleteProject(Long projectId, String email) {
        Project project = projectDetailRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project record not found with ID: " + projectId));

        if (!project.getUser().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized deletion request rejected");
        }
        projectDetailRepository.delete(project);
    }

    @Override
    public UserExperiences addExperience(String email, UserExperiences experience) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User account record missing"));

        experience.setUser(user);
        return userExperienceRepository.save(experience);
    }

    @Override
    public UserExperiences updateExperience(Long expId, String email, UserExperiences expDetails) {
        UserExperiences experience = userExperienceRepository.findById(expId)
                .orElseThrow(() -> new RuntimeException("Experience record not found with ID: " + expId));

        if (!experience.getUser().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized manipulation attempted on this experience entry");
        }

        experience.setCompanyName(expDetails.getCompanyName());
        experience.setTitle(expDetails.getTitle());
        experience.setLocation(expDetails.getLocation());
        experience.setEmploymentType(expDetails.getEmploymentType());
        experience.setLocationType(expDetails.getLocationType());
        experience.setDescription(expDetails.getDescription());
        experience.setStartDate(expDetails.getStartDate());

        experience.setCurrentRole(expDetails.isCurrentRole());
        if (expDetails.isCurrentRole()) {
            experience.setEndDate(null);
        } else {
            experience.setEndDate(expDetails.getEndDate());
        }

        return userExperienceRepository.save(experience);
    }

    @Override
    public void deleteExperience(Long expId, String email) {
        UserExperiences experience = userExperienceRepository.findById(expId)
                .orElseThrow(() -> new RuntimeException("Experience record not found with ID: " + expId));

        if (!experience.getUser().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized deletion request rejected");
        }
        userExperienceRepository.delete(experience);
    }

    @Override
    public EducationDetail addEducation(String email, EducationDetail education) {
        User user = userRepository.findByUniversityEmail(email)
                .orElseThrow(() -> new RuntimeException("User account record missing"));

        education.setUser(user);
        return educationDetailRepository.save(education);
    }

    @Override
    public EducationDetail updateEducation(Long eduId, String email, EducationDetail eduDetails) {
        EducationDetail education = educationDetailRepository.findById(eduId)
                .orElseThrow(() -> new RuntimeException("Education history block not found with ID: " + eduId));

        if (!education.getUser().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized manipulation attempted on this education history record");
        }

        education.setInstitutionName(eduDetails.getInstitutionName());
        education.setDegree(eduDetails.getDegree());
        education.setFieldOfStudy(eduDetails.getFieldOfStudy());
        education.setStartYear(eduDetails.getStartYear());
        education.setEndYear(eduDetails.getEndYear());
        education.setGrade(eduDetails.getGrade());

        return educationDetailRepository.save(education);
    }

    @Override
    public void deleteEducation(Long eduId, String email) {
        EducationDetail education = educationDetailRepository.findById(eduId)
                .orElseThrow(() -> new RuntimeException("Education history record not found with ID: " + eduId));

        if (!education.getUser().getUniversityEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized deletion request rejected");
        }
        educationDetailRepository.delete(education);
    }
}