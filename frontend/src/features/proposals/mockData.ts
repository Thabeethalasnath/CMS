import { Proposal, ProposalKpiSummary } from './types';

export const initialProposals: Proposal[] = [
  {
    proposalId: 'P-2025-001',
    opportunityId: 'O-2025-003',
    clientId: 'C-001',
    clientName: 'Tata Consultancy Enterprise',
    proposalDate: '15 Mar 2025',
    validUntil: '30 Apr 2025',
    version: 'V1.0',
    title: 'Website Redesign Proposal',
    serviceId: 'S-001',
    serviceName: 'Web & UI Engineering',
    serviceBeforeTax: 100000,
    taxAmount: 18000,
    totalAmount: 118000,
    ownerId: 'EMP-001',
    ownerName: 'Akshit Ujjain',
    status: 'Sent',
    expectedDecisionDate: '28 Apr 2025',
    description: 'Complete UI/UX and responsive frontend redevelopment for corporate portals.',
    createdAt: '2025-03-15T10:30:00Z',
  },
  {
    proposalId: 'P-2025-002',
    opportunityId: 'O-2025-001',
    clientId: 'C-003',
    clientName: 'Infosys BPM Limited',
    proposalDate: '14 Mar 2025',
    validUntil: '14 Apr 2025',
    version: 'V1.1',
    title: 'Mobile App Development',
    serviceId: 'S-002',
    serviceName: 'Cross-Platform Mobile Dev',
    serviceBeforeTax: 500000,
    taxAmount: 90000,
    totalAmount: 590000,
    ownerId: 'EMP-003',
    ownerName: 'Rahul Verma',
    status: 'Pending',
    expectedDecisionDate: '25 Apr 2025',
    description: 'Native Flutter mobile application for internal workforce management.',
    createdAt: '2025-03-14T09:15:00Z',
  },
  {
    proposalId: 'P-2025-003',
    opportunityId: 'O-2025-002',
    clientId: 'C-002',
    clientName: 'Wipro Technologies',
    proposalDate: '14 Mar 2025',
    validUntil: '29 Apr 2025',
    version: 'V2.0',
    title: 'ERP Implementation',
    serviceId: 'S-004',
    serviceName: 'Enterprise ERP Suite',
    serviceBeforeTax: 800000,
    taxAmount: 144000,
    totalAmount: 944000,
    ownerId: 'EMP-002',
    ownerName: 'Priya Sharma',
    status: 'Approved',
    expectedDecisionDate: '20 Mar 2025',
    description: 'Custom SAP/PostgreSQL migration and module integration across departments.',
    createdAt: '2025-03-14T11:45:00Z',
  },
  {
    proposalId: 'P-2025-004',
    opportunityId: 'O-2025-004',
    clientId: 'C-005',
    clientName: 'Reliance Digital Sol.',
    proposalDate: '13 Mar 2025',
    validUntil: '28 Mar 2025',
    version: 'V1.0',
    title: 'Digital Marketing Package',
    serviceId: 'S-003',
    serviceName: 'Growth & SEO Strategy',
    serviceBeforeTax: 200000,
    taxAmount: 36000,
    totalAmount: 236000,
    ownerId: 'EMP-004',
    ownerName: 'Vikram Mehta',
    status: 'In Review',
    expectedDecisionDate: '22 Mar 2025',
    description: 'Multi-channel acquisition campaign and omni-channel tracking setup.',
    createdAt: '2025-03-13T14:20:00Z',
  },
  {
    proposalId: 'P-2025-005',
    opportunityId: 'O-2025-005',
    clientId: 'C-004',
    clientName: 'HCL Tech Services',
    proposalDate: '13 Mar 2025',
    validUntil: '27 Mar 2025',
    version: 'V1.0',
    title: 'Cloud Infrastructure Setup',
    serviceId: 'S-005',
    serviceName: 'AWS & Kubernetes Infra',
    serviceBeforeTax: 350000,
    taxAmount: 63000,
    totalAmount: 413000,
    ownerId: 'EMP-001',
    ownerName: 'Akshit Ujjain',
    status: 'Sent',
    expectedDecisionDate: '30 Mar 2025',
    description: 'Multi-AZ cloud migration, VPC peering, CI/CD pipeline modernization.',
    createdAt: '2025-03-13T16:00:00Z',
  },
  {
    proposalId: 'P-2025-006',
    opportunityId: 'O-2025-006',
    clientId: 'C-007',
    clientName: 'Tech Mahindra Global',
    proposalDate: '12 Mar 2025',
    validUntil: '26 Mar 2025',
    version: 'V1.2',
    title: 'IT Support & Maintenance',
    serviceId: 'S-006',
    serviceName: 'Managed IT & 24/7 SLA',
    serviceBeforeTax: 120000,
    taxAmount: 21600,
    totalAmount: 141600,
    ownerId: 'EMP-003',
    ownerName: 'Rahul Verma',
    status: 'Pending',
    expectedDecisionDate: '15 Mar 2025',
    description: 'Annual Maintenance Contract for server infrastructure and SLA monitoring.',
    createdAt: '2025-03-12T08:30:00Z',
  },
  {
    proposalId: 'P-2025-007',
    opportunityId: 'O-2025-007',
    clientId: 'C-006',
    clientName: 'L&T Infotech',
    proposalDate: '12 Mar 2025',
    validUntil: '30 Apr 2025',
    version: 'V1.0',
    title: 'Custom Software Solution',
    serviceId: 'S-001',
    serviceName: 'Custom Fullstack Apps',
    serviceBeforeTax: 400000,
    taxAmount: 72000,
    totalAmount: 472000,
    ownerId: 'EMP-002',
    ownerName: 'Priya Sharma',
    status: 'Approved',
    expectedDecisionDate: '18 Mar 2025',
    description: 'Tailored billing and inventory reconciliation engine for warehouse network.',
    createdAt: '2025-03-12T13:40:00Z',
  },
  {
    proposalId: 'P-2025-008',
    opportunityId: 'O-2025-008',
    clientId: 'C-008',
    clientName: 'Cognizant Solutions',
    proposalDate: '11 Mar 2025',
    validUntil: '25 Mar 2025',
    version: 'V1.0',
    title: 'Cybersecurity Audit',
    serviceId: 'S-007',
    serviceName: 'InfoSec Compliance',
    serviceBeforeTax: 80000,
    taxAmount: 14400,
    totalAmount: 94400,
    ownerId: 'EMP-005',
    ownerName: 'Ananya Roy',
    status: 'Rejected',
    expectedDecisionDate: '12 Mar 2025',
    description: 'SOC2 Type II compliance audit, vulnerability assessment and pen testing.',
    createdAt: '2025-03-11T10:00:00Z',
  },
];

