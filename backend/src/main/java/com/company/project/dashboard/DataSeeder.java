package com.company.project.dashboard;

import com.company.project.dashboard.repository.EmployeeApprovalRepository;
import com.company.project.dashboard.repository.FollowUpItemRepository;
import com.company.project.dashboard.repository.OpportunityRepository;
import com.company.project.dashboard.service.ApprovalService;
import com.company.project.dashboard.service.FollowUpService;
import com.company.project.dashboard.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final FollowUpItemRepository followUpRepository;
    private final FollowUpService followUpService;
    private final OpportunityRepository opportunityRepository;
    private final OpportunityService opportunityService;
    private final EmployeeApprovalRepository employeeApprovalRepository;
    private final ApprovalService approvalService;

    @Override
    public void run(String... args) {
        long followUpCount = followUpRepository.count();
        if (followUpCount == 0) {
            log.info("Initializing Follow-Up Queue seed data in database...");
            followUpService.resetSeedData();
            log.info("Follow-Up Queue seed data initialized with {} items.", followUpRepository.count());
        } else {
            log.info("Follow-Up Queue already contains {} items. Skipping seeding.", followUpCount);
        }

        long oppCount = opportunityRepository.count();
        if (oppCount == 0) {
            log.info("Initializing Opportunities seed data in database...");
            opportunityService.resetSeedData();
            log.info("Opportunities seed data initialized with {} items.", opportunityRepository.count());
        } else {
            log.info("Opportunities already contains {} items. Skipping seeding.", oppCount);
        }

        long approvalCount = employeeApprovalRepository.count();
        if (approvalCount == 0) {
            log.info("Initializing Approvals seed data in database...");
            approvalService.resetSeedData();
            log.info("Approvals seed data initialized with {} employee items.", employeeApprovalRepository.count());
        } else {
            log.info("Approvals already contains {} employee items. Skipping seeding.", approvalCount);
        }
    }
}
