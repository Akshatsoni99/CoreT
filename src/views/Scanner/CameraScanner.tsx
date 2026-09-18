import { X, Zap, Image as ImageIcon, RefreshCcw, Camera, AlertCircle } from 'lucide-react';
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
  const [cameraError, setCameraError] = useState<string>('');

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
      setCameraError('');
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.warn("Camera access with constraints failed, trying basic video:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallbackStream;
        setHasPermission(true);
        setCameraError('');
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (finalErr: any) {
        console.error("Camera access denied or unavailable:", finalErr);
        setHasPermission(false);
        setCameraError(finalErr?.message || 'Camera is unavailable or permission was denied.');
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

  // Capture current frame from video onto canvas — NEVER fake data
  const handleCapture = () => {
    if (isCapturing) return;
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

    // If video is not active, prompt to upload an image from gallery
    setIsCapturing(false);
    fileInputRef.current?.click();
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
            <h3 className="font-bold text-lg mb-2">Camera Unavailable</h3>
            <p className="text-gray-400 text-xs mb-6 max-w-xs leading-relaxed">
              {cameraError || "Please allow camera permissions or upload an image directly from your device."}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-[#004B87] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <ImageIcon size={16} /> Upload Image from Device
              </button>
              <button
                onClick={() => startCamera(facingMode)}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <RefreshCcw size={14} /> Retry Camera
              </button>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Camera Guidance Overlay Overlay Frame */}
      {hasPermission && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 pt-16 pb-32">
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Align document inside frame</span>
          </div>

          {/* Document Framing Box */}
          <div className="w-full max-w-xs h-[55%] border-2 border-dashed border-white/60 rounded-3xl relative flex items-center justify-center">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl"></div>
          </div>

          <div className="text-[11px] text-white/80 bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-sm text-center">
            Make sure text is readable & well-lit
          </div>
        </div>
      )}

      {/* Top Controls */}
      <header className="absolute top-0 inset-x-0 p-4 pt-12 flex justify-between items-center z-10">
        <button 
          onClick={onBack} 
          className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60"
        >
          <X size={20} />
        </button>

        <div className="flex gap-2">
          <button 
            onClick={toggleTorch} 
            className={`p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-colors ${
              torchOn ? 'bg-amber-400 text-black' : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title="Toggle Flash"
          >
            <Zap size={20} />
          </button>
          <button 
            onClick={toggleCamera} 
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60"
            title="Switch Camera"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      {/* Bottom Shutter Controls */}
      <div className="absolute bottom-0 inset-x-0 p-6 pb-10 flex items-center justify-around z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="p-3.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 transition-all"
          title="Upload from Device"
        >
          <ImageIcon size={22} />
        </button>

        {/* Shutter Button */}
        <button 
          onClick={handleCapture} 
          disabled={isCapturing}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1 group active:scale-95 transition-all"
        >
          <div className="w-full h-full rounded-full bg-white group-hover:bg-gray-200 transition-colors shadow-lg"></div>
        </button>

        <div className="w-12"></div>
      </div>
    </div>
  );
}
