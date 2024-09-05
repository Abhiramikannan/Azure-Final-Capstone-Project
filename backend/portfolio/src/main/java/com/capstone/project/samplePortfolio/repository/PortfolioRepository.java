package com.capstone.project.samplePortfolio.repository;

import com.capstone.project.samplePortfolio.entity.Portfolio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortfolioRepository extends MongoRepository<Portfolio,String> {
}
