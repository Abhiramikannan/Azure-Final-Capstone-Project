package com.Natwest.project.esg.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.Natwest.project.esg.entity.Esg;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface EsgRepository extends MongoRepository<Esg,String> {

}
