const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cwjahqpeaxxawpfcbykr',
  password: 'Kalpanaaasoftwaresolu',
  ssl: { rejectUnauthorized: false }
});

const employees = [
  { id: 'EMP-001', name: 'Amit Sharma', initials: 'AS', color: 'blue' },
  { id: 'EMP-002', name: 'Priya Kapoor', initials: 'PK', color: 'pink' },
  { id: 'EMP-003', name: 'Rohan Kumar', initials: 'RK', color: 'rose' },
  { id: 'EMP-004', name: 'Sneha Nair', initials: 'SN', color: 'purple' },
  { id: 'EMP-005', name: 'Vikram Shah', initials: 'VK', color: 'emerald' },
  { id: 'EMP-006', name: 'Ananya Rao', initials: 'AN', color: 'amber' },
  { id: 'EMP-007', name: 'Karthik R', initials: 'KS', color: 'orange' },
  { id: 'EMP-008', name: 'Divya Patel', initials: 'DP', color: 'teal' },
  { id: 'EMP-009', name: 'Arun Verma', initials: 'AV', color: 'blue' },
  { id: 'EMP-010', name: 'Meera Iyer', initials: 'MI', color: 'purple' },
  { id: 'EMP-011', name: 'Rajesh Gupta', initials: 'RG', color: 'amber' },
  { id: 'EMP-012', name: 'Pooja Reddy', initials: 'PR', color: 'pink' },
  { id: 'EMP-013', name: 'Sanjay Joshi', initials: 'SJ', color: 'emerald' },
  { id: 'EMP-014', name: 'Kavita Menon', initials: 'KM', color: 'rose' },
  { id: 'EMP-015', name: 'Deepak Chopra', initials: 'DC', color: 'orange' },
  { id: 'EMP-016', name: 'Nisha Sundaram', initials: 'NS', color: 'teal' },
];

