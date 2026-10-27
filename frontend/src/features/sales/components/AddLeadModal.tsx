import React, { useState } from 'react';
import { X, Plus, Sparkles, Building2, User, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Lead, LeadSource, ServiceInterest, LeadStage, LeadStatus } from '../types/leads';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Omit<Lead, 'id' | 'leadDate'>) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [source, setSource] = useState<LeadSource>('Website');
  const [serviceInterest, setServiceInterest] = useState<ServiceInterest>('Web Development');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('Mumbai');
  const [ownerId, setOwnerId] = useState('Akshit Ujjain (CEO)');
  const [stage, setStage] = useState<LeadStage>('New');
  const [status, setStatus] = useState<LeadStatus>('Active');
  const [estimatedValue, setEstimatedValue] = useState('₹10,00,000');
  const [nextFollowUp, setNextFollowUp] = useState('20 Mar 2025');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!phone.trim() || phone.trim() === '+91') newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      company,
      contactName,
      email,
      phone,
      source,
      serviceInterest,
      country,
      city,
      ownerId,
      stage,
      status,
      estimatedValue,
      nextFollowUp,
      notes,
    });

    // Reset fields
    setCompany('');
    setContactName('');
    setEmail('');
    setPhone('+91 ');
    setNotes('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Lead</h3>
              <p className="text-xs text-slate-500">Record a new prospective client enquiry into the CRM pipeline</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[78vh] flex flex-col gap-4.5">
          {/* Company & Contact Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Organization <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Acme Innovations Pvt Ltd"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (errors.company) setErrors((prev) => ({ ...prev, company: '' }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.company ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.company && <p className="text-[11px] text-rose-500 mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (errors.contactName) setErrors((prev) => ({ ...prev, contactName: '' }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.contactName ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.contactName && <p className="text-[11px] text-rose-500 mt-1">{errors.contactName}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. contact@acme.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2 bg-white border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Source & Service Interest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Event">Event</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Partner">Partner</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Interest</label>
              <select
                value={serviceInterest}
                onChange={(e) => setServiceInterest(e.target.value as ServiceInterest)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI Solutions">AI Solutions</option>
                <option value="ERP Solution">ERP Solution</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Custom Software">Custom Software</option>
              </select>
            </div>
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Owner, Stage, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Owner</label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Akshit Ujjain (CEO)">Akshit Ujjain (CEO)</option>
                <option value="Rajesh Sharma (Sales VP)">Rajesh Sharma (Sales VP)</option>
                <option value="Ananya Roy (Account Exec)">Ananya Roy (Account Exec)</option>
                <option value="Amit Patel (BDM)">Amit Patel (BDM)</option>
                <option value="Neha Verma (Sales Mgr)">Neha Verma (Sales Mgr)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Follow-up Required">Follow-up Required</option>
                <option value="Converted">Converted</option>
                <option value="Archived">Archived</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Estimated Value & Next Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Deal Value</label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. ₹10,00,000"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Next Follow-up Date</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 20 Mar 2025"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Notes & Project Scope</label>
            <textarea
              rows={3}
              placeholder="Provide context regarding client requirements, tech preferences, or next steps..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={15} />
              <span>Create Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
