package com.company.project.projects;

import com.company.project.projects.dto.*;
import com.company.project.projects.entity.ProjectEntity;
import com.company.project.projects.entity.ProjectTaskEntity;
import com.company.project.projects.repository.ProjectRepository;
import com.company.project.projects.repository.ProjectTaskRepository;
import com.company.project.projects.service.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectTaskRepository projectTaskRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private ProjectEntity sampleProject;
    private ProjectTaskEntity sampleTask;

    @BeforeEach
    void setUp() {
        sampleProject = ProjectEntity.builder()
                .id("PRJ-2026-048")
                .projectCode("PRJ-001")
                .projectName("School Management System")
                .clientId("CL-001")
                .projectManager("Amit Sharma")
                .startDate(LocalDate.of(2026, 10, 1))
                .plannedEndDate(LocalDate.of(2026, 12, 31))
                .status("In Progress")
                .priority("High")
                .health("On Track")
                .contractValue(new BigDecimal("1250000.00"))
                .tasksCompleted(12)
                .tasksTotal(18)
                .progress(65)
                .build();

        sampleTask = ProjectTaskEntity.builder()
                .id("TSK-00128")
                .projectId("PRJ-2026-048")
                .milestone("M1 - Planning")
                .taskName("Requirement Analysis")
                .assignedTo("Amit Sharma")
                .priority("High")
                .startDate(LocalDate.of(2026, 10, 1))
                .dueDate(LocalDate.of(2026, 10, 5))
                .estimatedHours(new BigDecimal("40.0"))
                .actualHours(new BigDecimal("38.0"))
                .status("In Progress")
                .progress(80)
                .dependencies("None")
                .subtasksCompleted(3)
                .subtasksTotal(4)
                .health("On Track")
                .build();
    }

    @Test
    @DisplayName("getAllProjects returns correctly mapped DTOs")
    void testGetAllProjects() {
        when(projectRepository.findAllByOrderByIdDesc()).thenReturn(List.of(sampleProject));

        List<ProjectDto> list = projectService.getAllProjects();
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getId()).isEqualTo("PRJ-2026-048");
        assertThat(list.get(0).getProjectName()).isEqualTo("School Management System");
        assertThat(list.get(0).getContractValue()).isEqualByComparingTo("1250000.00");
    }

    @Test
    @DisplayName("getProjectById returns DTO when found and null when absent")
    void testGetProjectById() {
        when(projectRepository.findById("PRJ-2026-048")).thenReturn(Optional.of(sampleProject));
        when(projectRepository.findById("NOT-FOUND")).thenReturn(Optional.empty());

        ProjectDto found = projectService.getProjectById("PRJ-2026-048");
        assertThat(found).isNotNull();
        assertThat(found.getProjectCode()).isEqualTo("PRJ-001");

        ProjectDto missing = projectService.getProjectById("NOT-FOUND");
        assertThat(missing).isNull();
    }

    @Test
    @DisplayName("createProject generates ID and persists entity")
    void testCreateProject() {
        when(projectRepository.count()).thenReturn(48L);
        when(projectRepository.save(any(ProjectEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateProjectRequest req = CreateProjectRequest.builder()
                .projectCode("PRJ-049")
                .projectName("New Project")
                .clientId("CL-002")
                .projectManager("Sneha Nair")
                .startDate(LocalDate.of(2026, 11, 1))
                .plannedEndDate(LocalDate.of(2027, 2, 1))
                .build();

        ProjectDto dto = projectService.createProject(req);
        assertThat(dto.getId()).isEqualTo("PRJ-2026-049");
        assertThat(dto.getProjectName()).isEqualTo("New Project");
        assertThat(dto.getStatus()).isEqualTo("In Progress");
    }

    @Test
    @DisplayName("updateProject modifies existing fields and returns updated DTO")
    void testUpdateProject() {
        when(projectRepository.findById("PRJ-2026-048")).thenReturn(Optional.of(sampleProject));
        when(projectRepository.save(any(ProjectEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProjectRequest req = UpdateProjectRequest.builder()
                .status("Completed")
                .progress(100)
                .build();

        ProjectDto updated = projectService.updateProject("PRJ-2026-048", req);
        assertThat(updated).isNotNull();
        assertThat(updated.getStatus()).isEqualTo("Completed");
        assertThat(updated.getProgress()).isEqualTo(100);
    }

    @Test
    @DisplayName("deleteProject deletes tasks and project entity")
    void testDeleteProject() {
        projectService.deleteProject("PRJ-2026-048");
        verify(projectTaskRepository).deleteByProjectId("PRJ-2026-048");
        verify(projectRepository).deleteById("PRJ-2026-048");
    }

    @Test
    @DisplayName("createTask generates ID, persists entity and syncs project task stats")
    void testCreateTask() {
        when(projectTaskRepository.count()).thenReturn(8L);
        when(projectTaskRepository.save(any(ProjectTaskEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.findById("PRJ-2026-048")).thenReturn(Optional.of(sampleProject));
        when(projectTaskRepository.countByProjectId("PRJ-2026-048")).thenReturn(10L);
        when(projectTaskRepository.countByProjectIdAndStatusIgnoreCase("PRJ-2026-048", "Completed")).thenReturn(5L);

        CreateProjectTaskRequest req = CreateProjectTaskRequest.builder()
                .projectId("PRJ-2026-048")
                .milestone("M1 - Setup")
                .taskName("DB Setup")
                .assignedTo("Rohan Verma")
                .startDate(LocalDate.of(2026, 10, 1))
                .dueDate(LocalDate.of(2026, 10, 5))
                .build();

        ProjectTaskDto dto = projectService.createTask(req);
        assertThat(dto.getId()).isEqualTo("TSK-00128");
        assertThat(dto.getTaskName()).isEqualTo("DB Setup");
        verify(projectRepository).save(any(ProjectEntity.class));
    }

    @Test
    @DisplayName("updateTask modifies task fields and syncs project stats")
    void testUpdateTask() {
        when(projectTaskRepository.findById("TSK-00128")).thenReturn(Optional.of(sampleTask));
        when(projectTaskRepository.save(any(ProjectTaskEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.findById("PRJ-2026-048")).thenReturn(Optional.of(sampleProject));
        when(projectTaskRepository.countByProjectId("PRJ-2026-048")).thenReturn(10L);
        when(projectTaskRepository.countByProjectIdAndStatusIgnoreCase("PRJ-2026-048", "Completed")).thenReturn(8L);

        UpdateProjectTaskRequest req = UpdateProjectTaskRequest.builder()
                .status("Completed")
                .progress(100)
                .build();

        ProjectTaskDto updated = projectService.updateTask("TSK-00128", req);
        assertThat(updated).isNotNull();
        assertThat(updated.getStatus()).isEqualTo("Completed");
        assertThat(updated.getProgress()).isEqualTo(100);
        verify(projectRepository).save(any(ProjectEntity.class));
    }

    @Test
    @DisplayName("deleteTask removes task and syncs project stats")
    void testDeleteTask() {
        when(projectTaskRepository.findById("TSK-00128")).thenReturn(Optional.of(sampleTask));
        when(projectRepository.findById("PRJ-2026-048")).thenReturn(Optional.of(sampleProject));

        projectService.deleteTask("TSK-00128");
        verify(projectTaskRepository).deleteById("TSK-00128");
        verify(projectRepository).save(any(ProjectEntity.class));
    }

    @Test
    @DisplayName("getProjectKpis calculates KPIs correctly")
    void testGetProjectKpis() {
        when(projectRepository.countTotalProjects()).thenReturn(48L);
        when(projectRepository.countActiveProjects()).thenReturn(32L);
        when(projectRepository.countProjectsAtRisk()).thenReturn(6L);
        when(projectRepository.sumTotalContractValue()).thenReturn(new BigDecimal("48690.00"));

        ProjectKpiResponse kpis = projectService.getProjectKpis();
        assertThat(kpis.getTotalProjects()).isEqualTo(48L);
        assertThat(kpis.getActiveProjects()).isEqualTo(32L);
        assertThat(kpis.getProjectsAtRisk()).isEqualTo(6L);
        assertThat(kpis.getTotalContractValueFormatted()).contains("48,690");
    }

    @Test
    @DisplayName("getProjectFilterOptions returns distinct lists")
    void testGetProjectFilterOptions() {
        when(projectRepository.findDistinctClients()).thenReturn(List.of("CL-001"));
        when(projectRepository.findDistinctProjectManagers()).thenReturn(List.of("Amit Sharma"));
        when(projectRepository.findDistinctStatuses()).thenReturn(List.of("In Progress"));
        when(projectRepository.findDistinctPriorities()).thenReturn(List.of("High"));

        ProjectFilterOptionsResponse resp = projectService.getProjectFilterOptions();
        assertThat(resp.getClients()).containsExactly("CL-001");
        assertThat(resp.getManagers()).containsExactly("Amit Sharma");
    }

    @Test
    @DisplayName("getTaskFilterOptions returns distinct lists")
    void testGetTaskFilterOptions() {
        when(projectTaskRepository.findDistinctProjectIds()).thenReturn(List.of("PRJ-001"));
        when(projectTaskRepository.findDistinctMilestones()).thenReturn(List.of("M1 - Setup"));
        when(projectTaskRepository.findDistinctAssignees()).thenReturn(List.of("Amit Sharma"));
        when(projectTaskRepository.findDistinctStatuses()).thenReturn(List.of("In Progress"));
        when(projectTaskRepository.findDistinctPriorities()).thenReturn(List.of("High"));

        TaskFilterOptionsResponse resp = projectService.getTaskFilterOptions();
        assertThat(resp.getProjects()).containsExactly("PRJ-001");
        assertThat(resp.getMilestones()).containsExactly("M1 - Setup");
    }
}
