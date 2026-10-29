import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronDown, FileText, User, IndianRupee, AlertCircle } from 'lucide-react';
import { Proposal, ProposalStatus } from '../types';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProposal: Proposal) => void;
  nextId: string;
}

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  nextId,
}) => {
  const [proposalId, setProposalId] = useState(nextId);
  const [version, setVersion] = useState('1');
  const [title, setTitle] = useState('');
  const [opportunityId, setOpportunityId] = useState('');
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');

  const [proposalDate, setProposalDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [expectedDecisionDate, setExpectedDecisionDate] = useState('');

  const [amountBeforeTax, setAmountBeforeTax] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const [ownerId, setOwnerId] = useState('');
  const [status, setStatus] = useState<ProposalStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProposalId(nextId);
      setVersion('1');
      setTitle('');
      setOpportunityId('');
      setClientId('');
      setServiceId('');
      setProposalDate('');
      setValidUntil('');
      setExpectedDecisionDate('');
      setAmountBeforeTax('');
      setTaxAmount('');
      setTotalAmount('');
      setOwnerId('');
      setStatus('');
      setNotes('');
      setError('');
    }
  }, [isOpen, nextId]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setAmountBeforeTax(rawVal);
    const num = parseFloat(rawVal.replace(/,/g, ''));
    if (!isNaN(num) && num >= 0) {
      const calculatedTax = Math.round(num * 0.18);
      const calculatedTotal = num + calculatedTax;
      setTaxAmount(calculatedTax.toLocaleString('en-IN'));
      setTotalAmount(calculatedTotal.toLocaleString('en-IN'));
    } else {
      setTaxAmount('');
      setTotalAmount('');
    }
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawTax = e.target.value;
    setTaxAmount(rawTax);
    const numAmt = parseFloat(amountBeforeTax.replace(/,/g, '')) || 0;
    const numTax = parseFloat(rawTax.replace(/,/g, '')) || 0;
    setTotalAmount((numAmt + numTax).toLocaleString('en-IN'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Proposal ID Validation
    if (!proposalId.trim()) {
      setError('Proposal ID is required.');
      return;
    }

    // 2. Title Validation
    if (!title.trim()) {
      setError('Proposal title is required.');
      return;
    }
    if (title.trim().length < 3) {
      setError('Proposal title must be at least 3 characters long.');
      return;
    }

    // 3. Foreign Key References Validation
    if (!opportunityId) {
      setError('Please select an Opportunity ID.');
      return;
    }
    if (!clientId) {
      setError('Please select a Client.');
      return;
    }
    if (!serviceId) {
      setError('Please select a Service.');
      return;
    }

    // 4. Milestone & Decision Dates Validation
    if (!proposalDate) {
      setError('Proposal date is required.');
      return;
    }
    if (!validUntil) {
      setError('Valid until date is required.');
      return;
    }
    if (!expectedDecisionDate) {
      setError('Expected decision date is required.');
      return;
    }

    // Chronology check
    const pDate = new Date(proposalDate);
    const vDate = new Date(validUntil);
    if (!isNaN(pDate.getTime()) && !isNaN(vDate.getTime()) && vDate < pDate) {
      setError('Valid until date cannot be earlier than the Proposal date.');
      return;
    }

    // 5. Financial Values Validation
    const numBeforeTax = parseFloat(amountBeforeTax.replace(/,/g, ''));
    if (isNaN(numBeforeTax) || numBeforeTax <= 0) {
      setError('Please enter a valid amount before tax (greater than ₹ 0).');
      return;
    }

    const numTax = parseFloat(taxAmount.replace(/,/g, '')) || 0;
    if (isNaN(numTax) || numTax < 0) {
      setError('Tax amount must be 0 or a positive number.');
      return;
    }

    const numTotal = parseFloat(totalAmount.replace(/,/g, '')) || numBeforeTax + numTax;
    if (isNaN(numTotal) || numTotal <= 0) {
      setError('Total amount must be greater than ₹ 0.');
      return;
    }

    // 6. Ownership & Status Validation
    if (!ownerId) {
      setError('Please select a Proposal Owner.');
      return;
    }
    if (!status) {
      setError('Please select a Proposal Status.');
      return;
    }

    const clientNameMap: Record<string, string> = {
      'C-001': 'Tata Consultancy Enterprise',
      'C-002': 'Reliance Digital Services',
      'C-003': 'Infosys BPM Limited',
      'C-004': 'Wipro Cloud Innovations',
      'C-005': 'HCL Tech Solutions',
      'C-006': 'Larsen & Toubro Infotech',
      'C-007': 'Mahindra Digital',
      'C-008': 'Bharti Airtel B2B',
      'C-009': 'Adani Digital Labs',
    };

    const serviceNameMap: Record<string, string> = {
      'S-001': 'Web & UI Engineering',
      'S-002': 'Mobile App Development',
      'S-003': 'Digital Marketing Package',
      'S-004': 'ERP Implementation',
      'S-005': 'Cloud Infrastructure Setup',
      'S-006': 'IT Support & Maintenance',
      'S-007': 'Cybersecurity Audit',
    };

    const ownerNameMap: Record<string, string> = {
      'EMP-001': 'Akshit Ujjain',
      'EMP-002': 'Priya Sharma',
      'EMP-003': 'Rahul Verma',
      'EMP-004': 'Vikram Mehta',
      'EMP-005': 'Ananya Roy',
    };

    const resolvedClientId = clientId || 'C-001';
    const resolvedOpportunityId = opportunityId || 'O-2025-001';
    const resolvedServiceId = serviceId || 'S-001';
    const resolvedOwnerId = ownerId || 'EMP-001';
    const resolvedStatus: ProposalStatus = (status as ProposalStatus) || 'Pending';
    const resolvedVersion = version ? (version.startsWith('V') ? version : `V${version}.0`) : 'V1.0';

    const formatDateDisplay = (dateStr: string, fallback: string) => {
      if (!dateStr) return fallback;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const newProposal: Proposal = {
      proposalId: proposalId.trim().toUpperCase(),
      opportunityId: resolvedOpportunityId,
      clientId: resolvedClientId,
      clientName: clientNameMap[resolvedClientId] || 'Corporate Client',
      proposalDate: formatDateDisplay(proposalDate, '16 Mar 2025'),
      validUntil: formatDateDisplay(validUntil, '30 Apr 2025'),
      version: resolvedVersion,
      title: title.trim(),
      serviceId: resolvedServiceId,
      serviceName: serviceNameMap[resolvedServiceId] || 'Consulting Service',
      serviceBeforeTax: numBeforeTax,
      taxAmount: numTax,
      totalAmount: numTotal,
      ownerId: resolvedOwnerId,
      ownerName: ownerNameMap[resolvedOwnerId] || 'Account Manager',
      status: resolvedStatus,
      expectedDecisionDate: formatDateDisplay(expectedDecisionDate, '28 Apr 2025'),
      description: notes.trim() || `Client proposal for ${title.trim()}`,
      createdAt: new Date().toISOString(),
    };

    onSave(newProposal);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-[840px] my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-2 shrink-0">
          <div>
            <h2 className="text-base font-bold leading-6 text-slate-900">
              Create Proposal
            </h2>
            <p className="text-xs font-normal leading-4 text-slate-500 mt-0.5">
              Enter the proposal details to create a new record.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Area */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-4 space-y-5 custom-scrollbar">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs leading-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div>
            <div className="w-full bg-[#F8FAFC] rounded-lg px-3.5 py-2 flex items-center gap-2 mb-3.5">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-slate-900 leading-4">
                Basic Information
              </span>
            </div>

            {/* Row 1: Proposal ID, Version, Title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Proposal ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={proposalId}
                  onChange={(e) => setProposalId(e.target.value)}
                  placeholder="Enter proposal ID"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Version <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal appearance-none pr-9 cursor-pointer transition-colors"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="V1.0">V1.0</option>
                    <option value="V1.1">V1.1</option>
                    <option value="V2.0">V2.0</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter proposal title"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  required
                />
              </div>
            </div>

            {/* Row 2: Opportunity ID, Client ID, Service ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Opportunity ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={opportunityId}
                    onChange={(e) => setOpportunityId(e.target.value)}
                    className={`w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal appearance-none pr-9 cursor-pointer transition-colors ${
                      opportunityId ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Select opportunity</option>
                    <option value="O-2025-001">O-2025-001</option>
                    <option value="O-2025-002">O-2025-002</option>
                    <option value="O-2025-003">O-2025-003</option>
                    <option value="O-2025-004">O-2025-004</option>
                    <option value="O-2025-005">O-2025-005</option>
                    <option value="O-2025-006">O-2025-006</option>
                    <option value="O-2025-007">O-2025-007</option>
                    <option value="O-2025-008">O-2025-008</option>
                    <option value="O-2025-009">O-2025-009</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Client ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className={`w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal appearance-none pr-9 cursor-pointer transition-colors ${
                      clientId ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Select client</option>
                    <option value="C-001">C-001 (Tata Consultancy Enterprise)</option>
                    <option value="C-002">C-002 (Reliance Digital Services)</option>
                    <option value="C-003">C-003 (Infosys BPM Limited)</option>
                    <option value="C-004">C-004 (Wipro Cloud Innovations)</option>
                    <option value="C-005">C-005 (HCL Tech Solutions)</option>
                    <option value="C-006">C-006 (Larsen & Toubro Infotech)</option>
                    <option value="C-007">C-007 (Mahindra Digital)</option>
                    <option value="C-008">C-008 (Bharti Airtel B2B)</option>
                    <option value="C-009">C-009 (Adani Digital Labs)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Service ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className={`w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal appearance-none pr-9 cursor-pointer transition-colors ${
                      serviceId ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Select service</option>
                    <option value="S-001">S-001 (Web & UI Engineering)</option>
                    <option value="S-002">S-002 (Mobile App Development)</option>
                    <option value="S-003">S-003 (Digital Marketing Package)</option>
                    <option value="S-004">S-004 (ERP Implementation)</option>
                    <option value="S-005">S-005 (Cloud Infrastructure Setup)</option>
                    <option value="S-006">S-006 (IT Support & Maintenance)</option>
                    <option value="S-007">S-007 (Cybersecurity Audit)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Timeline */}
          <div>
            <div className="w-full bg-[#F8FAFC] rounded-lg px-3.5 py-2 flex items-center gap-2 mb-3.5">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-slate-900 leading-4">
                Timeline
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Proposal Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2563EB]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    placeholder="Select proposal date"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2563EB]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    placeholder="Select valid until date"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Expected Decision Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#2563EB]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={expectedDecisionDate}
                    onChange={(e) => setExpectedDecisionDate(e.target.value)}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    placeholder="Select expected decision date"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financial Details */}
          <div>
            <div className="w-full bg-[#F8FAFC] rounded-lg px-3.5 py-2 flex items-center gap-2 mb-3.5">
              <IndianRupee className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-slate-900 leading-4">
                Financial Details
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Amount Before Tax <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-normal">
                    ₹
                  </div>
                  <input
                    type="text"
                    value={amountBeforeTax}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Tax Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-normal">
                    ₹
                  </div>
                  <input
                    type="text"
                    value={taxAmount}
                    onChange={handleTaxChange}
                    placeholder="Enter tax amount"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Total Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-normal">
                    ₹
                  </div>
                  <input
                    type="text"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="Enter total amount"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3.5 py-2 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Ownership & Status */}
          <div>
            <div className="w-full bg-[#F8FAFC] rounded-lg px-3.5 py-2 flex items-center gap-2 mb-3.5">
              <User className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-slate-900 leading-4">
                Ownership & Status
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Owner ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className={`w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal appearance-none pr-9 cursor-pointer transition-colors ${
                      ownerId ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Select owner</option>
                    <option value="EMP-001">EMP-001 (Akshit Ujjain)</option>
                    <option value="EMP-002">EMP-002 (Priya Sharma)</option>
                    <option value="EMP-003">EMP-003 (Rahul Verma)</option>
                    <option value="EMP-004">EMP-004 (Vikram Mehta)</option>
                    <option value="EMP-005">EMP-005 (Ananya Roy)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProposalStatus)}
                    className={`w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs leading-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-normal appearance-none pr-9 cursor-pointer transition-colors ${
                      status ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Select status</option>
                    <option value="Sent">Sent</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Review">In Review</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Additional Information */}
          <div>
            <div className="w-full bg-[#F8FAFC] rounded-lg px-3.5 py-2 flex items-center gap-2 mb-3.5">
              <FileText className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-semibold text-slate-900 leading-4">
                Additional Information
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 leading-4">
                Notes
              </label>
              <div className="relative border border-slate-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-colors">
                <textarea
                  rows={4}
                  maxLength={500}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes (if any)"
                  className="w-full bg-transparent px-3.5 pt-2.5 pb-6 text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none font-normal"
                />
                <div className="absolute bottom-2 right-3 text-[11px] font-normal text-slate-400 select-none">
                  {notes.length}/500
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-7 py-3.5 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold leading-4 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white rounded-lg text-xs font-semibold leading-4 transition-all shadow-xs cursor-pointer"
          >
            Save Proposal
          </button>
        </div>
      </div>
    </div>
  );
};