const exactFirst10 = [
  {
    id: 'ATT-001248',
    date: '31 Oct 2026',
    employeeId: 'EMP-001',
    employeeName: 'Amit Sharma',
    avatarInitials: 'AS',
    avatarColor: 'blue',
    status: 'Present',
    checkIn: '09:05 AM',
    checkOut: '06:30 PM',
    workHours: '8h 25m',
    overtimeHours: '1h 00m',
    workMinutes: 505,
    overtimeMinutes: 60,
    dayType: 'Regular',
    isLate: true,
    hasOvertime: true,
  },
  {
    id: 'ATT-001247',
    date: '31 Oct 2026',
    employeeId: 'EMP-004',
    employeeName: 'Sneha Nair',
    avatarInitials: 'SN',
    avatarColor: 'purple',
    status: 'Present',
    checkIn: '09:12 AM',
    checkOut: '06:10 PM',
    workHours: '7h 58m',
    overtimeHours: '0h 30m',
    workMinutes: 478,
    overtimeMinutes: 30,
    dayType: 'Regular',
    isLate: true,
    hasOvertime: true,
  },
  {
    id: 'ATT-001246',
    date: '31 Oct 2026',
    employeeId: 'EMP-006',
    employeeName: 'Ananya Rao',
    avatarInitials: 'AN',
    avatarColor: 'amber',
    status: 'Leave',
    checkIn: '-',
    checkOut: '-',
    workHours: '0h 0m',
    overtimeHours: '0h 0m',
    workMinutes: 0,
    overtimeMinutes: 0,
    dayType: 'Regular',
    isLate: false,
    hasOvertime: false,
  },
  {
    id: 'ATT-001245',
    date: '31 Oct 2026',
    employeeId: 'EMP-002',
    employeeName: 'Priya Kapoor',
    avatarInitials: 'PK',
    avatarColor: 'pink',
    status: 'Present',
    checkIn: '09:00 AM',
    checkOut: '07:15 PM',
    workHours: '8h 45m',
    overtimeHours: '1h 45m',
    workMinutes: 525,
    overtimeMinutes: 105,
    dayType: 'Regular',
    isLate: false,
    hasOvertime: true,
  },
  {
    id: 'ATT-001244',
    date: '30 Oct 2026',
    employeeId: 'EMP-003',
    employeeName: 'Rohan Kumar',
    avatarInitials: 'RK',
    avatarColor: 'rose',
    status: 'Half Day',
    checkIn: '09:10 AM',
    checkOut: '01:30 PM',
    workHours: '4h 20m',
    overtimeHours: '0h 0m',
    workMinutes: 260,
    overtimeMinutes: 0,
    dayType: 'Regular',
    isLate: true,
    hasOvertime: false,
  },
  {
    id: 'ATT-001243',
    date: '30 Oct 2026',
    employeeId: 'EMP-007',
    employeeName: 'Karthik R',
    avatarInitials: 'KS',
    avatarColor: 'orange',
    status: 'Present',
    checkIn: '08:55 AM',
    checkOut: '06:40 PM',
    workHours: '8h 45m',
    overtimeHours: '1h 15m',
    workMinutes: 525,
    overtimeMinutes: 75,
    dayType: 'Regular',
    isLate: false,
    hasOvertime: true,
  },
  {
    id: 'ATT-001242',
    date: '30 Oct 2026',
    employeeId: 'EMP-008',
    employeeName: 'Divya Patel',
    avatarInitials: 'DP',
    avatarColor: 'teal',
    status: 'Absent',
    checkIn: '-',
    checkOut: '-',
    workHours: '0h 0m',
    overtimeHours: '0h 0m',
    workMinutes: 0,
    overtimeMinutes: 0,
    dayType: 'Regular',
    isLate: false,
    hasOvertime: false,
  },
  {
    id: 'ATT-001241',
    date: '29 Oct 2026',
    employeeId: 'EMP-005',
    employeeName: 'Vikram Shah',
    avatarInitials: 'VK',
    avatarColor: 'emerald',
    status: 'Present',
    checkIn: '09:08 AM',
    checkOut: '06:05 PM',
    workHours: '7h 57m',
    overtimeHours: '0h 25m',
    workMinutes: 477,
    overtimeMinutes: 25,
    dayType: 'Regular',
    isLate: true,
    hasOvertime: true,
  },
  {
    id: 'ATT-001240',
    date: '29 Oct 2026',
    employeeId: 'EMP-001',
    employeeName: 'Amit Sharma',
    avatarInitials: 'AS',
    avatarColor: 'blue',
    status: 'Present',
    checkIn: '09:02 AM',
    checkOut: '06:20 PM',
    workHours: '8h 18m',
    overtimeHours: '0h 50m',
    workMinutes: 498,
    overtimeMinutes: 50,
    dayType: 'Regular',
    isLate: true,
    hasOvertime: true,
  },
  {
    id: 'ATT-001239',
    date: '29 Oct 2026',
    employeeId: 'EMP-004',
    employeeName: 'Sneha Nair',
    avatarInitials: 'SN',
    avatarColor: 'purple',
    status: 'Holiday',
    checkIn: '-',
    checkOut: '-',
    workHours: '0h 0m',
    overtimeHours: '0h 0m',
    workMinutes: 0,
    overtimeMinutes: 0,
    dayType: 'Holiday',
    isLate: false,
    hasOvertime: false,
  },
];

