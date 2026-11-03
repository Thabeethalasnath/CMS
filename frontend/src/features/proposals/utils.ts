import { Proposal } from './types';

export const formatRupee = (amount: number | undefined | null): string => {
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

