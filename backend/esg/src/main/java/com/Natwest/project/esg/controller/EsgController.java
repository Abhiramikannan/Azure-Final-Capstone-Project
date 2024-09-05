package com.Natwest.project.esg.controller;

import com.Natwest.project.esg.entity.Esg;
import com.Natwest.project.esg.service.IEsgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/esg")
public class EsgController {
    @Autowired
    IEsgService esgService;
    @PostMapping("/save")
    public ResponseEntity<String> createBlog(@RequestBody Esg esg){
        return new ResponseEntity<String>(esgService.saveEsg(esg), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Esg>> readAllEsg(){
        return new ResponseEntity<List<Esg>>(esgService.getAllEsg(),HttpStatus.OK);
    }

}
