// Comprehensive E2E live verification of approver preservation across repeated status transitions
const API_URL = 'http://localhost:8080/api/v1';

async function run() {
  console.log('================================================================');
  console.log('   APPROVER PRESERVATION E2E VERIFICATION: TIMESHEETS & REQS    ');
  console.log('================================================================\n');

  // 1. Authenticate users
  const ceoRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'akshit.ujjain', password: '' }),
  });
  const ceoData = await ceoRes.json();
  const ceoToken = ceoData.data.token;
  console.log(`[AUTH] CEO Logged in: ${ceoData.data.name}`);

  const mdRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'gaurav.tripathy', password: '' }),
  });
  const mdData = await mdRes.json();
  const mdToken = mdData.data.token;
  console.log(`[AUTH] MD Logged in: ${mdData.data.name}`);

  const userRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'EMP-004', password: '' }),
  });
  const userData = await userRes.json();
  const userToken = userData.data.token;
  console.log(`[AUTH] Regular User Logged in: ${userData.data.name}\n`);

  // ==========================================
  // PART 1: TIMESHEETS PRESERVATION - GAURAV TRIPATHY
  // ==========================================
  console.log('----------------------------------------------------------------');
  console.log('TEST 1: Timesheet Created as Approved with MD – Gaurav Tripathy');
  console.log('----------------------------------------------------------------');
  const createTs1Res = await fetch(`${API_URL}/timesheets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mdToken}`,
    },
    body: JSON.stringify({
      projectId: 'PRJ-002',
      taskId: 'TSK-00126',
      employeeId: 'EMP-004',
      hours: 6.0,
      isBillable: true,
      billableRate: 1500,
      notes: 'Preservation test: Gaurav Tripathy Initial Approved',
      approvalStatus: 'Approved',
      assignedApprover: 'MD – Gaurav Tripathy',
      timesheetDate: '2026-11-06',
    }),
  });
  const ts1Data = (await createTs1Res.json()).data;
  console.log(`Created TS ID: ${ts1Data.timesheetId}`);
  console.log(`Initial Status: ${ts1Data.approvalStatus}`);
  console.log(`Initial Approved By: ${ts1Data.approvedBy}`);
  console.log(`Initial Assigned Approver: ${ts1Data.assignedApprover}`);
  if (ts1Data.approvedBy !== 'Gaurav Tripathy') {
    throw new Error(`Expected approvedBy "Gaurav Tripathy" but got "${ts1Data.approvedBy}"`);
  }

  // Transition to Pending
  console.log('\nTransitioning Timesheet to Pending...');
  const patchTs1Pending = await fetch(`${API_URL}/timesheets/${ts1Data.timesheetId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mdToken}`,
    },
    body: JSON.stringify({
      status: 'Pending',
    }),
  });
  const ts1PendingData = (await patchTs1Pending.json()).data;
  console.log(`Status: ${ts1PendingData.approvalStatus}`);
  console.log(`Approved By: ${ts1PendingData.approvedBy}`);
  console.log(`Assigned Approver: ${ts1PendingData.assignedApprover}`);
  if (ts1PendingData.approvedBy) {
    throw new Error(`Expected approvedBy null/undefined when Pending but got "${ts1PendingData.approvedBy}"`);
  }
  if (!ts1PendingData.assignedApprover?.includes('Gaurav Tripathy')) {
    throw new Error(`Expected assignedApprover to retain Gaurav Tripathy but got "${ts1PendingData.assignedApprover}"`);
  }

  // Transition back to Approved
  console.log('\nTransitioning Timesheet back to Approved...');
  const patchTs1Approved = await fetch(`${API_URL}/timesheets/${ts1Data.timesheetId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mdToken}`,
    },
    body: JSON.stringify({
      status: 'Approved',
    }),
  });
  const ts1ApprovedData = (await patchTs1Approved.json()).data;
  console.log(`Status: ${ts1ApprovedData.approvalStatus}`);
  console.log(`Approved By: ${ts1ApprovedData.approvedBy}`);
  console.log(`Assigned Approver: ${ts1ApprovedData.assignedApprover}`);
  if (ts1ApprovedData.approvedBy !== 'Gaurav Tripathy') {
    throw new Error(`Expected restored approvedBy "Gaurav Tripathy" but got "${ts1ApprovedData.approvedBy}"`);
  }

  // ==========================================
  // PART 2: TIMESHEETS PRESERVATION - AKSHIT UJJAIN
  // ==========================================
  console.log('\n----------------------------------------------------------------');
  console.log('TEST 2: Timesheet Created as Approved with CEO – Akshit Ujjain');
  console.log('----------------------------------------------------------------');
  const createTs2Res = await fetch(`${API_URL}/timesheets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ceoToken}`,
    },
    body: JSON.stringify({
      projectId: 'PRJ-002',
      taskId: 'TSK-00126',
      employeeId: 'EMP-004',
      hours: 4.0,
      isBillable: true,
      billableRate: 1500,
      notes: 'Preservation test: Akshit Ujjain Initial Approved',
      approvalStatus: 'Approved',
      assignedApprover: 'CEO – Akshit Ujjain',
      timesheetDate: '2026-11-06',
    }),
  });
  const ts2Data = (await createTs2Res.json()).data;
  console.log(`Created TS ID: ${ts2Data.timesheetId}`);
  console.log(`Initial Status: ${ts2Data.approvalStatus}`);
  console.log(`Initial Approved By: ${ts2Data.approvedBy}`);
  console.log(`Initial Assigned Approver: ${ts2Data.assignedApprover}`);
  if (ts2Data.approvedBy !== 'Akshit Ujjain') {
    throw new Error(`Expected approvedBy "Akshit Ujjain" but got "${ts2Data.approvedBy}"`);
  }

  // Transition to Pending
  console.log('\nTransitioning Timesheet to Pending...');
  const patchTs2Pending = await fetch(`${API_URL}/timesheets/${ts2Data.timesheetId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ceoToken}`,
    },
    body: JSON.stringify({
      status: 'Pending',
    }),
  });
  const ts2PendingData = (await patchTs2Pending.json()).data;
  console.log(`Status: ${ts2PendingData.approvalStatus}`);
  console.log(`Approved By: ${ts2PendingData.approvedBy}`);
  if (ts2PendingData.approvedBy) {
    throw new Error(`Expected approvedBy null/undefined when Pending but got "${ts2PendingData.approvedBy}"`);
  }

  // Transition back to Approved
  console.log('\nTransitioning Timesheet back to Approved...');
  const patchTs2Approved = await fetch(`${API_URL}/timesheets/${ts2Data.timesheetId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ceoToken}`,
    },
    body: JSON.stringify({
      status: 'Approved',
    }),
  });
  const ts2ApprovedData = (await patchTs2Approved.json()).data;
  console.log(`Status: ${ts2ApprovedData.approvalStatus}`);
  console.log(`Approved By: ${ts2ApprovedData.approvedBy}`);
  if (ts2ApprovedData.approvedBy !== 'Akshit Ujjain') {
    throw new Error(`Expected restored approvedBy "Akshit Ujjain" but got "${ts2ApprovedData.approvedBy}"`);
  }

  // ==========================================
  // PART 3: REQUIREMENTS PRESERVATION - GAURAV TRIPATHY
  // ==========================================
  console.log('\n----------------------------------------------------------------');
  console.log('TEST 3: Requirement Created as Completed with MD – Gaurav Tripathy');
  console.log('----------------------------------------------------------------');
  const createReq1Res = await fetch(`${API_URL}/requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mdToken}`,
    },
    body: JSON.stringify({
      projectId: 'PRJ-002',
      title: 'Req Preservation Test: Gaurav Tripathy',
      description: 'Test requirement approver preservation',
      type: 'Feature',
      status: 'Completed',
      assignedApprover: 'MD – Gaurav Tripathy',
      ownerId: 'EMP-004',
      targetRelease: 'v2.4',
    }),
  });
  const req1Data = (await createReq1Res.json()).data;
  console.log(`Created Req ID: ${req1Data.requirementId}`);
  console.log(`Initial Status: ${req1Data.status}`);
  console.log(`Initial Approved By: ${req1Data.approvedBy}`);
  console.log(`Initial Assigned Approver: ${req1Data.assignedApprover}`);
  if (req1Data.approvedBy !== 'Gaurav Tripathy') {
    throw new Error(`Expected approvedBy "Gaurav Tripathy" but got "${req1Data.approvedBy}"`);
  }

  // Transition to In Progress
  console.log('\nTransitioning Requirement to In Progress...');
  const patchReq1InProgress = await fetch(`${API_URL}/requirements/${req1Data.requirementId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mdToken}`,
    },
    body: JSON.stringify({
      status: 'In Progress',
    }),
  });
  const req1InProgressData = (await patchReq1InProgress.json()).data;
  console.log(`Status: ${req1InProgressData.status}`);
  console.log(`Approved By: ${req1InProgressData.approvedBy}`);
  console.log(`Assigned Approver: ${req1InProgressData.assignedApprover}`);
  if (req1InProgressData.approvedBy) {
    throw new Error(`Expected approvedBy null/undefined when In Progress but got "${req1InProgressData.approvedBy}"`);
  }
  if (!req1InProgressData.assignedApprover?.includes('Gaurav Tripathy')) {
    throw new Error(`Expected assignedApprover to retain Gaurav Tripathy but got "${req1InProgressData.assignedApprover}"`);
  }

  // Transition back to Completed
  console.log('\nTransitioning Requirement back to Completed...');
  const patchReq1Completed = await fetch(`${API_URL}/requirements/${req1Data.requirementId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mdToken}`,
    },
    body: JSON.stringify({
      status: 'Completed',
    }),
  });
  const req1CompletedData = (await patchReq1Completed.json()).data;
  console.log(`Status: ${req1CompletedData.status}`);
  console.log(`Approved By: ${req1CompletedData.approvedBy}`);
  console.log(`Assigned Approver: ${req1CompletedData.assignedApprover}`);
  if (req1CompletedData.approvedBy !== 'Gaurav Tripathy') {
    throw new Error(`Expected restored approvedBy "Gaurav Tripathy" but got "${req1CompletedData.approvedBy}"`);
  }

  // ==========================================
  // PART 4: REQUIREMENTS PRESERVATION - AKSHIT UJJAIN
  // ==========================================
  console.log('\n----------------------------------------------------------------');
  console.log('TEST 4: Requirement Created as Completed with CEO – Akshit Ujjain');
  console.log('----------------------------------------------------------------');
  const createReq2Res = await fetch(`${API_URL}/requirements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ceoToken}`,
    },
    body: JSON.stringify({
      projectId: 'PRJ-002',
      title: 'Req Preservation Test: Akshit Ujjain',
      description: 'Test requirement approver preservation',
      type: 'Feature',
      status: 'Completed',
      assignedApprover: 'CEO – Akshit Ujjain',
      ownerId: 'EMP-004',
      targetRelease: 'v2.4',
    }),
  });
  const req2Data = (await createReq2Res.json()).data;
  console.log(`Created Req ID: ${req2Data.requirementId}`);
  console.log(`Initial Status: ${req2Data.status}`);
  console.log(`Initial Approved By: ${req2Data.approvedBy}`);
  console.log(`Initial Assigned Approver: ${req2Data.assignedApprover}`);
  if (req2Data.approvedBy !== 'Akshit Ujjain') {
    throw new Error(`Expected approvedBy "Akshit Ujjain" but got "${req2Data.approvedBy}"`);
  }

  // Transition to In Progress
  console.log('\nTransitioning Requirement to In Progress...');
  const patchReq2InProgress = await fetch(`${API_URL}/requirements/${req2Data.requirementId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ceoToken}`,
    },
    body: JSON.stringify({
      status: 'In Progress',
    }),
  });
  const req2InProgressData = (await patchReq2InProgress.json()).data;
  console.log(`Status: ${req2InProgressData.status}`);
  console.log(`Approved By: ${req2InProgressData.approvedBy}`);
  if (req2InProgressData.approvedBy) {
    throw new Error(`Expected approvedBy null/undefined when In Progress but got "${req2InProgressData.approvedBy}"`);
  }

  // Transition back to Completed
  console.log('\nTransitioning Requirement back to Completed...');
  const patchReq2Completed = await fetch(`${API_URL}/requirements/${req2Data.requirementId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ceoToken}`,
    },
    body: JSON.stringify({
      status: 'Completed',
    }),
  });
  const req2CompletedData = (await patchReq2Completed.json()).data;
  console.log(`Status: ${req2CompletedData.status}`);
  console.log(`Approved By: ${req2CompletedData.approvedBy}`);
  if (req2CompletedData.approvedBy !== 'Akshit Ujjain') {
    throw new Error(`Expected restored approvedBy "Akshit Ujjain" but got "${req2CompletedData.approvedBy}"`);
  }

  // ==========================================
  // PART 5: REFRESH SIMULATION (GET APIs)
  // ==========================================
  console.log('\n----------------------------------------------------------------');
  console.log('TEST 5: Refresh Simulation (Direct GET on persisted items)');
  console.log('----------------------------------------------------------------');
  const getTsRes = await fetch(`${API_URL}/timesheets`, {
    headers: { Authorization: `Bearer ${ceoToken}` },
  });
  const tsList = (await getTsRes.json()).data.content;
  const fetchedTs1 = tsList.find(t => t.timesheetId === ts1Data.timesheetId);
  const fetchedTs2 = tsList.find(t => t.timesheetId === ts2Data.timesheetId);
  console.log(`Persisted TS1 (${ts1Data.timesheetId}): Status=${fetchedTs1.approvalStatus}, ApprovedBy=${fetchedTs1.approvedBy}, AssignedApprover=${fetchedTs1.assignedApprover}`);
  console.log(`Persisted TS2 (${ts2Data.timesheetId}): Status=${fetchedTs2.approvalStatus}, ApprovedBy=${fetchedTs2.approvedBy}, AssignedApprover=${fetchedTs2.assignedApprover}`);
  if (fetchedTs1.approvedBy !== 'Gaurav Tripathy' || fetchedTs2.approvedBy !== 'Akshit Ujjain') {
    throw new Error('Persisted timesheet values mismatch on GET API fetch!');
  }

  const getReqRes = await fetch(`${API_URL}/requirements`, {
    headers: { Authorization: `Bearer ${ceoToken}` },
  });
  const reqList = (await getReqRes.json()).data.content;
  const fetchedReq1 = reqList.find(r => r.requirementId === req1Data.requirementId);
  const fetchedReq2 = reqList.find(r => r.requirementId === req2Data.requirementId);
  console.log(`Persisted Req1 (${req1Data.requirementId}): Status=${fetchedReq1.status}, ApprovedBy=${fetchedReq1.approvedBy}, AssignedApprover=${fetchedReq1.assignedApprover}`);
  console.log(`Persisted Req2 (${req2Data.requirementId}): Status=${fetchedReq2.status}, ApprovedBy=${fetchedReq2.approvedBy}, AssignedApprover=${fetchedReq2.assignedApprover}`);
  if (fetchedReq1.approvedBy !== 'Gaurav Tripathy' || fetchedReq2.approvedBy !== 'Akshit Ujjain') {
    throw new Error('Persisted requirement values mismatch on GET API fetch!');
  }

  console.log('\n================================================================');
  console.log('✅ ALL APPROVER PRESERVATION TESTS PASSED SUCCESSFULLY!          ');
  console.log('================================================================');
}

run().catch(err => {
  console.error('\n❌ E2E VERIFICATION FAILED:', err);
  process.exit(1);
});
