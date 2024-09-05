package com.Natwest.project.esg.service;

import com.Natwest.project.esg.entity.Esg;
import com.Natwest.project.esg.repo.EsgRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EsgService implements IEsgService{
    @Autowired
    EsgRepository esgRepo;


    @Override
    public String saveEsg(Esg esg) {
        esgRepo.save(esg);
        return "Data is saved successfully";
    }

    @Override
    public List<Esg> getAllEsg() {
        return esgRepo.findAll();
    }
}
