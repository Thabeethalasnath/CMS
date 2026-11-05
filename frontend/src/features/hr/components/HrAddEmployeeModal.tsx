import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, RotateCw } from 'lucide-react';
import { Department, EmployeeRecord } from '../types';
import { DEPARTMENTS } from '../mockData';

interface HrAddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (emp: Omit<EmployeeRecord, 'id'>) => Promise<boolean | void> | void;
}

export const HrAddEmployeeModal: React.FC<HrAddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [role, setRole] = useState('');
  const [monthlyCtc, setMonthlyCtc] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'Active' | 'On Notice'>('Active');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!role.trim()) errs.role = 'Role / Designation is required';
    const ctcNum = parseFloat(monthlyCtc);
    if (isNaN(ctcNum) || ctcNum <= 0) errs.monthlyCtc = 'Please enter a valid monthly CTC amount';
    if (!joiningDate) errs.joiningDate = 'Joining date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const success = await onAddEmployee({
        name: name.trim(),
        email: email.trim(),
        department,
        role: role.trim(),
        monthlyCtc: parseFloat(monthlyCtc),
        joiningDate,
        status,
        noticePeriodEnd: status === 'On Notice' ? '2025-05-15' : undefined,
      });

      // If submission failed (returned false), keep modal open and preserve form inputs
      if (success === false) {
        return;
      }

      // Reset form and close modal upon confirmed success
      setName('');
      setEmail('');
      setRole('');
      setMonthlyCtc('');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setStatus('Active');
      setErrors({});
      onClose();
    } catch {
      // Errors handled by parent toast; keep form inputs intact
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] z-10 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
              <UserPlus className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-base font-bold text-slate-900 leading-tight m-0">Add New Employee</h3>
              <p className="text-xs text-slate-500 font-normal leading-normal m-0 mt-1">
                Create a new workforce member record and update metrics.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0 disabled:opacity-40 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Maya Sundaram"
              value={name}
              disabled={isSubmitting}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:text-slate-500`}
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. maya.s@kalpanaaa.com"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-400 focus:ring-red-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              } disabled:bg-slate-50 disabled:text-slate-500`}
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Department & Role Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Department</label>
              <select
                value={department}
                disabled={isSubmitting}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              >
                {DEPARTMENTS.filter((d) => d.key !== 'All').map((dept) => (
                  <option key={dept.key} value={dept.key}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Cloud Engineer"
                value={role}
                disabled={isSubmitting}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.role
                    ? 'border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                } disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {errors.role && <p className="text-[11px] text-red-500 mt-1">{errors.role}</p>}
            </div>
          </div>

          {/* Monthly CTC & Joining Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Monthly CTC (Gé¦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={monthlyCtc}
                disabled={isSubmitting}
                onChange={(e) => {
                  setMonthlyCtc(e.target.value);
                  if (errors.monthlyCtc) setErrors((prev) => ({ ...prev, monthlyCtc: '' }));
                }}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.monthlyCtc
                    ? 'border-red-400 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                } disabled:bg-slate-50 disabled:text-slate-500`}
              />
              {errors.monthlyCtc && (
                <p className="text-[11px] text-red-500 mt-1">{errors.monthlyCtc}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={joiningDate}
                disabled={isSubmitting}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Employment Status</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === 'Active'}
                  disabled={isSubmitting}
                  onChange={() => setStatus('Active')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Active Employee</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="radio"
                  name="status"
                  value="On Notice"
                  checked={status === 'On Notice'}
                  disabled={isSubmitting}
                  onChange={() => setStatus('On Notice')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>On Notice Period</span>
              </label>
            </div>
          </div>

          </div>

          {/* Actions / Sticky Footer */}
          <div className="sticky bottom-0 z-20 px-6 py-4 bg-slate-50/90 border-t border-[#E2E8F0] flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RotateCw size={15} className="animate-spin" />
                  <span>Saving Employee...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Save Employee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
