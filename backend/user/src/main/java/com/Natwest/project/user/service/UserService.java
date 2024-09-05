package com.Natwest.project.user.service;

import com.Natwest.project.user.model.LoginRequest;
import com.Natwest.project.user.model.User;
import com.Natwest.project.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;



@Service
public class UserService {

    private final UserRepository userRepository;
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;

    }

    public User registerUser(User user) {

        // Set the registration date
        user.setRegistrationDate(new Date());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String userID) {

        return userRepository.findByUserID(userID);
    }

    public User updateUser(String userID, User updatedUser) {
        Optional<User> existingUser = userRepository.findById(userID);
        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();

            // Update user fields with the values from updatedUser
            userToUpdate.setUsername(updatedUser.getUsername());
            userToUpdate.setPassword(updatedUser.getPassword());
            userToUpdate.setEmail(updatedUser.getEmail());
            userToUpdate.setFirstName(updatedUser.getFirstName());
            userToUpdate.setLastName(updatedUser.getLastName());
            userToUpdate.setDateOfBirth(updatedUser.getDateOfBirth());
            userToUpdate.setAddress(updatedUser.getAddress());
            userToUpdate.setPhoneNumber(updatedUser.getPhoneNumber());
            userToUpdate.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
            ;


            // Save the updated user
            return userRepository.save(userToUpdate);
        } else {
            // Handle the case where the user with the given userID does not exist
            return null;
        }
    }

    public void deleteUser(String userID) {
        userRepository.deleteById(userID);
    }
    public String login(LoginRequest loginRequest) {

        User dbUser = userRepository.findByEmail(loginRequest.getEmail());
        
        if (dbUser != null) {

            if (loginRequest.getPassword().equals(dbUser.getPassword())) {
                String id=dbUser.getUserID();
                return id;
            }
            return null;

        }
        return null;
    }
}
