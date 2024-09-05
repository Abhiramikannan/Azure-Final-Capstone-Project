package com.Natwest.project.user.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Users")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class User {

    @Id
    private String userID; // Assuming userID is a unique identifier

    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private Date dateOfBirth;
    private String address;
    private String phoneNumber;
    private String profilePictureUrl;
    private Date registrationDate;


    // Constructors

    // Custom constructor
    public User(String username, String password, String email, String firstName, String lastName) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;

    }
}
