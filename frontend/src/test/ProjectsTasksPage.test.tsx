import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectsTasksPage } from '@/features/projects/pages/ProjectsTasksPage';
import { projectService } from '@/features/projects/services/projectService';
import { Project, ProjectTask, ProjectKpis } from '@/features/projects/types/project';

const mockProjects: Project[] = [
  {
    id: 'PRJ-2026-048',
    projectCode: 'PRJ-001',
    projectName: 'School Management System',
    clientId: 'CL-001',
    projectManager: 'Amit Sharma',
    startDate: '2026-10-01',
    plannedEndDate: '2026-12-31',
    status: 'In Progress',
    priority: 'High',
    health: 'On Track',
    contractValue: 1250000,
    tasksCompleted: 12,
    tasksTotal: 18,
    progress: 65,
  },
  {
    id: 'PRJ-2026-047',
    projectCode: 'PRJ-002',
    projectName: 'Homeopathy Clinic Portal',
    clientId: 'CL-003',
    projectManager: 'Sneha Nair',
    startDate: '2026-09-15',
    plannedEndDate: '2026-11-15',
    status: 'In Progress',
    priority: 'Medium',
    health: 'On Track',
    contractValue: 840000,
    tasksCompleted: 8,
    tasksTotal: 12,
    progress: 70,
  },
];

const mockTasks: ProjectTask[] = [
  {
    id: 'TSK-00128',
    projectId: 'PRJ-001',
    milestone: 'M1 - Planning',
    taskName: 'Requirement Analysis',
    assignedTo: 'Amit Sharma',
    priority: 'High',
    startDate: '2026-10-01',
    dueDate: '2026-10-05',
    estimatedHours: 40,
    actualHours: 38,
    status: 'In Progress',
    progress: 80,
    dependencies: 'None',
    subtasksCompleted: 3,
    subtasksTotal: 4,
    health: 'On Track',
  },
];

const mockKpis: ProjectKpis = {
  totalProjects: 48,
  totalProjectsTrend: '↑ 12% vs last month',
  activeProjects: 32,
  activeProjectsTrend: '↑ 18% vs last month',
  projectsAtRisk: 6,
  projectsAtRiskTrend: '↓ 5% vs last month',
  totalContractValue: 48690,
  totalContractValueFormatted: '₹ 4,8690',
  totalContractValueTrend: '↑ 14% vs last month',
};

describe('ProjectsTasksPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(projectService, 'getProjects').mockResolvedValue(mockProjects);
    vi.spyOn(projectService, 'getTasks').mockResolvedValue(mockTasks);
    vi.spyOn(projectService, 'getProjectKpis').mockResolvedValue(mockKpis);
  });

  it('renders page header and subtitle matching exact Figma copy', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Projects & Task')).toBeInTheDocument();
    expect(
      screen.getByText('Plan, track and deliver projects with tasks, milestones and financial performance.')
    ).toBeInTheDocument();
  });

  it('renders all 4 metric KPI cards with labels, counts, and trends', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
      expect(screen.getByText('Projects at Risk')).toBeInTheDocument();
      expect(screen.getByText('Total Contract Value')).toBeInTheDocument();
    });

    expect(screen.getAllByText('48')[0]).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('₹ 4,8690')).toBeInTheDocument();
  });

  it('renders Projects table with live projects data and column headers', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('School Management System')).toBeInTheDocument();
      expect(screen.getByText('Homeopathy Clinic Portal')).toBeInTheDocument();
      expect(screen.getByText('PRJ-2026-048')).toBeInTheDocument();
    });

    // Both tables have 'Project ID' header
    const projectIdHeaders = screen.getAllByRole('columnheader', { name: 'Project ID' });
    expect(projectIdHeaders.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('columnheader', { name: 'Project Code' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Contract Value' })).toBeInTheDocument();
  });

  it('renders Project Tasks table with task rows and headers', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Requirement Analysis')).toBeInTheDocument();
      expect(screen.getByText('TSK-00128')).toBeInTheDocument();
    });

    // M1 - Planning is in filter and in td
    const milestones = screen.getAllByText('M1 - Planning');
    expect(milestones.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByRole('columnheader', { name: 'Task ID' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Assigned To' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Est. Hours' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Act. Hours' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Billable' })).toBeInTheDocument();
    const daysRemainingHeaders = screen.getAllByRole('columnheader', { name: 'Days Remaining' });
    expect(daysRemainingHeaders.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('columnheader', { name: 'Task Health' })).toBeInTheDocument();
  });

  it('filters projects table based on search input', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('School Management System')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      'Search by Project ID, Project Code, Project Name or Client ID...'
    );
    fireEvent.change(searchInput, { target: { value: 'Homeopathy' } });

    expect(screen.queryByText('School Management System')).not.toBeInTheDocument();
    expect(screen.getByText('Homeopathy Clinic Portal')).toBeInTheDocument();
  });

  it('opens and closes Add Project modal', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    const createBtn = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(createBtn);

    expect(screen.getByText('Create New Project')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
  });

  it('opens and closes Add Task modal', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    const createTaskBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(createTaskBtn);

    expect(screen.getByText('Create Project Task')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByText('Create Project Task')).not.toBeInTheDocument();
  });

  it('opens actions menu on 3 dots click and opens Edit Project modal', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('School Management System')).toBeInTheDocument();
    });

    const actionBtns = screen.getAllByTitle('Actions');
    expect(actionBtns.length).toBeGreaterThan(0);

    fireEvent.click(actionBtns[0]);

    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    expect(screen.getByText('Delete Project')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Edit Project'));

    expect(screen.getByText(/Edit Project \(PRJ-2026-048\)/i)).toBeInTheDocument();
  });

  it('opens delete confirmation modal when Delete Project is clicked', async () => {
    render(
      <BrowserRouter>
        <ProjectsTasksPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('School Management System')).toBeInTheDocument();
    });

    const actionBtns = screen.getAllByTitle('Actions');
    fireEvent.click(actionBtns[0]);

    const deleteBtn = screen.getByText('Delete Project');
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText(/"School Management System"/i)).toBeInTheDocument();
  });
});
