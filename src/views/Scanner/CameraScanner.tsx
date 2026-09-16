import { X, Zap, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CameraScanner({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        stream = s;
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error("Camera access denied", err);
        setHasPermission(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="absolute inset-0 overflow-hidden">
        {hasPermission === false ? (
          <div className="flex items-center justify-center h-full text-white px-6 text-center">
            <p>Camera access denied. Please enable permissions in your browser settings to scan documents.</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover opacity-90"
          />
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none flex flex-col">
        <div className="h-32 bg-black/60 w-full flex items-center justify-center relative">
           <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mt-8">
             <span className="text-white text-sm font-medium">Align the form within the frame</span>
           </div>
        </div>
        
        <div className="flex-1 flex">
          <div className="w-6 bg-black/60 h-full"></div>
          <div className="flex-1 h-full border-2 border-blue-400 rounded-lg relative flex items-center justify-center">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg -translate-x-1 -translate-y-1"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg translate-x-1 -translate-y-1"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg -translate-x-1 translate-y-1"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg translate-x-1 translate-y-1"></div>
            
            <div className="w-3/4 h-3/4 border border-white/20 flex flex-col items-center justify-start p-4 opacity-50">
                <div className="w-12 h-16 border border-white/40 mb-4 rounded-sm"></div>
                <div className="w-32 h-2 bg-white/40 rounded mb-2"></div>
                <div className="w-40 h-2 bg-white/40 rounded mb-8"></div>
                <div className="w-full h-1 bg-white/20 mb-2"></div>
                <div className="w-5/6 h-1 bg-white/20 self-start mb-2"></div>
                <div className="w-3/4 h-1 bg-white/20 self-start mb-4"></div>
            </div>
          </div>
          <div className="w-6 bg-black/60 h-full"></div>
        </div>
        
        <div className="h-40 bg-black/60 w-full"></div>
      </div>

      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-10 pt-12">
        <button onClick={onBack} className="p-2 text-white">
          <X size={28} />
        </button>
        <button className="p-2 text-white">
          <Zap size={28} />
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-8 flex justify-between items-center z-10 bg-gradient-to-t from-black to-transparent pt-20">
        <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
          <ImageIcon size={24} />
        </button>
        <button onClick={onNext} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white"></div>
        </button>
        <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
          <RefreshCcw size={24} />
        </button>
      </div>
    </div>
  );
}
