import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RotateCcw, 
  Volume2, 
  Eye, 
  Building2, 
  Calendar, 
  FileText, 
  Edit3, 
  CheckCircle2, 
  ArrowRight,
  Maximize2,
  Minimize2,
  ShieldCheck
} from 'lucide-react';

import WithdrawalSlipImg from '../../assets/withdrawal-slip.png';
import DepositSlipImg from '../../assets/deposit-slip.png';
import BankTransferSlipImg from '../../assets/bank-transfer-slip.png';

export type BankServiceType = 'withdrawal' | 'deposit' | 'transfer';

interface BankFormModalProps {
  type: BankServiceType;
  onClose: () => void;
}

// Number to Words in Indian numbering system
function numberToIndianWords(numStr: string): string {
  const num = parseInt(numStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(num) || num <= 0) return '';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n < 20) return units[n];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      str += convertTwoDigits(n);
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  let lakh = Math.floor((num % 10000000) / 100000);
  let thousand = Math.floor((num % 100000) / 1000);
  let remainder = num % 1000;

  let result = '';
  if (crore > 0) result += convertTwoDigits(crore) + ' Crore ';
  if (lakh > 0) result += convertTwoDigits(lakh) + ' Lakh ';
  if (thousand > 0) result += convertTwoDigits(thousand) + ' Thousand ';
  if (remainder > 0) result += convertThreeDigits(remainder);

  return result.trim() ? result.trim() + ' Rupees Only' : '';
}

