import { useRef, ChangeEvent } from 'react';
import { ChevronLeft, Camera, Image as ImageIcon, ChevronRight, FileCheck } from 'lucide-react';

interface StartScannerProps {
  onNext: () => void;
  onBack: () => void;
  onImageSelected: (imageDataUrl: string) => void;
}

export function StartScanner({ onNext, onBack, onImageSelected }: StartScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate a sample official government form for instant OCR testing if needed
  const handleUseSampleForm = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Header Border
    ctx.fillStyle = '#004B87';
    ctx.fillRect(40, 40, canvas.width - 80, 16);

    // Header Emblem/Seal Simulation
    ctx.fillStyle = '#004B87';
    ctx.beginPath();
    ctx.arc(600, 130, 45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVT', 600, 138);

    // Title
    ctx.fillStyle = '#002D5A';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF MADHYA PRADESH', 600, 220);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#C53030';
    ctx.fillText('DEPARTMENT OF REVENUE & PUBLIC SERVICES', 600, 270);

    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#1A202C';
    ctx.fillText('APPLICATION FORM FOR INCOME CERTIFICATE', 600, 340);

    // Divider
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, 370);
    ctx.lineTo(canvas.width - 80, 370);
    ctx.stroke();

    // Form Fields
    ctx.textAlign = 'left';
    ctx.fillStyle = '#2D3748';
    ctx.font = 'bold 26px sans-serif';

    const fields = [
      ['1. Full Name of Applicant:', 'Rohan Sharma'],
      ["2. Father's / Guardian's Name:", 'Suresh Sharma'],
      ['3. Date of Birth (DD/MM/YYYY):', '14/03/2003'],
      ['4. Gender (Male/Female):', 'Male'],
      ['5. Mobile Number:', '+91 98765 43210'],
      ['6. Email Address:', 'rohan.sharma@gmail.com'],
      ['7. Permanent Address:', 'A-102 Green Park Society, Bhopal, MP'],
      ['8. Annual Family Income (INR):', 'Rs. 95000 / Year'],
      ['9. Purpose of Certificate:', 'Higher Education Scholarship'],
      ['10. Aadhaar Number:', 'XXXX-XXXX-8921'],
    ];

    let y = 440;
    fields.forEach(([label, value]) => {
      ctx.fillStyle = '#4A5568';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(label, 100, y);

      // Value Box
      ctx.fillStyle = '#F7FAFC';
      ctx.fillRect(100, y + 15, canvas.width - 200, 60);
      ctx.strokeStyle = '#CBD5E0';
      ctx.lineWidth = 2;
      ctx.strokeRect(100, y + 15, canvas.width - 200, 60);

      ctx.fillStyle = '#1A202C';
      ctx.font = '22px sans-serif';
      ctx.fillText(value, 120, y + 54);

      y += 110;
    });

    // Verification Seal Note
    ctx.fillStyle = '#718096';
    ctx.font = 'italic 20px sans-serif';
    ctx.fillText('* Certified true copy under Public Service Guarantee Act 2010', 100, y + 20);

    const sampleDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onImageSelected(sampleDataUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="flex items-center p-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900">
          <ChevronLeft size={24} />
        </button>
      </header>
      
      <div className="p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan a Form</h1>
        <p className="text-gray-500 mb-8">
          Capture or upload a government form to extract fields instantly using on-device AI OCR.
        </p>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*,application/pdf" 
          className="hidden" 
          onChange={handleFileChange} 
        />

        <div className="space-y-4">
          <button 
            onClick={onNext} 
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center text-left hover:border-blue-500 hover:bg-blue-50/50 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-[#004B87] group-hover:text-white transition-colors">
              <Camera size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Use Camera</h3>
              <p className="text-sm text-gray-500">Live camera OCR scanning</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 flex items-center text-left hover:border-green-500 hover:bg-green-50/50 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ImageIcon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Upload from Device</h3>
              <p className="text-sm text-gray-500">Select an image from gallery</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-green-600" />
          </button>

          <button 
            onClick={handleUseSampleForm} 
            className="w-full bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-center text-left hover:bg-amber-100/60 transition-all group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mr-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileCheck size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Try Demo Form</h3>
              <p className="text-sm text-gray-500">Test OCR with sample MP Income Form</p>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-amber-700" />
          </button>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Serverless AI Engine</p>
          <p className="text-sm font-bold text-gray-900 mb-1">Powered by Tesseract.js (Client-Side WASM)</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            All text recognition runs 100% inside your browser. No documents are uploaded to external servers, ensuring maximum privacy and full compatibility with Vercel deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
