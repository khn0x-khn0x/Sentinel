'use client';
import { useState } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ShieldCheck, HardDrive, Lock, ArrowRight, Wallet } from 'lucide-react';
import Header from '@/components/Header';
import LegacySuite from '@/components/LegacySuite';
import EncryptedVault from '@/components/EncryptedVault';

export default function Home() {
  const { connected, connect, wallets } = useWallet();
  const [activeTab, setActiveTab] = useState<'hub' | 'legacy' | 'storage'>('hub');
  
  // State for tracking card hover effects
  const [hoveredZone, setHoveredZone] = useState<'none' | 'storage' | 'legacy'>('none');

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#D1D5E8] flex flex-col relative overflow-hidden font-sans">
        {/* Ambient background for Login screen */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D1D5E8] via-[#E2E5F2] to-[#C4C9E2] opacity-50" />
        
        <Header onHome={() => setActiveTab('hub')} />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          <div className="space-y-8 max-w-3xl">
            <div className="inline-block p-4 bg-white/40 rounded-2xl border border-white/60 mb-4 text-[#5A5F82] font-bold text-[10px] uppercase tracking-[0.3em] backdrop-blur-md shadow-sm">
              Next-Gen Asset Protection
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-[#1A1C2E] tracking-tight leading-[0.95]">
              Secure your <br />
              <span className="text-[#525CEB]">digital</span> assets.
            </h1>
            <p className="text-[#5A5F82] text-xl font-medium max-w-xl mx-auto leading-relaxed">
              The first decentralized vault on Aptos blockchain with an intelligent legacy transfer protocol.
            </p>
            <div className="pt-10">
              <button 
                onClick={() => connect(wallets[0].name)}
                className="group flex items-center gap-3 mx-auto px-12 py-6 bg-[#1A1C2E] hover:bg-[#2A2D45] text-white font-bold uppercase tracking-widest rounded-[24px] transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Wallet size={20} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
                Connect Wallet & Enter
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D1D5E8] flex flex-col relative overflow-hidden font-sans transition-colors duration-700">
      
      {/* DECORATIVE ELEMENTS (Animated blobs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] bg-white/40 animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[120px] bg-indigo-200/50 animate-blob animation-delay-2000" />
      </div>

      <Header onHome={() => setActiveTab('hub')} />
      
      <main className="flex-1 overflow-y-auto relative z-10">
        {activeTab === 'hub' && (
          <div className="max-w-6xl mx-auto p-8 md:p-12 animate-in fade-in zoom-in duration-500">
            <div className="mb-12">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#5A5F82] opacity-60">
                Select Protocol / Hub Access
              </h2>
              <div className="h-1 w-12 bg-[#525CEB] rounded-full mt-3 opacity-40"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              {/* CARD: ENCRYPTED VAULT */}
              <div 
                onMouseEnter={() => setHoveredZone('storage')}
                onMouseLeave={() => setHoveredZone('none')}
                onClick={() => setActiveTab('storage')}
                className={`group cursor-pointer p-10 rounded-[40px] border transition-all duration-500 relative overflow-hidden min-h-[300px] flex flex-col justify-between shadow-sm ${
                  hoveredZone === 'storage' 
                    ? 'bg-white shadow-2xl shadow-indigo-200/50 border-white scale-[1.02] z-10' 
                    : 'bg-white/40 border-white/60 hover:bg-white/60'
                }`}
              >
                <div className={`absolute -top-6 -right-6 p-8 transition-all duration-700 ${
                  hoveredZone === 'storage' ? 'text-indigo-600/10 rotate-12 scale-110' : 'text-[#5A5F82]/5'
                }`}>
                  <HardDrive size={200} strokeWidth={1.5} />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="w-16 h-16 bg-[#525CEB]/10 rounded-2xl flex items-center justify-center text-[#525CEB] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-inner border border-white">
                    <HardDrive size={32} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight text-[#1A1C2E]">
                      Vault <br />Protocol
                    </h3>
                    <p className="mt-4 text-[#5A5F82] text-sm leading-relaxed max-w-[280px] font-medium">
                      Secure upload and file encryption on the blockchain. Only you have access.
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] pt-4 transition-colors ${
                    hoveredZone === 'storage' ? 'text-[#525CEB]' : 'text-[#5A5F82]/60'
                  }`}>
                    Open Vault <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              {/* CARD: LEGACY SUITE */}
              <div 
                onMouseEnter={() => setHoveredZone('legacy')}
                onMouseLeave={() => setHoveredZone('none')}
                onClick={() => setActiveTab('legacy')}
                className={`group cursor-pointer p-10 rounded-[40px] border transition-all duration-500 relative overflow-hidden min-h-[300px] flex flex-col justify-between shadow-sm ${
                  hoveredZone === 'legacy' 
                    ? 'bg-[#1A1C2E] shadow-2xl shadow-slate-400 border-[#1A1C2E] scale-[1.02] z-10' 
                    : 'bg-white/40 border-white/60 hover:bg-white/60'
                }`}
              >
                <div className={`absolute -top-6 -right-6 p-8 transition-all duration-700 ${
                  hoveredZone === 'legacy' ? 'text-white/5 -rotate-12 scale-110' : 'text-[#5A5F82]/5'
                }`}>
                  <ShieldCheck size={200} strokeWidth={1.5} />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-inner border ${
                    hoveredZone === 'legacy' ? 'bg-white/10 text-white border-white/20' : 'bg-[#1A1C2E]/10 text-[#1A1C2E] border-white'
                  }`}>
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className={`text-4xl font-bold tracking-tight transition-colors ${
                      hoveredZone === 'legacy' ? 'text-white' : 'text-[#1A1C2E]'
                    }`}>
                      Legacy <br />Protocol
                    </h3>
                    <p className={`mt-4 text-sm leading-relaxed max-w-[280px] font-medium transition-colors ${
                      hoveredZone === 'legacy' ? 'text-white/60' : 'text-[#5A5F82]'
                    }`}>
                      Automated legacy transfer system triggered by owner inactivity.
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] pt-4 transition-colors ${
                    hoveredZone === 'legacy' ? 'text-indigo-400' : 'text-[#5A5F82]/60'
                  }`}>
                    Manage Legacy <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* INFO SECTION */}
            <div className="mt-20 flex flex-col items-center justify-center text-center">
              <div className="min-h-[80px] transition-all duration-500 ease-out">
                {hoveredZone === 'storage' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3">
                    <span className="px-4 py-1.5 bg-[#C9F2D9] text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      AES-256 Fragmentation
                    </span>
                    <p className="text-[#5A5F82] max-w-xl mx-auto text-sm font-medium leading-relaxed">
                      Your data is fragmented before upload and stored across decentralized nodes for maximum security.
                    </p>
                  </div>
                )}
                {hoveredZone === 'legacy' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3">
                    <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      Dead Man&apos;s Switch
                    </span>
                    <p className="text-[#5A5F82] max-w-xl mx-auto text-sm font-medium leading-relaxed">
                      A smart contract automatically unlocks access to your digital keys only after inactivity is verified.
                    </p>
                  </div>
                )}
                {hoveredZone === 'none' && (
                  <div className="opacity-40 flex flex-col items-center gap-4">
                    <div className="flex gap-1.5">
                       <div className="w-1.5 h-1.5 bg-[#5A5F82] rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-[#5A5F82] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                       <div className="w-1.5 h-1.5 bg-[#5A5F82] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <p className="text-[#5A5F82] text-[10px] font-black uppercase tracking-[0.4em]">
                      Select a protocol module
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'legacy' && <LegacySuite />}
        {activeTab === 'storage' && <EncryptedVault />}
      </main>
    </div>
  );
}