async function init() {
  console.log('Connecting to PostgreSQL database...');
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(30) PRIMARY KEY,
        attendance_date VARCHAR(50) NOT NULL,
        employee_id VARCHAR(30) NOT NULL,
        employee_name VARCHAR(100) NOT NULL,
        avatar_initials VARCHAR(10),
        avatar_color VARCHAR(30),
        status VARCHAR(30) NOT NULL,
        check_in VARCHAR(30),
        check_out VARCHAR(30),
        work_hours VARCHAR(30),
        overtime_hours VARCHAR(30),
        work_minutes INT DEFAULT 0,
        overtime_minutes INT DEFAULT 0,
        day_type VARCHAR(30) DEFAULT 'Regular',
        is_late BOOLEAN DEFAULT FALSE,
        has_overtime BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table attendance created or verified.');

    // Clear existing
    await client.query('DELETE FROM attendance;');
    console.log('Cleared existing attendance rows.');

    // Prepare 1,248 total rows
    // Exact targets:
    // Total: 1,248
    // Present: 982
    // Late: 126
    // Overtime Hours: 320.5 hrs = 19,230 minutes

    // Exact first 10 has:
    // 6 Present (ATT-1248, 1247, 1245, 1243, 1241, 1240)
    // 1 Leave (1246)
    // 1 Half Day (1244)
    // 1 Absent (1242)
    // 1 Holiday (1239)
    // 5 Late (1248, 1247, 1244, 1241, 1240)
    // Overtime minutes in first 10: 60 + 30 + 0 + 105 + 0 + 75 + 0 + 25 + 50 + 0 = 345 minutes

    const targetTotal = 1248;
    const targetPresent = 982;
    const targetLate = 126;
    const targetOvertimeMinutes = 19230; // 320.5 * 60

    let remainingPresent = targetPresent - 6; // 976
    let remainingLate = targetLate - 5; // 121
    let remainingOvertimeMinutes = targetOvertimeMinutes - 345; // 18,885

    const allRecords = [...exactFirst10];

    // Other statuses needed: (1248 - 10) - 976 = 262 non-present records
    // Non-present categories:
    // Leave: 83
    // Absent: 77
    // Half Day: 55
    // Holiday: 47
    // Total non-present = 262
    let nonPresentQueue = [];
    for (let i = 0; i < 83; i++) nonPresentQueue.push('Leave');
    for (let i = 0; i < 77; i++) nonPresentQueue.push('Absent');
    for (let i = 0; i < 55; i++) nonPresentQueue.push('Half Day');
    for (let i = 0; i < 47; i++) nonPresentQueue.push('Holiday');

    // Shuffle nonPresentQueue slightly for realistic distribution
    nonPresentQueue.sort(() => Math.sin(allRecords.length) - 0.5);

    let nonPresentIdx = 0;

    // We will generate IDs from ATT-001238 down to ATT-000001
    for (let seq = 1238; seq >= 1; seq--) {
      const id = `ATT-${String(seq).padStart(6, '0')}`;
      const emp = employees[(seq * 7 + 3) % employees.length];

      // Generate date across October 2026, September 2026, August 2026
      const dayNum = ((seq % 28) + 1);
      const months = ['Oct 2026', 'Sep 2026', 'Aug 2026', 'Jul 2026'];
      const monthStr = months[Math.floor(seq / 320) % months.length];
      const dateStr = `${String(dayNum).padStart(2, '0')} ${monthStr}`;

      let status = 'Present';
      if (remainingPresent > 0 && (remainingPresent >= seq || Math.random() < (remainingPresent / seq))) {
        status = 'Present';
        remainingPresent--;
      } else if (nonPresentIdx < nonPresentQueue.length) {
        status = nonPresentQueue[nonPresentIdx++];
      } else {
        status = 'Present';
        remainingPresent--;
      }

      let checkIn = '-';
      let checkOut = '-';
      let workHours = '0h 0m';
      let overtimeHours = '0h 0m';
      let workMinutes = 0;
      let overtimeMinutes = 0;
      let isLate = false;
      let hasOvertime = false;
      let dayType = 'Regular';

      if (status === 'Present') {
        // Late assignment
        if (remainingLate > 0 && (remainingLate >= (remainingPresent + 1) || Math.random() < 0.15)) {
          isLate = true;
          remainingLate--;
          const lateMin = 1 + (seq % 20);
          checkIn = `09:${String(lateMin).padStart(2, '0')} AM`;
        } else {
          isLate = false;
          const onTimeMin = 45 + (seq % 15);
          checkIn = `08:${String(onTimeMin).padStart(2, '0')} AM`;
        }

        // Overtime distribution
        if (remainingOvertimeMinutes > 0 && Math.random() < 0.35) {
          const step = Math.min(remainingOvertimeMinutes, [30, 45, 60, 75, 90, 105, 120][seq % 7]);
          overtimeMinutes = step;
          remainingOvertimeMinutes -= step;
          hasOvertime = true;

          const otH = Math.floor(overtimeMinutes / 60);
          const otM = overtimeMinutes % 60;
          overtimeHours = `${otH}h ${String(otM).padStart(2, '0')}m`;

          const checkOutHour = 6 + Math.floor(overtimeMinutes / 60);
          const checkOutMin = (seq * 11) % 60;
          checkOut = `0${checkOutHour}:${String(checkOutMin).padStart(2, '0')} PM`;
          workMinutes = 480 + overtimeMinutes;
        } else {
          checkOut = `06:${String((seq * 7) % 30).padStart(2, '0')} PM`;
          workMinutes = 480 + (seq % 20);
        }

        const wH = Math.floor(workMinutes / 60);
        const wM = workMinutes % 60;
        workHours = `${wH}h ${String(wM).padStart(2, '0')}m`;

      } else if (status === 'Half Day') {
        checkIn = `09:10 AM`;
        checkOut = `01:30 PM`;
        workMinutes = 260;
        workHours = `4h 20m`;
        dayType = 'Regular';
      } else if (status === 'Holiday') {
        dayType = 'Holiday';
      }

      allRecords.push({
        id,
        date: dateStr,
        employeeId: emp.id,
        employeeName: emp.name,
        avatarInitials: emp.initials,
        avatarColor: emp.color,
        status,
        checkIn,
        checkOut,
        workHours,
        overtimeHours,
        workMinutes,
        overtimeMinutes,
        dayType,
        isLate,
        hasOvertime,
      });
    }

    // Adjust any remainder overtime to hit 19,230 exactly
    if (remainingOvertimeMinutes !== 0) {
      for (const rec of allRecords) {
        if (rec.status === 'Present') {
          rec.overtimeMinutes += remainingOvertimeMinutes;
          const otH = Math.floor(rec.overtimeMinutes / 60);
          const otM = rec.overtimeMinutes % 60;
          rec.overtimeHours = `${otH}h ${String(otM).padStart(2, '0')}m`;
          rec.hasOvertime = rec.overtimeMinutes > 0;
          break;
        }
      }
    }

    // Insert all in batches of 100
    console.log(`Inserting ${allRecords.length} attendance records into DB...`);
    const batchSize = 100;
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize);
      const values = [];
      const params = [];
      let pIdx = 1;

      for (const r of batch) {
        values.push(`($${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++})`);
        params.push(
          r.id,
          r.date,
          r.employeeId,
          r.employeeName,
          r.avatarInitials,
          r.avatarColor,
          r.status,
          r.checkIn,
          r.checkOut,
          r.workHours,
          r.overtimeHours,
          r.workMinutes,
          r.overtimeMinutes,
          r.dayType,
          r.isLate,
          r.hasOvertime
        );
      }

      const sql = `
        INSERT INTO attendance (
          id, attendance_date, employee_id, employee_name, avatar_initials, avatar_color,
          status, check_in, check_out, work_hours, overtime_hours,
          work_minutes, overtime_minutes, day_type, is_late, has_overtime
        ) VALUES ${values.join(', ')};
      `;
      await client.query(sql, params);
    }

    // Verify
    const countRes = await client.query('SELECT COUNT(*) as total FROM attendance;');
    const presentRes = await client.query("SELECT COUNT(*) as count FROM attendance WHERE status = 'Present';");
    const lateRes = await client.query('SELECT COUNT(*) as count FROM attendance WHERE is_late = true;');
    const otRes = await client.query('SELECT SUM(overtime_minutes) as ot_min FROM attendance;');

    const total = parseInt(countRes.rows[0].total, 10);
    const present = parseInt(presentRes.rows[0].count, 10);
    const late = parseInt(lateRes.rows[0].count, 10);
    const otHours = (parseInt(otRes.rows[0].ot_min || 0, 10) / 60).toFixed(1);

    console.log('Seeding verification results:');
    console.log(`- Total Records: ${total} (target: 1,248)`);
    console.log(`- Present Records: ${present} (target: 982)`);
    console.log(`- Late Records: ${late} (target: 126)`);
    console.log(`- Total Overtime Hours: ${otHours} (target: 320.5)`);

  } catch (err) {
    console.error('Error seeding attendance:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

init();
