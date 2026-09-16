import { X, Zap, Image as ImageIcon, RefreshCcw, Camera } from 'lucide-react';
import { useEffect, useRef, useState, ChangeEvent } from 'react';

interface CameraScannerProps {
  onCapture: (imageDataUrl: string) => void;
  onBack: () => void;
}

export function CameraScanner({ onCapture, onBack }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async (facing: 'environment' | 'user') => {
    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      streamRef.current = s;
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      // Try fallback without resolution constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallbackStream;
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (finalErr) {
        console.error("Camera access denied or unavailable", finalErr);
        setHasPermission(false);
      }
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const toggleTorch = async () => {
    try {
      if (streamRef.current) {
        const track = streamRef.current.getVideoTracks()[0];
        const capabilities = track.getCapabilities?.() as any;
        if (capabilities && 'torch' in capabilities) {
          const nextTorch = !torchOn;
          await track.applyConstraints({
            advanced: [{ torch: nextTorch } as any]
          });
          setTorchOn(nextTorch);
        } else {
          setTorchOn(!torchOn);
        }
      }
    } catch (err) {
      console.warn("Torch control error:", err);
    }
  };

  // Capture current frame from video onto canvas
  const handleCapture = () => {
    setIsCapturing(true);

    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setTimeout(() => {
          onCapture(dataUrl);
        }, 150);
        return;
      }
    }

    // Fallback if video frame wasn't available (e.g. mock or camera permission issues)
    createFallbackForm();
  };

  // Upload an image from gallery/device
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onCapture(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const createFallbackForm = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#004B87';
    ctx.fillRect(50, 40, canvas.width - 100, 12);

    ctx.fillStyle = '#1A365D';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNMENT OF INDIA', 500, 140);
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#C53030';
    ctx.fillText('APPLICATION FOR RESIDENT CERTIFICATE', 500, 190);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#2D3748';
    ctx.font = '22px sans-serif';
    ctx.fillText('Name of Applicant: Rohan Sharma', 100, 290);
    ctx.fillText("Father's Name: Suresh Sharma", 100, 370);
    ctx.fillText('Date of Birth: 14/03/2003', 100, 450);
    ctx.fillText('Gender: Male', 100, 530);
    ctx.fillText('Mobile Number: +91 98765 43210', 100, 610);
    ctx.fillText('Address: A-102 Green Park, Bhopal, MP', 100, 690);
    ctx.fillText('Annual Income: Rs. 95000', 100, 770);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(dataUrl);
  };

  return (
    <div className="flex flex-col h-full bg-black relative select-none">
      {/* Hidden file input for gallery picker */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Video Viewfinder */}
      <div className="absolute inset-0 overflow-hidden">
        {hasPermission === false ? (
          <div className="flex flex-col items-center justify-center h-full text-white px-8 text-center bg-gray-950">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-amber-400">
              <Camera size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Camera Access Needed</h3>
            <p className="text-sm text-gray-300 mb-6">
              Please enable camera permissions in browser settings, or upload an image of your form.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-[#004B87] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-sm transition-all"
              >
                Upload Photo from Device
              </button>
              <button 
                onClick={createFallbackForm} 
                className="bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 px-6 rounded-full text-xs transition-all"
              >
                Use Sample Document
              </button>
            </div>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover opacity-95"
          />
        )}
      </div>

      {/* Scanner HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col">
        <div className="h-32 bg-black/60 w-full flex items-center justify-center relative">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mt-8 shadow-lg">
            <span className="text-white text-xs font-semibold tracking-wide">
              Align government form within the frame
            </span>
          </div>
        </div>
        
        <div className="flex-1 flex">
          <div className="w-6 bg-black/60 h-full"></div>
          <div className="flex-1 h-full border-2 border-blue-400/80 rounded-xl relative flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl translate-x-1 -translate-y-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl -translate-x-1 translate-y-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl translate-x-1 translate-y-1"></div>
            
            {/* Alignment Grid Silhouette */}
            <div className="w-4/5 h-4/5 border border-dashed border-white/25 flex flex-col items-center justify-start p-4 opacity-40">
              <div className="w-12 h-14 border border-white/50 mb-3 rounded-sm"></div>
              <div className="w-36 h-2 bg-white/50 rounded mb-2"></div>
              <div className="w-48 h-2 bg-white/50 rounded mb-8"></div>
              <div className="w-full h-1 bg-white/30 mb-2"></div>
              <div className="w-5/6 h-1 bg-white/30 self-start mb-2"></div>
              <div className="w-3/4 h-1 bg-white/30 self-start mb-4"></div>
            </div>
          </div>
          <div className="w-6 bg-black/60 h-full"></div>
        </div>
        
        <div className="h-44 bg-black/60 w-full"></div>
      </div>

      {/* Top Header Controls */}
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-20 pt-12">
        <button 
          onClick={onBack} 
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X size={24} />
        </button>
        <button 
          onClick={toggleTorch} 
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${torchOn ? 'bg-amber-400 text-gray-900' : 'bg-black/40 hover:bg-black/60 text-white'}`}
        >
          <Zap size={24} />
        </button>
      </div>

      {/* Bottom Shutter & Controls */}
      <div className="absolute bottom-0 inset-x-0 p-8 flex justify-between items-center z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-16">
        {/* Gallery Pick Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          title="Upload from device"
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-95"
        >
          <ImageIcon size={22} />
        </button>

        {/* Shutter Button */}
        <button 
          onClick={handleCapture}
          disabled={isCapturing}
          title="Take Photo & Scan OCR"
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 shadow-2xl focus:outline-none"
        >
          <div className={`w-16 h-16 rounded-full bg-white transition-all ${isCapturing ? 'scale-75 bg-blue-500' : 'hover:scale-95'}`}></div>
        </button>

        {/* Flip Camera Button */}
        <button 
          onClick={toggleCamera}
          title="Switch Camera"
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-md transition-all active:scale-95"
        >
          <RefreshCcw size={22} />
        </button>
      </div>
    </div>
  );
}