function getTodayFormatted(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function BankFormModal({ type, onClose }: BankFormModalProps) {
  // Config per form type
  const formConfigs = {
    withdrawal: {
      title: 'Cash Withdrawal Slip',
      slipAsset: WithdrawalSlipImg,
      subtitle: 'Fill this slip to withdraw cash at the bank counter',
      steps: [
        {
          id: 'name',
          title: "Withdrawer's Name",
          label: "Enter your full name",
          placeholder: "e.g. Rohan Sharma",
          helper: "As written in your bank passbook",
          raahaTip: {
            en: "Enter the account holder's full name as printed on your passbook.",
            hi: "पासबुक में लिखा हुआ अपना पूरा नाम दर्ज करें।"
          },
          highlight: { top: '50%', left: '50%', width: '46%', height: '8%' },
          fieldKey: 'name'
        },
        {
          id: 'date',
          title: "Date",
          label: "Date of withdrawal",
          placeholder: "DD/MM/YYYY",
          helper: "Withdrawal slip is valid for today's date",
          raahaTip: {
            en: "Today's date is entered here for counter verification.",
            hi: "आज की तारीख दर्ज करें, पर्ची उसी दिन के लिए मान्य होती है।"
          },
          highlight: { top: '22%', left: '74%', width: '23%', height: '8%' },
          fieldKey: 'date'
        },
        {
          id: 'accountNumber',
          title: "Account Number",
          label: "Your 15-digit bank account number",
          placeholder: "Enter 15-digit account number",
          helper: "Found on the front page of your passbook",
          raahaTip: {
            en: "Enter your 15-digit account number. Double check each number.",
            hi: "अपनी पासबुक से देखकर 15 अंकों का खाता नंबर सही-सही भरें।"
          },
          highlight: { top: '47%', left: '5%', width: '45%', height: '11%' },
          fieldKey: 'accountNumber'
        },
        {
          id: 'amount',
          title: "Amount in Numbers",
          label: "Cash to withdraw",
          placeholder: "₹ Enter amount",
          helper: "e.g. ₹5,000",
          raahaTip: {
            en: "Enter the exact amount of cash you want to withdraw.",
            hi: "जितने पैसे निकालने हैं, वह राशि अंकों में दर्ज करें।"
          },
          highlight: { top: '32%', left: '75%', width: '22%', height: '10%' },
          fieldKey: 'amount'
        },
        {
          id: 'amountWords',
          title: "Amount in Words",
          label: "Amount written in words",
          placeholder: "e.g. Five Thousand Rupees Only",
          helper: "Always finish with 'Only'",
          raahaTip: {
            en: "We have auto-converted your amount into words. Check and confirm.",
            hi: "हमने राशि को शब्दों में बदल दिया है, एक बार जांच लें।"
          },
          highlight: { top: '29%', left: '27%', width: '45%', height: '8%' },
          fieldKey: 'amountWords'
        },
        {
          id: 'signature',
          title: "Signature",
          label: "Account holder's signature",
          placeholder: "Sign below",
          helper: "Must match your bank records",
          raahaTip: {
            en: "Draw your signature in the box or confirm using your saved profile.",
            hi: "नीचे बॉक्स में अपने हस्ताक्षर करें जो बैंक रिकॉर्ड से मिलते हों।"
          },
          highlight: { top: '48%', left: '50%', width: '25%', height: '6%' },
          fieldKey: 'signature'
        }
      ]
    },
    deposit: {
      title: 'Cash Deposit Slip',
      slipAsset: DepositSlipImg,
      subtitle: 'Fill this slip to deposit cash or cheques into an account',
      steps: [
        {
          id: 'branch',
          title: "Branch Name",
          label: "Bank branch name",
          placeholder: "e.g. Main Branch, Bhopal",
          helper: "The branch where you are depositing",
          raahaTip: {
            en: "Enter the branch name of the bank where you are depositing.",
            hi: "जिस बैंक शाखा में जमा कर रहे हैं, उसका नाम लिखें।"
          },
          highlight: { top: '15%', left: '79%', width: '18%', height: '6%' },
          fieldKey: 'branch'
        },
        {
          id: 'accountNumber',
          title: "Account Number",
          label: "Account number to deposit into",
          placeholder: "Enter 15-digit account number",
          helper: "Double check the account number to avoid wrong deposit",
          raahaTip: {
            en: "Enter the 15-digit bank account number where money should go.",
            hi: "जिस खाते में पैसे जमा करने हैं, उसका 15 अंकों का खाता नंबर लिखें।"
          },
          highlight: { top: '22%', left: '54%', width: '44%', height: '7%' },
          fieldKey: 'accountNumber'
        },
        {
          id: 'name',
          title: "Account Holder / Depositor Name",
          label: "Name of the account holder",
          placeholder: "e.g. Rohan Sharma",
          helper: "Name of the person who owns the account",
          raahaTip: {
            en: "Write the account holder's name clearly in capital letters.",
            hi: "खाताधारक का नाम साफ अक्षरों में लिखें।"
          },
          highlight: { top: '31%', left: '57%', width: '40%', height: '6%' },
          fieldKey: 'name'
        },
        {
          id: 'mobileNumber',
          title: "Mobile Number",
          label: "Contact mobile number",
          placeholder: "10-digit mobile number",
          helper: "For SMS deposit confirmation",
          raahaTip: {
            en: "Provide your mobile number to receive instant SMS confirmation.",
            hi: "जमा की पुष्टि के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें।"
          },
          highlight: { top: '37%', left: '60%', width: '24%', height: '6%' },
          fieldKey: 'mobileNumber'
        },
        {
          id: 'amount',
          title: "Deposit Amount",
          label: "Total cash amount to deposit",
          placeholder: "₹ Enter amount",
          helper: "PAN card is required if depositing ₹50,000 or more",
          raahaTip: {
            en: "Enter the total amount in numbers. If ₹50,000 or more, PAN is needed.",
            hi: "जमा की जाने वाली कुल राशि लिखें। 50,000 से अधिक पर पैन कार्ड चाहिए।"
          },
          highlight: { top: '47%', left: '84%', width: '14%', height: '6%' },
          fieldKey: 'amount'
        },
        {
          id: 'amountWords',
          title: "Amount in Words",
          label: "Deposit amount in words",
          placeholder: "e.g. Ten Thousand Rupees Only",
          helper: "Always conclude with 'Only'",
          raahaTip: {
            en: "Write the amount in words to prevent alteration.",
            hi: "रुपये शब्दों में लिखें और अंत में 'Only' अवश्य लिखें।"
          },
          highlight: { top: '43%', left: '58%', width: '40%', height: '6%' },
          fieldKey: 'amountWords'
        },
        {
          id: 'date',
          title: "Deposit Date",
          label: "Date of cash deposit",
          placeholder: "DD/MM/YYYY",
          helper: "Today's deposit date",
          raahaTip: {
            en: "Today's date is entered in the date boxes on the top right.",
            hi: "ऊपर दायें कोने में आज की तारीख दर्ज करें।"
          },
          highlight: { top: '8%', left: '84%', width: '14%', height: '6%' },
          fieldKey: 'date'
        },
        {
          id: 'signature',
          title: "Depositor's Signature",
          label: "Signature of person depositing",
          placeholder: "Sign below",
          helper: "Signature of the person handing over the cash",
          raahaTip: {
            en: "Signature of the depositor at the bottom right corner.",
            hi: "पर्ची के नीचे दायें कोने में जमाकर्ता के हस्ताक्षर करें।"
          },
          highlight: { top: '78%', left: '85%', width: '13%', height: '7%' },
          fieldKey: 'signature'
        }
      ]
    },
    transfer: {
      title: 'Bank Transfer Slip (NEFT / RTGS)',
      slipAsset: BankTransferSlipImg,
      subtitle: 'Send money safely from your account to any bank account',
      steps: [
        {
          id: 'date',
          title: "Date",
          label: "Application date",
          placeholder: "DD/MM/YYYY",
          helper: "Today's date",
          raahaTip: {
            en: "Enter today's date on the transfer slip.",
            hi: "ट्रांसफर फॉर्म पर आज की तारीख दर्ज करें।"
          },
          highlight: { top: '4%', left: '77%', width: '21%', height: '4%' },
          fieldKey: 'date'
        },
        {
          id: 'senderName',
          title: "Sender / Applicant Name",
          label: "Your full name",
          placeholder: "e.g. Rohan Sharma",
          helper: "Account holder sending the money",
          raahaTip: {
            en: "Enter your name as registered in the sending bank account.",
            hi: "पैसे भेजने वाले का नाम (आपका नाम) यहाँ लिखें।"
          },
          highlight: { top: '28%', left: '19%', width: '76%', height: '3%' },
          fieldKey: 'senderName'
        },
        {
          id: 'senderAccount',
          title: "Sender's Account Number",
          label: "Your bank account number",
          placeholder: "Account number to debit from",
          helper: "Money will be deducted from this account",
          raahaTip: {
            en: "Enter the account number from which money will be debited.",
            hi: "जिस खाते से पैसे कटेंगे, उसका खाता नंबर दर्ज करें।"
          },
          highlight: { top: '23%', left: '22%', width: '42%', height: '3%' },
          fieldKey: 'senderAccount'
        },
        {
          id: 'amount',
          title: "Transfer Amount",
          label: "Amount to transfer",
          placeholder: "₹ Enter amount",
          helper: "NEFT/RTGS transfer amount",
          raahaTip: {
            en: "Enter the exact amount to be remitted to the beneficiary.",
            hi: "जितनी राशि ट्रांसफर करनी है, वह यहाँ दर्ज करें।"
          },
          highlight: { top: '13%', left: '33%', width: '13%', height: '3%' },
          fieldKey: 'amount'
        },
        {
          id: 'amountWords',
          title: "Amount in Words",
          label: "Transfer amount in words",
          placeholder: "e.g. Twenty Five Thousand Rupees Only",
          helper: "End with 'Only'",
          raahaTip: {
            en: "Verify the transfer amount spelled out in words.",
            hi: "राशि को शब्दों में लिखा गया है, कृपया जांच लें।"
          },
          highlight: { top: '13%', left: '56%', width: '38%', height: '3%' },
          fieldKey: 'amountWords'
        },
        {
          id: 'beneficiaryName',
          title: "Beneficiary (Receiver) Name",
          label: "Recipient's full name",
          placeholder: "e.g. Priya Patel",
          helper: "Name must match receiver's bank account",
          raahaTip: {
            en: "Enter the exact name of the person or entity receiving the money.",
            hi: "जिस व्यक्ति को पैसे भेज रहे हैं, उनका नाम सही लिखें।"
          },
          highlight: { top: '39%', left: '19%', width: '76%', height: '3%' },
          fieldKey: 'beneficiaryName'
        },
        {
          id: 'beneficiaryAccount',
          title: "Beneficiary Account Number",
          label: "Receiver's bank account number",
          placeholder: "Enter receiver's account number",
          helper: "Double check each digit carefully",
          raahaTip: {
            en: "Bank transfers are routed strictly by account number. Verify twice!",
            hi: "खाता नंबर बिल्कुल सही भरें क्योंकि ट्रांसफर इसी नंबर पर होता है।"
          },
          highlight: { top: '42%', left: '22%', width: '42%', height: '3%' },
          fieldKey: 'beneficiaryAccount'
        },
        {
          id: 'bankName',
          title: "Beneficiary Bank & Branch",
          label: "Receiver's bank name",
          placeholder: "e.g. State Bank of India, Indore",
          helper: "Name of receiver's bank",
          raahaTip: {
            en: "Enter the bank name and city/branch of the beneficiary.",
            hi: "सामने वाले के बैंक का नाम और शाखा लिखें।"
          },
          highlight: { top: '45%', left: '19%', width: '76%', height: '3%' },
          fieldKey: 'bankName'
        },
        {
          id: 'ifscCode',
          title: "IFSC Code",
          label: "11-character IFSC code",
          placeholder: "e.g. SBIN0001234",
          helper: "Found on receiver's passbook or cheque leaf",
          raahaTip: {
            en: "IFSC is the unique 11-digit code identifying the destination branch.",
            hi: "IFSC कोड 11 अक्षरों का होता है जो पासबुक या चेक पर छपा होता है।"
          },
          highlight: { top: '48%', left: '22%', width: '29%', height: '3%' },
          fieldKey: 'ifscCode'
        },
        {
          id: 'mobileNumber',
          title: "Sender's Mobile Number",
          label: "Your mobile number",
          placeholder: "10-digit mobile number",
          helper: "For transaction UTR / reference SMS",
          raahaTip: {
            en: "Your mobile number is needed to send the transfer UTR number.",
            hi: "ट्रांसफर की UTR रसीद SMS पाने के लिए अपना फोन नंबर लिखें।"
          },
          highlight: { top: '34%', left: '22%', width: '27%', height: '3%' },
          fieldKey: 'mobileNumber'
        },
        {
          id: 'signature',
          title: "Applicant's Signature",
          label: "Signature of primary applicant",
          placeholder: "Sign below",
          helper: "Authorizes the bank to debit your account",
          raahaTip: {
            en: "Sign in the primary applicant box at the bottom of the form.",
            hi: "फॉर्म के नीचे प्राथमिक आवेदक के हस्ताक्षर वाले बॉक्स में साइन करें।"
          },
          highlight: { top: '78%', left: '2%', width: '30%', height: '6%' },
          fieldKey: 'signature'
        }
      ]
    }
  };

  const currentConfig = formConfigs[type];
  const steps = currentConfig.steps;

  // View mode: 'wizard' | 'review' | 'success' | 'view_completed_slip'
  const [viewMode, setViewMode] = useState<'wizard' | 'review' | 'success' | 'view_completed_slip'>('wizard');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSlipExpanded, setIsSlipExpanded] = useState(false);
  const [raahaLang, setRaahaLang] = useState<'en' | 'hi'>('en');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Record<string, string>>({
    name: 'Rohan Sharma',
    date: getTodayFormatted(),
    accountNumber: '501004928172910',
    amount: '10000',
    amountWords: 'Ten Thousand Rupees Only',
    signature: 'Rohan Sharma',
    branch: 'Main Market Branch',
    mobileNumber: '9876543210',
    senderName: 'Rohan Sharma',
    senderAccount: '501004928172910',
    beneficiaryName: 'Priya Patel',
    beneficiaryAccount: '308912401849',
    bankName: 'State Bank of India',
    ifscCode: 'SBIN0001234'
  });

  const [signatureDrawn, setSignatureDrawn] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const currentStep = steps[currentStepIndex];

  // Auto-update amount in words when amount changes
  const handleAmountChange = (val: string) => {
    const rawNumber = val.replace(/[^0-9]/g, '');
    const words = numberToIndianWords(rawNumber);
    setFormData(prev => ({
      ...prev,
      amount: rawNumber,
      amountWords: words || prev.amountWords
    }));
  };

  // Canvas drawing handlers for signature
  const startDrawing = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setSignatureDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#002D5A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignatureDrawn(false);
    setFormData(prev => ({ ...prev, signature: '' }));
  };

  const adoptSavedSignature = () => {
    setSignatureDrawn(true);
    setFormData(prev => ({ ...prev, signature: 'Rohan Sharma (e-Signed)' }));
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'italic 28px "Caveat", cursive, sans-serif';
        ctx.fillStyle = '#002D5A';
        ctx.fillText('Rohan Sharma', 40, 60);
      }
    }
  };

  // Voice narration simulation
  const triggerVoiceTip = () => {
    setIsVoiceSpeaking(true);
    setTimeout(() => {
      setIsVoiceSpeaking(false);
    }, 2500);
  };

  // Next / Back navigation
  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setViewMode('review');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onClose();
    }
  };

  // Render Step Input Field
  const renderStepInput = () => {
    const fieldKey = currentStep.fieldKey;
    const value = formData[fieldKey] || '';

    if (currentStep.id === 'signature') {
      return (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Draw your signature in the box below, or click to adopt your verified citizen signature.
            </p>
          </div>

          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 overflow-hidden touch-none h-36 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
            {!signatureDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                <Edit3 size={24} className="mb-1" />
                <span className="text-xs font-medium">Sign here with finger or mouse</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearSignature}
              className="flex-1 py-2 px-3 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={14} /> Clear
            </button>
            <button
              type="button"
              onClick={adoptSavedSignature}
              className="flex-1 py-2 px-3 bg-blue-50 text-[#004B87] border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={14} /> Use Saved Signature
            </button>
          </div>
        </div>
      );
    }

    if (currentStep.id === 'amount') {
      const quickAmounts = [1000, 2000, 5000, 10000, 25000];
      return (
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-700">₹</span>
            <input
              type="text"
              value={value ? Number(value).toLocaleString('en-IN') : ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="w-full bg-white border-2 border-[#004B87]/30 focus:border-[#004B87] rounded-2xl py-4 pl-12 pr-4 text-2xl font-extrabold text-[#002D5A] focus:outline-none shadow-sm transition-all"
              autoFocus
            />
          </div>

          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Quick Pick Amounts</span>
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountChange(String(amt))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    value === String(amt)
                      ? 'bg-[#004B87] text-white border-[#004B87] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {formData.amountWords && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">In Words</span>
              <p className="text-xs font-semibold text-gray-900 mt-0.5">{formData.amountWords}</p>
            </div>
          )}
        </div>
      );
    }

    if (currentStep.id === 'date') {
      return (
        <div className="space-y-3">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={value}
              onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
              placeholder={currentStep.placeholder}
              className="w-full bg-white border-2 border-gray-200 focus:border-[#004B87] rounded-2xl py-3.5 pl-12 pr-4 text-base font-bold text-gray-900 focus:outline-none transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, [fieldKey]: getTodayFormatted() })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004B87] bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Calendar size={14} /> Set Today ({getTodayFormatted()})
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
          placeholder={currentStep.placeholder}
          className="w-full bg-white border-2 border-gray-200 focus:border-[#004B87] rounded-2xl py-3.5 px-4 text-base font-bold text-gray-900 focus:outline-none transition-all shadow-sm"
          autoFocus
        />
        {currentStep.id === 'accountNumber' && (
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] text-gray-400">Standard 15-digit bank account format</span>
            <span className="text-[11px] font-bold text-blue-600">{value.length}/15 digits</span>
          </div>
        )}
      </div>
    );
  };

  // Review Screen Component
  const renderReviewScreen = () => {
    return (
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Header */}
        <header className="px-5 pt-12 pb-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setViewMode('wizard')} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900">Review Form Details</h2>
            <p className="text-[11px] text-gray-500">{currentConfig.title}</p>
          </div>
          <div className="w-8" />
        </header>

        {/* Scrollable Summary */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Form Ready for Bank Counter</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
                Please verify the details below. Once confirmed, you can present this completed digital slip directly to the cashier.
              </p>
            </div>
          </div>

          {/* Form Details Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {steps.map((step, idx) => {
              const val = formData[step.fieldKey];
              const isAmount = step.id === 'amount';
              return (
                <div key={step.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50/80 transition-colors">
                  <div className="flex-1 pr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      {step.title}
                    </span>
                    <span className={`block mt-0.5 font-bold ${isAmount ? 'text-lg text-[#004B87]' : 'text-sm text-gray-900'}`}>
                      {isAmount ? `₹${Number(val || 0).toLocaleString('en-IN')}` : (val || '—')}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setViewMode('wizard');
                    }}
                    className="p-2 text-[#004B87] hover:bg-blue-50 rounded-xl transition-colors shrink-0"
                    title="Edit this field"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Context Notice */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-[11px] text-gray-500 leading-relaxed text-center">
            🔒 Bank form data is kept securely on your device. No financial transaction occurs until verified at the branch counter.
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 inset-x-0 z-20 flex gap-3">
          <button
            onClick={() => setViewMode('wizard')}
            className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setViewMode('success')}
            className="flex-[2] py-3.5 bg-[#004B87] hover:bg-blue-800 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-[#004B87]/30 flex items-center justify-center gap-2 active:scale-95"
          >
            Confirm & Complete <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Success Screen Component
  const renderSuccessScreen = () => {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-6 text-center animate-in fade-in duration-300 relative">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 animate-in zoom-in-50 duration-300">
          <Check size={44} strokeWidth={3} />
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Form Completed
        </h2>

        <p className="text-base font-semibold text-[#004B87] mb-6">
          "Your form is ready."
        </p>

        <div className="w-full max-w-sm bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#004B87] flex items-center justify-center mx-auto mb-3">
            <Building2 size={22} />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">Next Step</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Please show this completed form at the <strong>bank counter</strong> to deposit or withdraw your cash.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={onClose}
            className="w-full py-4 bg-[#004B87] hover:bg-blue-800 text-white font-bold rounded-full text-base transition-all shadow-lg shadow-[#004B87]/30 active:scale-95"
          >
            Done
          </button>
          
          <button
            onClick={() => setViewMode('view_completed_slip')}
            className="w-full py-3.5 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} className="text-[#004B87]" /> View Form
          </button>
        </div>
      </div>
    );
  };

  // Completed Slip Preview Component
  const renderCompletedSlipView = () => {
    return (
      <div className="flex flex-col h-full bg-gray-900 text-white">
        <header className="px-4 pt-12 pb-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
          <button onClick={() => setViewMode('success')} className="p-2 text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h3 className="font-bold text-sm text-white">Completed {currentConfig.title}</h3>
            <p className="text-[10px] text-gray-400">Show to Bank Cashier</p>
          </div>
          <button onClick={onClose} className="p-2 text-white">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <img 
              src={currentConfig.slipAsset} 
              alt={currentConfig.title}
              className="w-full h-auto object-contain block"
            />
          </div>

          <div className="mt-6 bg-gray-800 border border-gray-700 rounded-2xl p-4 w-full max-w-md text-left">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Verified Slip Details</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Name:</span>
                <span className="font-bold text-white">{formData.name || formData.senderName}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Account No:</span>
                <span className="font-bold text-white">{formData.accountNumber || formData.senderAccount}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Amount:</span>
                <span className="font-bold text-emerald-400">₹{Number(formData.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Date:</span>
                <span className="font-bold text-white">{formData.date}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#004B87] hover:bg-blue-700 text-white font-bold rounded-full text-sm"
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  // Main Wizard View
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-screen sm:h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        {viewMode === 'review' && renderReviewScreen()}
        {viewMode === 'success' && renderSuccessScreen()}
        {viewMode === 'view_completed_slip' && renderCompletedSlipView()}

        {viewMode === 'wizard' && (
          <div className="flex flex-col h-full bg-[#F9FAFB]">
            {/* Header */}
            <header className="px-4 pt-12 pb-3 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
              <button onClick={handleBack} className="p-2 -ml-2 text-gray-900">
                <ChevronLeft size={24} />
              </button>
              
              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#004B87]">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                  {currentConfig.title}
                </h1>
              </div>

              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-1.5">
              <div 
                className="bg-[#004B87] h-1.5 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28">
              
              {/* Slip Visual Reference Card with Target Highlight */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-2.5 bg-gray-50 border-b border-gray-200/80 flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <FileText size={14} className="text-[#004B87]" /> Official Blank Bank Slip
                  </span>
                  <button 
                    onClick={() => setIsSlipExpanded(!isSlipExpanded)}
                    className="text-[#004B87] hover:underline flex items-center gap-1 text-[11px] font-bold"
                  >
                    {isSlipExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    {isSlipExpanded ? 'Collapse' : 'Full Slip'}
                  </button>
                </div>

                <div className={`relative overflow-hidden bg-gray-100 transition-all ${isSlipExpanded ? 'h-72' : 'h-36'}`}>
                  <img 
                    src={currentConfig.slipAsset} 
                    alt={currentConfig.title}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  
                  {/* Dynamic pulsing highlight box indicating current field on the paper slip */}
                  {currentStep.highlight && (
                    <div 
                      className="absolute border-2 border-red-500 bg-red-500/20 rounded shadow-lg animate-pulse transition-all duration-300 pointer-events-none flex items-center justify-center"
                      style={{
                        top: currentStep.highlight.top,
                        left: currentStep.highlight.left,
                        width: currentStep.highlight.width,
                        height: currentStep.highlight.height
                      }}
                    >
                      <span className="bg-red-600 text-white text-[9px] font-bold px-1 rounded shadow-sm scale-90">
                        Here
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2 text-center text-[10px] text-gray-500 bg-white">
                  📍 Red highlight shows where <strong>{currentStep.title}</strong> is located on the bank paper.
                </div>
              </div>

              {/* RAAHA Guidance Box */}
              <div className="bg-white border-2 border-blue-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#004B87] text-white flex items-center justify-center font-bold text-[10px]">
                      R
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 text-xs">RAAHA Banking Guide</span>
                      <span className="text-[10px] text-gray-500 block -mt-0.5">Your personal companion</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Language switcher between English and Hindi */}
                    <button
                      onClick={() => setRaahaLang(raahaLang === 'en' ? 'hi' : 'en')}
                      className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {raahaLang === 'en' ? 'हिंदी में' : 'In English'}
                    </button>

                    <button
                      onClick={triggerVoiceTip}
                      className={`p-1.5 rounded-full transition-colors ${
                        isVoiceSpeaking 
                          ? 'bg-blue-600 text-white animate-bounce' 
                          : 'bg-blue-50 text-[#004B87] hover:bg-blue-100'
                      }`}
                      title="Listen to RAAHA guidance"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-medium text-gray-700 leading-relaxed">
                  "{currentStep.raahaTip[raahaLang]}"
                </p>
                {isVoiceSpeaking && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-blue-600 animate-pulse">
                    🔊 RAAHA is reading guidance aloud...
                  </span>
                )}
              </div>

              {/* Active Step Input Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {currentStep.label}
                  </label>
                  <span className="text-[11px] text-gray-400 font-medium">Required</span>
                </div>

                {renderStepInput()}

                <p className="text-[11px] text-gray-400 leading-snug">
                  ℹ️ {currentStep.helper}
                </p>
              </div>

            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 inset-x-0 z-20 flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={handleNext}
                className="flex-[2] py-3.5 bg-[#004B87] hover:bg-blue-800 text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-[#004B87]/30 flex items-center justify-center gap-2 active:scale-95"
              >
                {currentStepIndex === steps.length - 1 ? 'Review Slip' : 'Next Step'} <ChevronRight size={18} />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