// Generate remaining mock proposals up to exactly 124 records
// Calibrated so:
// Total = 124
// Pending = 36 (including initial 2)
// Approved = 52 (including initial 2)
// Sent = 18
// In Review = 10
// Rejected = 8
const titles = [
  'AI Workflow Automation',
  'DevOps Acceleration',
  'Microservices Architecture Migration',
  'E-Commerce Portal Replatforming',
  'Data Lake & Analytics Engine',
  'CRM Custom Integration',
  'FinTech Payment Gateway',
  'Cloud Cost Optimization Audit',
  'Zero-Trust Network Architecture',
  'Mobile Banking App Redesign',
  'Supply Chain Tracking System',
  'Healthcare Telemedicine Portal',
];

const clients = [
  { id: 'C-001', name: 'Tata Consultancy Enterprise' },
  { id: 'C-002', name: 'Wipro Technologies' },
  { id: 'C-003', name: 'Infosys BPM Limited' },
  { id: 'C-004', name: 'HCL Tech Services' },
  { id: 'C-005', name: 'Reliance Digital Sol.' },
  { id: 'C-006', name: 'L&T Infotech' },
  { id: 'C-007', name: 'Tech Mahindra Global' },
  { id: 'C-008', name: 'Cognizant Solutions' },
  { id: 'C-009', name: 'Adani Digital Labs' },
  { id: 'C-010', name: 'Bharti Airtel Enterprise' },
];

const owners = [
  { id: 'EMP-001', name: 'Akshit Ujjain' },
  { id: 'EMP-002', name: 'Priya Sharma' },
  { id: 'EMP-003', name: 'Rahul Verma' },
  { id: 'EMP-004', name: 'Vikram Mehta' },
  { id: 'EMP-005', name: 'Ananya Roy' },
];

const services = [
  { id: 'S-001', name: 'Web & UI Engineering' },
  { id: 'S-002', name: 'Cross-Platform Mobile Dev' },
  { id: 'S-003', name: 'Growth & SEO Strategy' },
  { id: 'S-004', name: 'Enterprise ERP Suite' },
  { id: 'S-005', name: 'AWS & Kubernetes Infra' },
  { id: 'S-006', name: 'Managed IT & 24/7 SLA' },
  { id: 'S-007', name: 'InfoSec Compliance' },
];

