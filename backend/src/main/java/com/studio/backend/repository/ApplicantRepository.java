package com.studio.backend.repository;

import com.studio.backend.model.Applicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, String> {
    List<Applicant> findByStatus(String status);
    List<Applicant> findByBranch(String branch);
}