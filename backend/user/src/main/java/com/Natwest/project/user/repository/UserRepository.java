package com.Natwest.project.user.repository;

import com.Natwest.project.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User,String> {
    User findByEmail(String email);
    Optional<User> findByUserID(String userID);
}
