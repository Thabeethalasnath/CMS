import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Briefcase,
  CheckCircle2,
  Trash2,
  Save,
  Shield,
} from 'lucide-react';
import { Client, ClientStatus, ClientType, IndustryType } from '../types/clients';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClient: (updated: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  onUpdateClient,
  onDeleteClient,
}) => {
  if (!isOpen || !client) return null;

  const [clientName, setClientName] = useState(client.clientName);
  const [companyName, setCompanyName] = useState(client.companyName);
  const [industry, setIndustry] = useState(client.industry);
  const [contactPerson, setContactPerson] = useState(client.contactPerson);
  const [email, setEmail] = useState(client.email);
  const [phone, setPhone] = useState(client.phone);
  const [country, setCountry] = useState(client.country);
  const [city, setCity] = useState(client.city);
  const [clientType, setClientType] = useState(client.clientType);
  const [accountOwner, setAccountOwner] = useState(client.accountOwner);
  const [status, setStatus] = useState<ClientStatus>(client.status as ClientStatus);
  const [creditLimit, setCreditLimit] = useState(client.creditLimit || '₹ 10,00,000');
  const [notes, setNotes] = useState(client.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (client) {
      setClientName(client.clientName);
      setCompanyName(client.companyName);
      setIndustry(client.industry);
      setContactPerson(client.contactPerson);
      setEmail(client.email);
      setPhone(client.phone);
      setCountry(client.country);
      setCity(client.city);
      setClientType(client.clientType);
      setAccountOwner(client.accountOwner);
      setStatus(client.status as ClientStatus);
      setCreditLimit(client.creditLimit || '₹ 10,00,000');
      setNotes(client.notes || '');
    }
  }, [client]);

  const handleSave = () => {
    const updated: Client = {
      ...client,
      clientName,
      companyName,
      industry,
      contactPerson,
      email,
      phone,
      country,
      city,
      clientType,
      accountOwner,
      status,
      creditLimit,
      notes,
    };
    onUpdateClient(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete client ${client.id} (${client.clientName})?`)) {
      onDeleteClient(client.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm">
              {client.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{client.clientName}</h3>
                <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-200 text-slate-700">
                  {client.clientCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">{client.companyName} • {client.industry}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] flex flex-col gap-5">
          {/* Status and Type bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ClientStatus)}
                  className="h-8 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Client Type
                </label>
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as ClientType)}
                  className="h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="SMB">SMB</option>
                  <option value="Startup">Startup</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Account Owner
                </label>
                <select
                  value={accountOwner}
                  onChange={(e) => setAccountOwner(e.target.value)}
                  className="h-8 px-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Akshit Ujjain">Akshit Ujjain</option>
                  <option value="Rohan Sharma">Rohan Sharma</option>
                  <option value="Priya Patel">Priya Patel</option>
                  <option value="Sneha Reddy">Sneha Reddy</option>
                  <option value="Amit Patel">Amit Patel</option>
                  <option value="Neha Verma">Neha Verma</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Credit Limit
              </label>
              <input
                type="text"
                value={creditLimit}
                onChange={(e) => setCreditLimit(e.target.value)}
                className="h-8 px-2.5 text-xs font-bold text-slate-900 rounded-lg border border-slate-300 bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} className="text-indigo-600" />
                Company Information
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Registered Company</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as IndustryType)}
                  className="w-full h-8 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-indigo-600" />
                Contact & Location
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Primary Contact</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">City, Country</label>
                  <input
                    type="text"
                    value={`${city}, ${country}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      setCity(parts[0]?.trim() || city);
                      if (parts[1]) setCountry(parts[1].trim());
                    }}
                    className="w-full h-8 px-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Notes & SLA Requirements</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/70">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Client</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
