"use client";

import React, { useState, useEffect } from 'react';

interface LimitExceededPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LimitExceededPopup({ isOpen, onClose }: LimitExceededPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[600] flex items-center justify-center p-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 backdrop-blur-3xl' : 'opacity-0 backdrop-blur-0'}`}
    >
      {/* Dynamic Background Noise/Texture */}
      <div className="absolute inset-0 bg-white/40 mix-blend-overlay opacity-20 pointer-events-none"
           style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}}>
      </div>

      {/* Soft Light Casting */}
      <div className={`absolute w-[600px] h-[600px] bg-red-100/30 rounded-full blur-[120px] transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />

      {/* Dismiss Overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container: The "Threshold Vessel" */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full max-w-[480px] bg-white/70 backdrop-blur-md rounded-[3.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(255,255,255,0.8)] p-12 transform transition-all duration-1000 ease-[cubic-bezier(0.17,0.67,0.16,0.99)] flex flex-col items-center border border-white/20 ${isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-24 scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Complex Visual Indicator: Liquid Quota Sphere */}
        <div className="relative w-32 h-32 mb-12 flex items-center justify-center group">

          {/* Outer Ring Glow */}
          <div className="absolute inset-0 rounded-full border border-red-100 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-[-10px] bg-red-500/5 rounded-full blur-xl animate-pulse" />

          {/* Liquid Vessel */}
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(255,59,48,0.1)] bg-slate-50 overflow-hidden">

             {/* Wave Animation */}
             <div className="absolute inset-0 top-[15%] w-[200%] h-[200%] left-[-50%] bg-gradient-to-b from-red-500 to-orange-500 rounded-[38%] animate-[liquid-wave_8s_linear_infinite]" />
             <div className="absolute inset-0 top-[10%] w-[200%] h-[200%] left-[-45%] bg-red-400/40 rounded-[42%] animate-[liquid-wave_11s_linear_infinite_reverse]" />

             {/* Floating Particles */}
             <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div key={i}
                       className="absolute bg-white/60 rounded-full animate-bubble"
                       style={{
                         width: Math.random() * 4 + 2 + 'px',
                         height: Math.random() * 4 + 2 + 'px',
                         left: Math.random() * 80 + 10 + '%',
                         top: '100%',
                         animationDelay: i * 0.8 + 's',
                         animationDuration: 3 + Math.random() * 3 + 's'
                       }}
                  />
                ))}
             </div>

             {/* Center Label */}
             <div className="absolute inset-0 flex flex-col items-center justify-center mix-blend-overlay">
                <span className="text-white font-black text-2xl tracking-tighter">MAX</span>
             </div>
          </div>

          {/* Floating Orbitals */}
          <div className="absolute inset-[-20px] border border-dashed border-red-200/50 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(255,59,48,0.5)]" />
        </div>

        {/* Dynamic Text Suite */}
        <div className="space-y-6 text-center">
          <div className="space-y-2 overflow-hidden">
             <h2 className={`text-4xl font-bold text-[#1D1D1F] tracking-tighter transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                Quota Exhausted
             </h2>
             <p className={`text-[#86868B] font-medium tracking-tight transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                Daily generation limit reached
             </p>
          </div>

          <div className={`p-6 rounded-3xl bg-slate-50/50 border border-slate-100/50 transition-all duration-700 delay-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
             <p className="text-[15px] leading-relaxed text-[#424245] font-medium">
                Want to increase your limit? <span className="text-[#0066CC] font-bold">DM</span> the developer on Discord or <span className="text-[#0066CC] font-bold">Mail</span> us at:
             </p>

             {/* Interaction Cards */}
             <div className="mt-6 flex flex-col gap-3">
                {/* Discord Card */}
                <div className="group/item relative bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 active:scale-[0.98]">
                   <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.0766 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Discord</span>
                      <span className="text-base font-bold text-[#1D1D1F] select-all cursor-copy">hasinraiyan</span>
                   </div>
                </div>

                {/* Mail Card */}
                <div className="group/item relative bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98]">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Direct Mail</span>
                      <span className="text-base font-bold text-[#1D1D1F] select-all cursor-copy">hasin.codes@gmail.com</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer: Apple-style Button */}
        <div className={`w-full mt-10 transition-all duration-700 delay-[900ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button
            onClick={onClose}
            className="w-full py-5 bg-[#1D1D1F] text-white rounded-[1.75rem] font-bold text-[17px] shadow-2xl shadow-slate-300 transition-all hover:bg-black active:scale-[0.97] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
          >
            Dismiss
          </button>
        </div>

      </div>

      <style>{`
        @keyframes liquid-wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bubble {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-120px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
