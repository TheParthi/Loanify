package com.studio.backend.service;

import com.studio.backend.model.Applicant;
import com.studio.backend.repository.ApplicantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicantService {
    
    @Autowired
    private ApplicantRepository applicantRepository;
    
    public List<Applicant> getAllApplicants() {
        return applicantRepository.findAll();
    }
    
    public Optional<Applicant> getApplicantById(String id) {
        return applicantRepository.findById(id);
    }
    
    public Applicant saveApplicant(Applicant applicant) {
        return applicantRepository.save(applicant);
    }
    
    public void deleteApplicant(String id) {
        applicantRepository.deleteById(id);
    }
    
    public List<Applicant> getApplicantsByStatus(String status) {
        return applicantRepository.findByStatus(status);
    }
}