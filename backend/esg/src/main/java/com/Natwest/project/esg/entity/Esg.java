package com.Natwest.project.esg.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Esg")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Esg {
    @Id
    private String id;
    private String link;
    private String category;
    private String image;
    private String title;
    private String subtitle;
    private String description;
    private String authorName;
    private String createdAt;
    private String readingTime;
}
