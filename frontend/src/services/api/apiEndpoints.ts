export const API_ENDPOINTS = {
  FOLLOW_UP_QUEUE: {
    BASE: '/follow-up-queue',
    SUMMARY: '/follow-up-queue/summary',
    BY_ID: (id: string | number) => `/follow-up-queue/${id}`,
    TOGGLE_DONE: (id: string | number) => `/follow-up-queue/${id}/toggle-done`,
    ACTION: (id: string | number) => `/follow-up-queue/${id}/action`,
    RESET: '/follow-up-queue/reset',
  },
  OPPORTUNITIES: {
    BASE: '/opportunities',
    SUMMARY: '/opportunities/summary',
    BY_ID: (id: string | number) => `/opportunities/${id}`,
    RESET: '/opportunities/reset',
  },
  APPROVALS: {
    BASE: '/approvals',
    EMPLOYEE_STATUS: (id: string | number) => `/approvals/employee/${id}/status`,
    CLIENT_STATUS: (id: string | number) => `/approvals/client/${id}/status`,
    TICKET_ASSET_STATUS: (id: string | number) => `/approvals/ticket-asset/${id}/status`,
    EMPLOYEE: '/approvals/employee',
    CLIENT: '/approvals/client',
    TICKET_ASSET: '/approvals/ticket-asset',
    RESET: '/approvals/reset',
  },
};
