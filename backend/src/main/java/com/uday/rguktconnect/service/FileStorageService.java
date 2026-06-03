package com.uday.rguktconnect.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class FileStorageService {

    private final S3Client s3Client;
    private final String bucketName;
    private final String region;

    public FileStorageService(S3Client s3Client,
                              @Value("${aws.s3.bucket-name}") String bucketName,
                              @Value("${aws.region}") String region) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.region = region;
    }

    public String uploadProfilePhoto(MultipartFile file, String idNumber, String oldPhotoUrl) {
        // Delete the old profile photo from S3 if it exists
        if (oldPhotoUrl != null && !oldPhotoUrl.isEmpty() && !oldPhotoUrl.contains("default-avatar")) {
            try {
                String s3Key = oldPhotoUrl.substring(oldPhotoUrl.indexOf(".com/") + 5);

                if (s3Key.contains("?")) {
                    s3Key = s3Key.substring(0, s3Key.indexOf("?"));
                }

                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(s3Key)
                        .build();

                s3Client.deleteObject(deleteObjectRequest);
                System.out.println("Successfully purged old profile photo asset from S3: " + s3Key);
            } catch (Exception e) {
                System.err.println("Non-blocking warning: Failed to delete old photo from S3: " + e.getMessage());
            }
        }

        try {

            String originalName = file.getOriginalFilename();
            String extension = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : ".png";

            String fileName = "profiles/" + idNumber + "-avatar" + extension;

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            long timestamp = System.currentTimeMillis();
            return String.format("https://%s.s3.%s.amazonaws.com/%s?v=%d", bucketName, region, fileName, timestamp);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile photo to AWS S3", e);
        }
    }
}