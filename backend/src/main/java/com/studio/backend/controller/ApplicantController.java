package com.studio.backend.controller;

import com.studio.backend.model.Applicant;
import com.studio.backend.service.ApplicantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applicants")
@CrossOrigin(origins = "http://localhost:9002")
public class ApplicantController {
    
    @Autowired
    private ApplicantService applicantService;
    
    @GetMapping
    public List<Applicant> getAllApplicants() {
        return applicantService.getAllApplicants();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Applicant> getApplicantById(@PathVariable String id) {
        return applicantService.getApplicantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Applicant createApplicant(@RequestBody Applicant applicant) {
        return applicantService.saveApplicant(applicant);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Applicant> updateApplicant(@PathVariable String id, @RequestBody Applicant applicant) {
        applicant.setId(id);
        return ResponseEntity.ok(applicantService.saveApplicant(applicant));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplicant(@PathVariable String id) {
        applicantService.deleteApplicant(id);
        return ResponseEntity.ok().build();
    }
}