// Target counts for the remaining 116 records:
// Initial: Approved = 2, Pending = 2, Sent = 2, In Review = 1, Rejected = 1
// Remaining: Approved = 50, Pending = 34, Sent = 16, In Review = 9, Rejected = 7
const targetStatuses: Proposal['status'][] = [
  ...Array(50).fill('Approved'),
  ...Array(34).fill('Pending'),
  ...Array(16).fill('Sent'),
  ...Array(9).fill('In Review'),
  ...Array(7).fill('Rejected'),
];

export const allMockProposals: Proposal[] = [
  ...initialProposals,
  ...targetStatuses.map((status, index) => {
    const num = index + 9;
    const pId = `P-2025-${String(num).padStart(3, '0')}`;
    const oppNum = (num % 25) + 1;
    const oppId = `O-2025-${String(oppNum).padStart(3, '0')}`;
    const client = clients[num % clients.length];
    const owner = owners[num % owners.length];
    const service = services[num % services.length];
    const title = titles[num % titles.length];

    const baseAmount = (Math.floor((num * 37) % 12) + 1) * 50000;
    const tax = Math.round(baseAmount * 0.18);
    const total = baseAmount + tax;

    const day = (num % 28) + 1;
    const pDate = `${String(day).padStart(2, '0')} Feb 2025`;
    const vDate = `${String((day + 15) % 28 || 28).padStart(2, '0')} Mar 2025`;
    const decDate = `${String((day + 10) % 28 || 28).padStart(2, '0')} Mar 2025`;

    return {
      proposalId: pId,
      opportunityId: oppId,
      clientId: client.id,
      clientName: client.name,
      proposalDate: pDate,
      validUntil: vDate,
      version: `V${1 + Math.floor(num / 40)}.${num % 3}`,
      title,
      serviceId: service.id,
      serviceName: service.name,
      serviceBeforeTax: baseAmount,
      taxAmount: tax,
      totalAmount: total,
      ownerId: owner.id,
      ownerName: owner.name,
      status,
      expectedDecisionDate: decDate,
      description: `Comprehensive deliverable proposal for ${title} tailored for ${client.name}.`,
      createdAt: `2025-02-${String(day).padStart(2, '0')}T10:00:00Z`,
    };
  }),
];

export const getKpiSummary = (proposals: Proposal[]): ProposalKpiSummary => {
  const totalProposals = proposals.length;
  const pendingDecisions = proposals.filter((p) => p.status === 'Pending').length;
  const approvedProposals = proposals.filter((p) => p.status === 'Approved').length;
  
  // Total proposal value (sample baseline matching designer screenshot: ₹ 8,5000)
  // Or dynamically computed:
  const totalValue = proposals.reduce((acc, p) => acc + p.totalAmount, 0);

  return {
    totalProposals: totalProposals || 124,
    totalProposalsTrend: 12,
    pendingDecisions: pendingDecisions || 36,
    pendingDecisionsTrend: -8,
    approvedProposals: approvedProposals || 52,
    approvedProposalsTrend: 18,
    totalProposalValue: 85000,
    totalProposalValueTrend: 20,
  };
};

export const formatRupee = (amount: number): string => {
  if (amount === undefined || amount === null) return '₹ 0';
  return '₹ ' + amount.toLocaleString('en-IN');
};

export const exportProposalsToCsv = (proposals: Proposal[], filename = 'CMS_Proposals_Export.csv') => {
  const headers = [
    'Proposal ID',
    'Opportunity ID',
    'Client ID',
    'Proposal Date',
    'Valid Until',
    'Version',
    'Title',
    'Service ID',
    'Service Before Tax',
    'Tax Amount',
    'Total Amount',
    'Owner ID',
    'Status',
    'Expected Decision Date',
  ];

  const rows = proposals.map((p) => [
    `"${p.proposalId}"`,
    `"${p.opportunityId}"`,
    `"${p.clientId}"`,
    `"${p.proposalDate}"`,
    `"${p.validUntil}"`,
    `"${p.version}"`,
    `"${p.title.replace(/"/g, '""')}"`,
    `"${p.serviceId}"`,
    `"${p.serviceBeforeTax}"`,
    `"${p.taxAmount}"`,
    `"${p.totalAmount}"`,
    `"${p.ownerId}"`,
    `"${p.status}"`,
    `"${p.expectedDecisionDate}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
