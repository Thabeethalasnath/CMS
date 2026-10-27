package com.company.project.sales.service;

import com.company.project.sales.entity.LeadEntity;
import com.company.project.sales.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    @Transactional(readOnly = true)
    public List<LeadEntity> getAllLeads() {
        return leadRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @Transactional(readOnly = true)
    public Optional<LeadEntity> getLeadById(String id) {
        return leadRepository.findById(id);
    }

    @Transactional
    public LeadEntity createLead(LeadEntity lead) {
        return leadRepository.save(lead);
    }

    @Transactional
    public LeadEntity updateLead(String id, LeadEntity updatedLead) {
        return leadRepository.findById(id).map(existing -> {
            if (updatedLead.getCompany() != null) existing.setCompany(updatedLead.getCompany());
            if (updatedLead.getContactName() != null) existing.setContactName(updatedLead.getContactName());
            if (updatedLead.getEmail() != null) existing.setEmail(updatedLead.getEmail());
            if (updatedLead.getPhone() != null) existing.setPhone(updatedLead.getPhone());
            if (updatedLead.getSource() != null) existing.setSource(updatedLead.getSource());
            if (updatedLead.getServiceInterest() != null) existing.setServiceInterest(updatedLead.getServiceInterest());
            if (updatedLead.getCountry() != null) existing.setCountry(updatedLead.getCountry());
            if (updatedLead.getCity() != null) existing.setCity(updatedLead.getCity());
            if (updatedLead.getOwnerId() != null) existing.setOwnerId(updatedLead.getOwnerId());
            if (updatedLead.getStage() != null) existing.setStage(updatedLead.getStage());
            if (updatedLead.getStatus() != null) existing.setStatus(updatedLead.getStatus());
            if (updatedLead.getNextFollowUp() != null) existing.setNextFollowUp(updatedLead.getNextFollowUp());
            if (updatedLead.getEstimatedValue() != null) existing.setEstimatedValue(updatedLead.getEstimatedValue());
            if (updatedLead.getLeadScore() != null) existing.setLeadScore(updatedLead.getLeadScore());
            if (updatedLead.getExpectedValue() != null) existing.setExpectedValue(updatedLead.getExpectedValue());
            if (updatedLead.getExpectedCloseDate() != null) existing.setExpectedCloseDate(updatedLead.getExpectedCloseDate());
            if (updatedLead.getLostReason() != null) existing.setLostReason(updatedLead.getLostReason());
            if (updatedLead.getNotes() != null) existing.setNotes(updatedLead.getNotes());
            return leadRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
    }

    @Transactional
    public void deleteLead(String id) {
        leadRepository.deleteById(id);
    }
}
