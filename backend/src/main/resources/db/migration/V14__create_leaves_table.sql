-- V14__create_leaves_table.sql
CREATE TABLE IF NOT EXISTS leaves (
    id VARCHAR(30) PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    from_date VARCHAR(50) NOT NULL,
    to_date VARCHAR(50) NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    approval_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    approved_by VARCHAR(100),
    calculated_days INTEGER NOT NULL,
    leave_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    applied_date VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed leaves data
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00086', 'EMP-001', 'Amit Sharma', 'Casual Leave', '28 Oct 2026', '28 Oct 2026', 1, 'Personal work', 'Pending', NULL, 1, 'Pending', '28 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00085', 'EMP-004', 'Sneha Nair', 'Sick Leave', '26 Oct 2026', '27 Oct 2026', 2, 'Fever and rest', 'Approved', 'Rahul Mehta', 2, 'Approved', '26 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00084', 'EMP-006', 'Ananya Rao', 'Earned Leave', '22 Oct 2026', '24 Oct 2026', 3, 'Family function', 'Approved', 'Divya Rao', 3, 'Approved', '22 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00083', 'EMP-002', 'Priya Kapoor', 'Casual Leave', '20 Oct 2026', '20 Oct 2026', 1, 'Personal work', 'Rejected', 'Arjun Nair', 1, 'Rejected', '20 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00082', 'EMP-003', 'Rohan Kumar', 'Sick Leave', '18 Oct 2026', '19 Oct 2026', 2, 'Not feeling well', 'Approved', 'Rahul Mehta', 2, 'Approved', '18 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00081', 'EMP-007', 'Karthik R', 'Earned Leave', '15 Oct 2026', '17 Oct 2026', 3, 'Vacation', 'Pending', NULL, 3, 'Pending', '15 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00080', 'EMP-008', 'Divya Patel', 'Maternity Leave', '10 Oct 2026', '25 Oct 2026', 16, 'Maternity', 'Approved', 'Sneha Iyer', 16, 'Approved', '10 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00079', 'EMP-005', 'Vikram Shah', 'Casual Leave', '08 Oct 2026', '08 Oct 2026', 1, 'Personal work', 'Rejected', 'Arjun Nair', 1, 'Rejected', '08 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00078', 'EMP-001', 'Amit Sharma', 'Earned Leave', '05 Oct 2026', '07 Oct 2026', 3, 'Out of station', 'Approved', 'Rahul Mehta', 3, 'Approved', '05 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00077', 'EMP-004', 'Sneha Nair', 'Sick Leave', '03 Oct 2026', '04 Oct 2026', 2, 'Medical treatment', 'Approved', 'Divya Rao', 2, 'Approved', '03 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00076', 'EMP-005', 'Vikram Shah', 'Paternity Leave', '08 Oct 2026', '08 Oct 2026', 1, 'Out of station', 'Pending', NULL, 1, 'Pending', '08 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00075', 'EMP-004', 'Sneha Nair', 'Maternity Leave', '01 Oct 2026', '14 Oct 2026', 14, 'Medical checkup', 'Pending', NULL, 14, 'Pending', '01 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00074', 'EMP-003', 'Rohan Kumar', 'Earned Leave', '19 Oct 2026', '21 Oct 2026', 3, 'Family function', 'Pending', NULL, 3, 'Pending', '19 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00073', 'EMP-002', 'Priya Kapoor', 'Sick Leave', '12 Oct 2026', '13 Oct 2026', 2, 'Fever and rest', 'Rejected', 'Divya Rao', 2, 'Rejected', '12 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00072', 'EMP-001', 'Amit Sharma', 'Casual Leave', '05 Oct 2026', '05 Oct 2026', 1, 'Personal work', 'Rejected', 'Rahul Mehta', 1, 'Rejected', '05 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00071', 'EMP-008', 'Divya Patel', 'Comp Off', '23 Oct 2026', '26 Oct 2026', 4, 'Maternity', 'Approved', 'Sneha Iyer', 4, 'Approved', '23 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00070', 'EMP-007', 'Karthik R', 'Paternity Leave', '16 Oct 2026', '18 Oct 2026', 3, 'Home renovation supervision', 'Pending', NULL, 3, 'Pending', '16 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00069', 'EMP-006', 'Ananya Rao', 'Maternity Leave', '09 Oct 2026', '22 Oct 2026', 14, 'Dental procedure', 'Pending', NULL, 14, 'Pending', '09 Oct 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00068', 'EMP-005', 'Vikram Shah', 'Earned Leave', '02 Sep 2026', '02 Sep 2026', 1, 'Attending sibling wedding', 'Rejected', 'Rahul Mehta', 1, 'Rejected', '02 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00067', 'EMP-004', 'Sneha Nair', 'Sick Leave', '20 Sep 2026', '23 Sep 2026', 4, 'Viral infection and rest', 'Pending', NULL, 4, 'Pending', '20 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00066', 'EMP-003', 'Rohan Kumar', 'Casual Leave', '13 Sep 2026', '15 Sep 2026', 3, 'Emergency at home', 'Approved', 'Arjun Nair', 3, 'Approved', '13 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00065', 'EMP-002', 'Priya Kapoor', 'Comp Off', '06 Sep 2026', '07 Sep 2026', 2, 'Vacation', 'Rejected', 'Divya Rao', 2, 'Rejected', '06 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00064', 'EMP-001', 'Amit Sharma', 'Paternity Leave', '24 Sep 2026', '24 Sep 2026', 1, 'Out of station', 'Rejected', 'Rahul Mehta', 1, 'Rejected', '24 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00063', 'EMP-008', 'Divya Patel', 'Maternity Leave', '17 Sep 2026', '28 Sep 2026', 14, 'Medical checkup', 'Rejected', 'Sneha Iyer', 14, 'Rejected', '17 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00062', 'EMP-007', 'Karthik R', 'Earned Leave', '10 Sep 2026', '12 Sep 2026', 3, 'Family function', 'Rejected', 'Arjun Nair', 3, 'Rejected', '10 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00061', 'EMP-006', 'Ananya Rao', 'Sick Leave', '03 Sep 2026', '04 Sep 2026', 2, 'Fever and rest', 'Approved', 'Divya Rao', 2, 'Approved', '03 Sep 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00060', 'EMP-005', 'Vikram Shah', 'Casual Leave', '21 Aug 2026', '21 Aug 2026', 1, 'Personal work', 'Pending', NULL, 1, 'Pending', '21 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00059', 'EMP-004', 'Sneha Nair', 'Comp Off', '14 Aug 2026', '17 Aug 2026', 4, 'Maternity', 'Pending', NULL, 4, 'Pending', '14 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00058', 'EMP-003', 'Rohan Kumar', 'Paternity Leave', '07 Aug 2026', '09 Aug 2026', 3, 'Home renovation supervision', 'Pending', NULL, 3, 'Pending', '07 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00057', 'EMP-002', 'Priya Kapoor', 'Maternity Leave', '25 Aug 2026', '28 Aug 2026', 14, 'Dental procedure', 'Pending', NULL, 14, 'Pending', '25 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00056', 'EMP-001', 'Amit Sharma', 'Earned Leave', '18 Aug 2026', '18 Aug 2026', 1, 'Attending sibling wedding', 'Pending', NULL, 1, 'Pending', '18 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00055', 'EMP-008', 'Divya Patel', 'Sick Leave', '11 Aug 2026', '14 Aug 2026', 4, 'Viral infection and rest', 'Pending', NULL, 4, 'Pending', '11 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00054', 'EMP-007', 'Karthik R', 'Casual Leave', '04 Aug 2026', '06 Aug 2026', 3, 'Emergency at home', 'Rejected', 'Arjun Nair', 3, 'Rejected', '04 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00053', 'EMP-006', 'Ananya Rao', 'Comp Off', '22 Jul 2026', '23 Jul 2026', 2, 'Vacation', 'Approved', 'Divya Rao', 2, 'Approved', '22 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00052', 'EMP-005', 'Vikram Shah', 'Paternity Leave', '15 Jul 2026', '15 Jul 2026', 1, 'Out of station', 'Approved', 'Rahul Mehta', 1, 'Approved', '15 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00051', 'EMP-004', 'Sneha Nair', 'Maternity Leave', '08 Jul 2026', '21 Jul 2026', 14, 'Medical checkup', 'Approved', 'Sneha Iyer', 14, 'Approved', '08 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00050', 'EMP-003', 'Rohan Kumar', 'Earned Leave', '01 Jul 2026', '03 Jul 2026', 3, 'Family function', 'Approved', 'Arjun Nair', 3, 'Approved', '01 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00049', 'EMP-002', 'Priya Kapoor', 'Sick Leave', '19 Jul 2026', '20 Jul 2026', 2, 'Fever and rest', 'Approved', 'Divya Rao', 2, 'Approved', '19 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00048', 'EMP-001', 'Amit Sharma', 'Casual Leave', '12 Jul 2026', '12 Jul 2026', 1, 'Personal work', 'Approved', 'Rahul Mehta', 1, 'Approved', '12 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00047', 'EMP-008', 'Divya Patel', 'Comp Off', '05 Jul 2026', '08 Jul 2026', 4, 'Maternity', 'Approved', 'Sneha Iyer', 4, 'Approved', '05 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00046', 'EMP-007', 'Karthik R', 'Paternity Leave', '23 Jul 2026', '25 Jul 2026', 3, 'Home renovation supervision', 'Approved', 'Arjun Nair', 3, 'Approved', '23 Jul 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00045', 'EMP-006', 'Ananya Rao', 'Maternity Leave', '16 Jun 2026', '28 Jun 2026', 14, 'Dental procedure', 'Approved', 'Divya Rao', 14, 'Approved', '16 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00044', 'EMP-005', 'Vikram Shah', 'Earned Leave', '09 Jun 2026', '09 Jun 2026', 1, 'Attending sibling wedding', 'Approved', 'Rahul Mehta', 1, 'Approved', '09 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00043', 'EMP-004', 'Sneha Nair', 'Sick Leave', '02 Jun 2026', '05 Jun 2026', 4, 'Viral infection and rest', 'Approved', 'Sneha Iyer', 4, 'Approved', '02 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00042', 'EMP-003', 'Rohan Kumar', 'Casual Leave', '20 Jun 2026', '22 Jun 2026', 3, 'Emergency at home', 'Approved', 'Arjun Nair', 3, 'Approved', '20 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00041', 'EMP-002', 'Priya Kapoor', 'Comp Off', '13 Jun 2026', '14 Jun 2026', 2, 'Vacation', 'Approved', 'Divya Rao', 2, 'Approved', '13 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00040', 'EMP-001', 'Amit Sharma', 'Paternity Leave', '06 Jun 2026', '06 Jun 2026', 1, 'Out of station', 'Approved', 'Rahul Mehta', 1, 'Approved', '06 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00039', 'EMP-008', 'Divya Patel', 'Maternity Leave', '24 Jun 2026', '28 Jun 2026', 14, 'Medical checkup', 'Approved', 'Sneha Iyer', 14, 'Approved', '24 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00038', 'EMP-007', 'Karthik R', 'Earned Leave', '17 Jun 2026', '19 Jun 2026', 3, 'Family function', 'Approved', 'Arjun Nair', 3, 'Approved', '17 Jun 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00037', 'EMP-006', 'Ananya Rao', 'Sick Leave', '10 May 2026', '11 May 2026', 2, 'Fever and rest', 'Approved', 'Divya Rao', 2, 'Approved', '10 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00036', 'EMP-005', 'Vikram Shah', 'Casual Leave', '03 May 2026', '03 May 2026', 1, 'Personal work', 'Approved', 'Rahul Mehta', 1, 'Approved', '03 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00035', 'EMP-004', 'Sneha Nair', 'Comp Off', '21 May 2026', '24 May 2026', 4, 'Maternity', 'Approved', 'Sneha Iyer', 4, 'Approved', '21 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00034', 'EMP-003', 'Rohan Kumar', 'Paternity Leave', '14 May 2026', '16 May 2026', 3, 'Home renovation supervision', 'Approved', 'Arjun Nair', 3, 'Approved', '14 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00033', 'EMP-002', 'Priya Kapoor', 'Maternity Leave', '07 May 2026', '20 May 2026', 14, 'Dental procedure', 'Approved', 'Divya Rao', 14, 'Approved', '07 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00032', 'EMP-001', 'Amit Sharma', 'Earned Leave', '25 May 2026', '25 May 2026', 1, 'Attending sibling wedding', 'Approved', 'Rahul Mehta', 1, 'Approved', '25 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00031', 'EMP-008', 'Divya Patel', 'Sick Leave', '18 May 2026', '21 May 2026', 4, 'Viral infection and rest', 'Approved', 'Sneha Iyer', 4, 'Approved', '18 May 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00030', 'EMP-007', 'Karthik R', 'Casual Leave', '11 Apr 2026', '13 Apr 2026', 3, 'Emergency at home', 'Approved', 'Arjun Nair', 3, 'Approved', '11 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00029', 'EMP-006', 'Ananya Rao', 'Comp Off', '04 Apr 2026', '05 Apr 2026', 2, 'Vacation', 'Approved', 'Divya Rao', 2, 'Approved', '04 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00028', 'EMP-005', 'Vikram Shah', 'Paternity Leave', '22 Apr 2026', '22 Apr 2026', 1, 'Out of station', 'Approved', 'Rahul Mehta', 1, 'Approved', '22 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00027', 'EMP-004', 'Sneha Nair', 'Maternity Leave', '15 Apr 2026', '28 Apr 2026', 14, 'Medical checkup', 'Approved', 'Sneha Iyer', 14, 'Approved', '15 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00026', 'EMP-003', 'Rohan Kumar', 'Earned Leave', '08 Apr 2026', '10 Apr 2026', 3, 'Family function', 'Approved', 'Arjun Nair', 3, 'Approved', '08 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00025', 'EMP-002', 'Priya Kapoor', 'Sick Leave', '01 Apr 2026', '02 Apr 2026', 2, 'Fever and rest', 'Approved', 'Divya Rao', 2, 'Approved', '01 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00024', 'EMP-001', 'Amit Sharma', 'Casual Leave', '19 Apr 2026', '19 Apr 2026', 1, 'Personal work', 'Approved', 'Rahul Mehta', 1, 'Approved', '19 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00023', 'EMP-008', 'Divya Patel', 'Comp Off', '12 Apr 2026', '15 Apr 2026', 4, 'Maternity', 'Approved', 'Sneha Iyer', 4, 'Approved', '12 Apr 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00022', 'EMP-007', 'Karthik R', 'Paternity Leave', '05 Mar 2026', '07 Mar 2026', 3, 'Home renovation supervision', 'Approved', 'Arjun Nair', 3, 'Approved', '05 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00021', 'EMP-006', 'Ananya Rao', 'Maternity Leave', '23 Mar 2026', '28 Mar 2026', 14, 'Dental procedure', 'Approved', 'Divya Rao', 14, 'Approved', '23 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00020', 'EMP-005', 'Vikram Shah', 'Earned Leave', '16 Mar 2026', '16 Mar 2026', 1, 'Attending sibling wedding', 'Approved', 'Rahul Mehta', 1, 'Approved', '16 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00019', 'EMP-004', 'Sneha Nair', 'Sick Leave', '09 Mar 2026', '12 Mar 2026', 4, 'Viral infection and rest', 'Approved', 'Sneha Iyer', 4, 'Approved', '09 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00018', 'EMP-003', 'Rohan Kumar', 'Casual Leave', '02 Mar 2026', '04 Mar 2026', 3, 'Emergency at home', 'Approved', 'Arjun Nair', 3, 'Approved', '02 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00017', 'EMP-002', 'Priya Kapoor', 'Comp Off', '20 Mar 2026', '21 Mar 2026', 2, 'Vacation', 'Approved', 'Divya Rao', 2, 'Approved', '20 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00016', 'EMP-001', 'Amit Sharma', 'Paternity Leave', '13 Mar 2026', '13 Mar 2026', 1, 'Out of station', 'Approved', 'Rahul Mehta', 1, 'Approved', '13 Mar 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00015', 'EMP-008', 'Divya Patel', 'Maternity Leave', '06 Feb 2026', '19 Feb 2026', 14, 'Medical checkup', 'Approved', 'Sneha Iyer', 14, 'Approved', '06 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00014', 'EMP-007', 'Karthik R', 'Earned Leave', '24 Feb 2026', '26 Feb 2026', 3, 'Family function', 'Approved', 'Arjun Nair', 3, 'Approved', '24 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00013', 'EMP-006', 'Ananya Rao', 'Sick Leave', '17 Feb 2026', '18 Feb 2026', 2, 'Fever and rest', 'Approved', 'Divya Rao', 2, 'Approved', '17 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00012', 'EMP-005', 'Vikram Shah', 'Casual Leave', '10 Feb 2026', '10 Feb 2026', 1, 'Personal work', 'Approved', 'Rahul Mehta', 1, 'Approved', '10 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00011', 'EMP-004', 'Sneha Nair', 'Comp Off', '03 Feb 2026', '06 Feb 2026', 4, 'Maternity', 'Approved', 'Sneha Iyer', 4, 'Approved', '03 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00010', 'EMP-003', 'Rohan Kumar', 'Paternity Leave', '21 Feb 2026', '23 Feb 2026', 3, 'Home renovation supervision', 'Approved', 'Arjun Nair', 3, 'Approved', '21 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00009', 'EMP-002', 'Priya Kapoor', 'Maternity Leave', '14 Feb 2026', '27 Feb 2026', 14, 'Dental procedure', 'Approved', 'Divya Rao', 14, 'Approved', '14 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00008', 'EMP-001', 'Amit Sharma', 'Earned Leave', '07 Feb 2026', '07 Feb 2026', 1, 'Attending sibling wedding', 'Approved', 'Rahul Mehta', 1, 'Approved', '07 Feb 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00007', 'EMP-008', 'Divya Patel', 'Sick Leave', '25 Jan 2026', '28 Jan 2026', 4, 'Viral infection and rest', 'Approved', 'Sneha Iyer', 4, 'Approved', '25 Jan 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00006', 'EMP-007', 'Karthik R', 'Casual Leave', '18 Jan 2026', '20 Jan 2026', 3, 'Emergency at home', 'Approved', 'Arjun Nair', 3, 'Approved', '18 Jan 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00005', 'EMP-006', 'Ananya Rao', 'Comp Off', '11 Jan 2026', '12 Jan 2026', 2, 'Vacation', 'Approved', 'Divya Rao', 2, 'Approved', '11 Jan 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00004', 'EMP-005', 'Vikram Shah', 'Paternity Leave', '04 Jan 2026', '04 Jan 2026', 1, 'Out of station', 'Approved', 'Rahul Mehta', 1, 'Approved', '04 Jan 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00003', 'EMP-004', 'Sneha Nair', 'Maternity Leave', '22 Jan 2026', '28 Jan 2026', 14, 'Medical checkup', 'Approved', 'Sneha Iyer', 14, 'Approved', '22 Jan 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00002', 'EMP-003', 'Rohan Kumar', 'Earned Leave', '15 Jan 2026', '17 Jan 2026', 3, 'Family function', 'Approved', 'Arjun Nair', 3, 'Approved', '15 Jan 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO leaves (id, employee_id, employee_name, leave_type, from_date, to_date, days, reason, approval_status, approved_by, calculated_days, leave_status, applied_date)
VALUES ('LV-00001', 'EMP-002', 'Priya Kapoor', 'Sick Leave', '08 Jan 2026', '09 Jan 2026', 2, 'Fever and rest', 'Approved', 'Divya Rao', 2, 'Approved', '08 Jan 2026')
ON CONFLICT (id) DO NOTHING;
