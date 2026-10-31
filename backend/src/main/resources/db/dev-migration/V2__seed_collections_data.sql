-- V2__seed_collections_data.sql
-- Description: Seed initial 38 invoices and 3 payment records from mockData.ts safely with ON CONFLICT DO NOTHING

INSERT INTO public.collections_invoices (
    id, client_id, client_name, invoice_date, due_date,
    invoice_amount, amount_paid, outstanding, days_overdue,
    ageing_bucket, status, recommended_action
) VALUES
  ('INV-2024-001', 'CL-0012', 'Acme Pvt Ltd', '2025-01-05', '2025-02-04', 240000.00, 0.00, 240000.00, 45, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-002', 'CL-0015', 'Bright Solutions', '2025-01-12', '2025-02-11', 180000.00, 0.00, 180000.00, 38, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-003', 'CL-0018', 'CloudTech Services', '2025-01-20', '2025-02-19', 90000.00, 0.00, 90000.00, 30, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-004', 'CL-0021', 'Delta Systems', '2025-02-02', '2025-04-04', 320000.00, 0.00, 320000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-005', 'CL-0024', 'Evergreen Retail', '2025-02-15', '2025-03-17', 110000.00, 0.00, 110000.00, NULL, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-006', 'CL-0028', 'Future Logistics', '2025-02-28', '2025-03-30', 500000.00, 240000.00, 260000.00, NULL, '1–30 days', 'Partially Paid', 'Follow up 2nd installment'),
  ('INV-2024-007', 'CL-0031', 'Global Traders', '2025-03-10', '2025-04-09', 80000.00, 0.00, 80000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-008', 'CL-0035', 'Helix Media', '2025-03-12', '2025-04-11', 150000.00, 0.00, 150000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-009', 'CL-0039', 'Innovate Labs', '2025-03-15', '2025-04-14', 95000.00, 0.00, 95000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-010', 'CL-0042', 'Jaya Enterprises', '2025-03-18', '2025-04-17', 120000.00, 0.00, 120000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-011', 'CL-0045', 'Kestrel Analytics', '2024-12-18', '2025-01-17', 140000.00, 0.00, 140000.00, 63, '61–90 days', 'Overdue', 'Legal notice warning'),
  ('INV-2024-012', 'CL-0048', 'Luminary Design Co', '2024-12-22', '2025-01-21', 280000.00, 0.00, 280000.00, 59, '31–60 days', 'Overdue', 'Call Account Manager'),
  ('INV-2024-013', 'CL-0051', 'Matrix Infotech', '2024-11-10', '2024-12-10', 350000.00, 0.00, 350000.00, 101, '90+ days', 'Overdue', 'Executive Escalate'),
  ('INV-2024-014', 'CL-0054', 'Nexus Healthcare', '2025-03-01', '2025-03-31', 220000.00, 0.00, 220000.00, NULL, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-015', 'CL-0057', 'Omni Retailers', '2025-03-05', '2025-04-04', 175000.00, 75000.00, 100000.00, NULL, 'Current', 'Partially Paid', 'Send Statement'),
  ('INV-2024-016', 'CL-0060', 'Pinnacle Infra', '2025-02-14', '2025-03-16', 420000.00, 0.00, 420000.00, 4, '1–30 days', 'Due Soon', 'Call Finance Dept'),
  ('INV-2024-017', 'CL-0063', 'Quantum Solutions', '2024-11-20', '2024-12-20', 290000.00, 0.00, 290000.00, 91, '90+ days', 'Overdue', 'Senior Mgmt Follow-up'),
  ('INV-2024-018', 'CL-0066', 'Radiant Motors', '2025-01-19', '2025-02-18', 160000.00, 0.00, 160000.00, 31, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-019', 'CL-0069', 'Silverline Travels', '2025-02-01', '2025-03-03', 130000.00, 0.00, 130000.00, 17, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-020', 'CL-0072', 'Trident Logistics', '2025-02-10', '2025-03-12', 195000.00, 95000.00, 100000.00, 8, '1–30 days', 'Partially Paid', 'Payment Link Resent'),
  ('INV-2024-021', 'CL-0075', 'Universal Foods', '2025-03-08', '2025-04-07', 115000.00, 0.00, 115000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-022', 'CL-0078', 'Vanguard Security', '2025-01-15', '2025-02-14', 210000.00, 0.00, 210000.00, 35, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-023', 'CL-0081', 'Wavefront Digital', '2025-02-25', '2025-03-27', 180000.00, 0.00, 180000.00, NULL, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-024', 'CL-0084', 'Xenon Chem', '2024-12-12', '2025-01-11', 340000.00, 0.00, 340000.00, 69, '61–90 days', 'Overdue', 'Formal Collection Letter'),
  ('INV-2024-025', 'CL-0087', 'Yield Pharma', '2025-03-02', '2025-04-01', 90000.00, 0.00, 90000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-026', 'CL-0090', 'Zenith Architecture', '2025-01-05', '2025-02-04', 170000.00, 70000.00, 100000.00, 45, '31–60 days', 'Partially Paid', 'Collect Balance'),
  ('INV-2024-027', 'CL-0093', 'Alpha Builders', '2024-11-01', '2024-12-01', 340000.00, 0.00, 340000.00, 110, '90+ days', 'Overdue', 'Executive Follow-up'),
  ('INV-2024-028', 'CL-0096', 'Beacon Textiles', '2025-02-10', '2025-03-12', 85000.00, 0.00, 85000.00, 8, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-029', 'CL-0099', 'Crestview Tech', '2025-03-05', '2025-04-04', 260000.00, 260000.00, 0.00, NULL, 'Current', 'Paid', 'Receipt Issued'),
  ('INV-2024-030', 'CL-0102', 'Dynamic Media', '2025-01-08', '2025-02-07', 125000.00, 0.00, 125000.00, 42, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-031', 'CL-0105', 'Echo Energy', '2025-02-18', '2025-03-20', 145000.00, 0.00, 145000.00, NULL, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-032', 'CL-0108', 'Frontier Biotech', '2025-01-12', '2025-02-11', 215000.00, 0.00, 215000.00, 38, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-033', 'CL-0111', 'Genesis Hospitality', '2025-03-15', '2025-04-14', 190000.00, 190000.00, 0.00, NULL, 'Current', 'Paid', 'Receipt Issued'),
  ('INV-2024-034', 'CL-0114', 'Horizon Aerospace', '2025-03-04', '2025-04-03', 310000.00, 0.00, 310000.00, NULL, 'Current', 'Open', 'Monitor'),
  ('INV-2024-035', 'CL-0117', 'Imperial Exports', '2025-02-01', '2025-03-03', 135000.00, 50000.00, 85000.00, 17, '1–30 days', 'Partially Paid', 'Follow up balance'),
  ('INV-2024-036', 'CL-0120', 'Jupiter Capital', '2025-01-10', '2025-02-09', 275000.00, 0.00, 275000.00, 40, '31–60 days', 'Overdue', 'Call + Email client'),
  ('INV-2024-037', 'CL-0123', 'Kinetic Automations', '2025-02-14', '2025-03-16', 185000.00, 0.00, 185000.00, 4, '1–30 days', 'Due Soon', 'Send Reminder'),
  ('INV-2024-038', 'CL-0126', 'Lotus Retailers', '2025-03-01', '2025-03-31', 140000.00, 0.00, 140000.00, NULL, '1–30 days', 'Due Soon', 'Send Reminder')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.collections_payments (
    id, invoice_id, client_name, payment_date, amount,
    payment_method, reference_id, notes
) VALUES
  ('PAY-2025-089', 'INV-2024-006', 'Future Logistics', '2025-03-02', 240000.00, 'NEFT / RTGS', 'TXN-9842109', 'First 50% milestone payment received'),
  ('PAY-2025-074', 'INV-2024-015', 'Omni Retailers', '2025-03-10', 75000.00, 'UPI', 'UPI-7762190', 'Advance installment'),
  ('PAY-2025-061', 'INV-2024-029', 'Crestview Tech', '2025-03-12', 260000.00, 'Corporate Card', 'CC-334211', 'Full clearance payment')
ON CONFLICT (id) DO NOTHING;
