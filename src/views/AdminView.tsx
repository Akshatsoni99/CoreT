import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowRightLeft, 
  FileText, 
  Eye, 
  Copy, 
  CheckCheck, 
  X, 
  Download, 
  ChevronRight, 
  RefreshCcw, 
  AlertCircle,
  EyeOff,
  UserCheck,
  Calendar,
  Lock,
  ArrowLeft
} from 'lucide-react';
import AppLogo from '../assets/new-logo.png';
import { 
  getAllBankRecords, 
  subscribeToBankRecords, 
  updateBankRecordStatus, 
  maskAccountNumber, 
  BankFormRecord, 
  FormRecordStatus 
} from '../services/bankAdminStore';

interface AdminViewProps {
  onBackToCitizen: () => void;
}

export function AdminView({ onBackToCitizen }: AdminViewProps) {
  const [records, setRecords] = useState<BankFormRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<BankFormRecord | null>(null);
  const [showFullAccount, setShowFullAccount] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string>('');

  // Subscribe to real-time updates from citizen submissions
  useEffect(() => {
    const unsubscribe = subscribeToBankRecords((updated) => {
      setRecords(updated);
      if (selectedRecord) {
        const found = updated.find(r => r.id === selectedRecord.id);
        if (found) setSelectedRecord(found);
      }
    });
    return unsubscribe;
  }, [selectedRecord?.id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (newStatus: FormRecordStatus) => {
    if (!selectedRecord) return;
    updateBankRecordStatus(selectedRecord.id, newStatus, statusNote || undefined);
    setStatusNote('');
  };

  // Metrics Calculations (Part 26)
  const totalCount = records.length;
  const pendingCount = records.filter(r => r.status === 'READY_FOR_BANK' || r.status === 'USER_COMPLETED').length;
  const completedCount = records.filter(r => r.status === 'COMPLETED' || r.status === 'VERIFIED').length;
  const withdrawals = records.filter(r => r.type === 'withdrawal');
  const deposits = records.filter(r => r.type === 'deposit');
  const transfers = records.filter(r => r.type === 'transfer');

  const totalVolume = records.reduce((sum, r) => {
    const amt = parseFloat((r.amount || '0').replace(/,/g, ''));
    return isNaN(amt) ? sum : sum + amt;
  }, 0);

  // Filtering
  const filteredRecords = records.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchName = r.customerName.toLowerCase().includes(q);
      const matchForm = r.formNumber.toLowerCase().includes(q);
      const matchAcc = r.accountNumber.includes(q);
      if (!matchId && !matchName && !matchForm && !matchAcc) return false;
    }
    return true;
  });

  const getStatusBadge = (status: FormRecordStatus) => {
    switch (status) {
      case 'READY_FOR_BANK':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={12} /> Ready for Counter
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <ShieldCheck size={12} /> Verified by Cashier
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} /> Processed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200">
            <AlertCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return <ArrowDownLeft size={16} className="text-red-600" />;
      case 'deposit':
        return <ArrowUpRight size={16} className="text-emerald-600" />;
      case 'transfer':
        return <ArrowRightLeft size={16} className="text-blue-600" />;
      default:
        return <FileText size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-gray-900 font-sans flex flex-col antialiased">
      {/* Top Operations Header */}
      <header className="bg-[#002D5A] text-white sticky top-0 z-30 shadow-md border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 size={20} className="text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-tight text-base sm:text-lg">CoreT Bank Admin</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
                  Branch Counter Operations
                </span>
              </div>
              <p className="text-[11px] text-blue-200">Financial Verification & Physical Slip Audit Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToCitizen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20"
            >
              <ArrowLeft size={15} /> Switch to Citizen App
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* KPI Metric Overview Cards (Part 26) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Pending Queue</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{pendingCount}</span>
            <span className="text-[10px] text-gray-400">Ready for Counter</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Completed</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">{completedCount}</span>
            <span className="text-[10px] text-gray-400">Verified & Processed</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Withdrawals</span>
            <span className="text-2xl font-black text-[#002D5A] block mt-1">{withdrawals.length}</span>
            <span className="text-[10px] text-gray-400">Cash Outflow</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Deposits</span>
            <span className="text-2xl font-black text-[#002D5A] block mt-1">{deposits.length}</span>
            <span className="text-[10px] text-gray-400">Cash Inflow</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Transfers</span>
            <span className="text-2xl font-black text-[#002D5A] block mt-1">{transfers.length}</span>
            <span className="text-[10px] text-gray-400">NEFT / RTGS</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Volume</span>
            <span className="text-xl font-black text-[#004B87] block mt-1 truncate">₹{totalVolume.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-gray-400">{totalCount} forms total</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Verification ID, Customer, or Account Number..."
                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#004B87] focus:bg-white"
              />
            </div>

            {/* Type Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'All Forms' },
                { id: 'withdrawal', label: 'Withdrawals' },
                { id: 'deposit', label: 'Deposits' },
                { id: 'transfer', label: 'Transfers' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    filterType === tab.id
                      ? 'bg-[#002D5A] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#004B87]"
              >
                <option value="all">All Statuses</option>
                <option value="READY_FOR_BANK">Ready for Counter</option>
                <option value="VERIFIED">Verified</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recent Requests Table (Part 26, 27, 28, 29) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Submitted Bank Forms</h3>
              <p className="text-[11px] text-gray-500">Showing {filteredRecords.length} records submitted by citizens</p>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Building2 size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-700">No bank form submissions found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                When citizens complete a Cash Withdrawal, Cash Deposit, or Bank Transfer in the app, their completed physical slip and Verification ID will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Account Number</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Verification ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredRecords.map((record) => {
                    const isSelected = selectedRecord?.id === record.id;
                    return (
                      <tr 
                        key={record.id}
                        className={`hover:bg-blue-50/40 transition-colors ${isSelected ? 'bg-blue-50/70' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                              {getTypeIcon(record.type)}
                            </div>
                            <span className="font-bold text-gray-900 capitalize">{record.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {record.customerName}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">
                          {maskAccountNumber(record.accountNumber)}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#004B87]">
                          {record.amount ? `₹${Number(record.amount).toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {record.date}
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-gray-200">
                            <span>{record.id}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(record.id);
                              }}
                              className="text-gray-400 hover:text-gray-700"
                              title="Copy Verification ID"
                            >
                              {copiedId === record.id ? <CheckCheck size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(record.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowFullAccount(false);
                            }}
                            className="px-3 py-1.5 bg-[#004B87] hover:bg-blue-800 text-white rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                          >
                            <Eye size={13} /> Inspect & Verify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Record Inspection Detail Drawer / Modal (Part 27, 28, 29) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <header className="px-6 py-4 bg-[#002D5A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                  {getTypeIcon(selectedRecord.type)}
                </div>
                <div>
                  <h3 className="font-black text-base">{selectedRecord.title}</h3>
                  <p className="text-[11px] text-blue-200 font-mono">ID: {selectedRecord.id} • {selectedRecord.formNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Top Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Customer Details</span>
                  <div>
                    <span className="text-xs text-gray-500 block">Name:</span>
                    <span className="text-sm font-bold text-gray-900">{selectedRecord.customerName}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Account Number:</span>
                      <button
                        onClick={() => setShowFullAccount(!showFullAccount)}
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {showFullAccount ? <EyeOff size={11} /> : <Eye size={11} />}
                        {showFullAccount ? 'Mask' : 'Reveal'}
                      </button>
                    </div>
                    <span className="font-mono font-bold text-xs text-gray-900">
                      {showFullAccount ? selectedRecord.accountNumber : maskAccountNumber(selectedRecord.accountNumber)}
                    </span>
                  </div>
                </div>

                {/* Amount & Date Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Transaction Value</span>
                  <div>
                    <span className="text-xs text-gray-500 block">Amount:</span>
                    <span className="text-xl font-black text-[#004B87]">
                      {selectedRecord.amount ? `₹${Number(selectedRecord.amount).toLocaleString('en-IN')}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">In Words:</span>
                    <span className="text-xs font-semibold text-gray-700">{selectedRecord.amountWords || '—'}</span>
                  </div>
                </div>

                {/* Status & Timestamp */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Audit Status</span>
                  <div>
                    <span className="text-xs text-gray-500 block">Current State:</span>
                    <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Submitted At:</span>
                    <span className="text-xs text-gray-700 font-mono">
                      {new Date(selectedRecord.submittedAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Slip Canvas Preview (Part 27, 28, 29, 39) */}
              <div className="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="p-3 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#004B87]" />
                    <span className="text-xs font-bold text-gray-800">
                      Completed Physical Slip Rendered with User Data & Drawn Signature
                    </span>
                  </div>
                  {selectedRecord.completedSlipImageUrl && (
                    <a
                      href={selectedRecord.completedSlipImageUrl}
                      download={`${selectedRecord.type}-slip-${selectedRecord.id}.png`}
                      className="px-2.5 py-1 rounded bg-white border border-gray-300 text-xs font-bold text-[#004B87] hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Download size={13} /> Download Slip PNG
                    </a>
                  )}
                </div>

                <div className="p-4 bg-gray-950 flex items-center justify-center min-h-[220px]">
                  {selectedRecord.completedSlipImageUrl ? (
                    <img
                      src={selectedRecord.completedSlipImageUrl}
                      alt="Completed Physical Slip"
                      className="max-w-full h-auto max-h-[440px] object-contain rounded border border-gray-700 shadow-xl"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">Physical slip preview not available</div>
                  )}
                </div>
              </div>

              {/* Manual Drawn Signature Box */}
              {selectedRecord.signatureDataUrl && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <span className="text-xs font-bold text-gray-700 block mb-2">Captured User Signature Bitmap</span>
                  <div className="w-64 h-24 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center p-2">
                    <img
                      src={selectedRecord.signatureDataUrl}
                      alt="User Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Status Update Action Controls (Part 31) */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#002D5A] uppercase tracking-wider">
                    Bank Officer Action Controls
                  </h4>
                  <span className="text-[11px] text-gray-500">Update status to advance transaction lifecycle</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleStatusChange('VERIFIED')}
                    disabled={selectedRecord.status === 'VERIFIED'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <ShieldCheck size={14} /> Mark Verified by Cashier
                  </button>

                  <button
                    onClick={() => handleStatusChange('COMPLETED')}
                    disabled={selectedRecord.status === 'COMPLETED'}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Complete & Disburse Cash
                  </button>

                  <button
                    onClick={() => handleStatusChange('REJECTED')}
                    disabled={selectedRecord.status === 'REJECTED'}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <AlertCircle size={14} /> Reject / Incorrect Details
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <footer className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg text-xs transition-colors"
              >
                Close Record
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
