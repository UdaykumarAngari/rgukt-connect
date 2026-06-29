package com.uday.rguktconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostCreateRequestDTO {
    private String type; 
    private String content;
    private String codeSnippet;
    private String company;
    private String role;
    private String mediaUrl;
}
