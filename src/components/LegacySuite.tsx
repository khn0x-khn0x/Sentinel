'use client';
import { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { encryptData } from '@/lib/crypto';
import { Heart, Trash2, Clock, CheckCircle2, ArrowLeft, Plus, FileText, Activity, ShieldCheck } from 'lucide-react';

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");

const SHELBY_INTERVALS = [
  { label: '30s', value: 30 },
  { label: '7d', value: 7 * 24 * 60 * 60 },
  { label: '30d', value: 30 * 24 * 60 * 60 },
  { label: '90d', value: 90 * 24 * 60 * 60 },
  { label: '365d', value: 365 * 24 * 60 * 60 },
];

interface Vault {
  id: string;
  name: string;
  recipient: string;
  encryptedContent: string;
  timeLeft: number;
  createdAt: string;
  initialDuration: number;
}

interface TransferLog {
  id: string;
  vaultName: string;
  recipient: string;
  timestamp: string;
}

export default function LegacySuite() {
  const { connected, account } = useWallet();
  
  const [vaultName, setVaultName] = useState('');
  const [recipient, setRecipient] = useState('');
  const [secretText, setSecretText] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [tempEncrypted, setTempEncrypted] = useState('');
  const [selectedInterval, setSelectedInterval] = useState(SHELBY_INTERVALS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeVaults, setActiveVaults] = useState<Vault[]>([]);
  const [logs, setLogs] = useState<TransferLog[]>([]);
  const [notifiedVaults, setNotifiedVaults] = useState<Set<string>>(new Set());
  const [step, setStep] = useState(1);

  // Core countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVaults((prev) =>
        prev.map((v) => ({ ...v, timeLeft: v.timeLeft > 0 ? v.timeLeft - 1 : 0 }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger event log when vault reaches zero
  useEffect(() => {
    activeVaults.forEach(vault => {
      if (vault.timeLeft === 0 && !notifiedVaults.has(vault.id)) {
        setNotifiedVaults(prev => new Set(prev).add(vault.id));
        setLogs(prev => [{
          id: Math.random().toString(36).substr(2, 5),
          vaultName: vault.name,
          recipient: vault.recipient,
          timestamp: new Date().toLocaleTimeString(),
        }, ...prev]);
      }
    });
  }, [activeVaults, notifiedVaults]);

  // --- HEARTBEAT LOGIC ---
  const handleHeartbeat = (id?: string) => {
    setActiveVaults((prev) =>
      prev.map((v) => {
        if (!id || v.id === id) {
          return { ...v, timeLeft: v.initialDuration };
        }
        return v;
      })
    );
    
    if (id) {
      setNotifiedVaults(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      setNotifiedVaults(new Set());
    }
  };

  const handleEncrypt = () => {
    if (!secretText || !masterKey || !recipient) return alert("Please fill in all required fields!");
    setTempEncrypted(encryptData(secretText, masterKey));
    setStep(2);
  };

  const handleCreateVault = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    
    const newVault: Vault = {
      id: Math.random().toString(36).substr(2, 9),
      name: vaultName || "Untitled Protocol",
      recipient,
      encryptedContent: tempEncrypted,
      timeLeft: selectedInterval,
      initialDuration: selectedInterval,
      createdAt: new Date().toLocaleDateString(),
    };

    setActiveVaults([newVault, ...activeVaults]);
    setVaultName(''); setRecipient(''); setSecretText(''); setMasterKey(''); setTempEncrypted('');
    setStep(1);
    setIsSubmitting(false);
  };

  const currentIntervalLabel = SHELBY_INTERVALS.find(i => i.value === selectedInterval)?.label || '30s';

  return (
    <div className="min-h-screen bg-[#1A1C2E] p-4 md:p-8 font-sans text-white animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-[40px] p-10 shadow-xl shadow-black/20 border border-white/10 flex flex-col min-h-[680px]">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 rounded-xl">
                    <Activity size={20} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1A1C2E]">
                  {step === 1 ? 'Legacy Protocol' : 'Review & Authorize'}
                </h2>
            </div>

            {step === 1 ? (
              <div className="space-y-5 flex-1 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#5A5F82] ml-1">Legacy Title</label>
                  <input value={vaultName} onChange={e => setVaultName(e.target.value)} placeholder="E.g. Main Seed Phrase Backup" className="w-full bg-[#F1F3F9] border border-white rounded-2xl px-4 py-4 text-sm outline-none focus:border-indigo-300 transition-all shadow-inner text-[#1A1C2E]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#5A5F82] ml-1">Beneficiary Address</label>
                  <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="0x..." className="w-full bg-[#F1F3F9] border border-white rounded-2xl px-4 py-4 text-xs font-mono outline-none focus:border-indigo-300 transition-all shadow-inner text-[#1A1C2E]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#5A5F82] ml-1">Encrypted Payload</label>
                  <textarea value={secretText} onChange={e => setSecretText(e.target.value)} placeholder="Sensitive payload data..." className="w-full h-28 resize-none bg-[#F1F3F9] border border-white rounded-2xl px-4 py-4 text-sm outline-none focus:border-indigo-300 transition-all shadow-inner text-[#1A1C2E]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#5A5F82] ml-1">Master Key (Encryption)</label>
                  <input type="password" value={masterKey} onChange={e => setMasterKey(e.target.value)} placeholder="••••••••••••" className="w-full bg-[#F1F3F9] border border-white rounded-2xl px-4 py-4 text-sm outline-none focus:border-indigo-300 transition-all shadow-inner text-[#1A1C2E]" />
                </div>
                <button onClick={handleEncrypt} className="w-full py-5 bg-[#1A1C2E] hover:bg-[#2A2D45] text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 mt-4">
                  Seal Legacy Protocol
                </button>
              </div>
            ) : (
              <div className="space-y-6 flex-1 animate-in fade-in duration-500">
                <div className="p-5 bg-[#C9F2D9] border border-emerald-200 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3 text-emerald-800">
                    <CheckCircle2 size={16} /> 
                    <span className="text-[11px] font-bold uppercase tracking-wider">Payload Secured</span>
                  </div>
                  <div className="text-[10px] font-mono break-all text-emerald-900/70 bg-white/40 p-4 rounded-xl border border-emerald-100/50 leading-relaxed tracking-tighter shadow-inner max-h-40 overflow-y-auto">
                    {tempEncrypted}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#5A5F82]">Storage Duration</label>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{currentIntervalLabel}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-[#F1F3F9] rounded-2xl border border-white shadow-inner">
                    {SHELBY_INTERVALS.map(i => (
                      <button key={i.label} onClick={() => setSelectedInterval(i.value)} className={`py-3 rounded-xl text-[10px] font-bold transition-all ${selectedInterval === i.value ? 'bg-white text-indigo-600 shadow-md' : 'text-[#5A5F82] hover:bg-white/50'}`}>
                        {i.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 mt-auto">
                  <button onClick={handleCreateVault} disabled={isSubmitting} className="w-full py-5 bg-[#525CEB] hover:bg-[#3B44D1] disabled:bg-[#C4C9E2] text-white rounded-[24px] font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {isSubmitting ? <Clock size={16} className="animate-spin" /> : <ShieldCheck size={18} />}
                    {isSubmitting ? 'Deploying Protocol...' : 'Authorize & Seal Legacy'}
                  </button>
                  <button onClick={() => setStep(1)} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-[#5A5F82] hover:text-[#1A1C2E] py-3 transition-colors">
                    <ArrowLeft size={14} /> Back to Edit
                  </button>
                </div>
              </div>
            )}
          </section>
        </aside>

        <main className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#BFC8F2] p-8 rounded-[32px] border border-white shadow-sm flex justify-between items-center">
              <div>
                <p className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-wider mb-1">Active Protocols</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tighter text-[#1A1C2E]">{activeVaults.length}</span>
                  <span className="text-[11px] font-bold text-[#5A5F82]/60 uppercase">Legacy Assets</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center border border-white/20">
                <Plus size={32} className="text-[#1A1C2E]" />
              </div>
            </div>
            
            <div className="bg-[#C1E9D2] p-8 rounded-[32px] border border-white shadow-sm flex justify-between items-center">
              <div>
                <p className="text-[11px] font-bold text-emerald-900/60 uppercase tracking-wider mb-1">Network Status</p>
                <h3 className="text-3xl font-bold italic tracking-tighter uppercase text-emerald-900">Verified</h3>
                <p className="text-[11px] font-bold text-emerald-900/40 mt-1 uppercase">Shelby Node Active</p>
              </div>
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center border border-emerald-400 shadow-lg shadow-emerald-100">
                <CheckCircle2 size={32} className="text-white" />
              </div>
            </div>
          </div>

          <section className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-sm flex flex-col">
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-2xl tracking-tight text-white">Legacy Live Monitor</h3>
                <div className="flex items-center gap-3">
                  {activeVaults.length > 0 && (
                    <button 
                      onClick={() => handleHeartbeat()}
                      className="text-[10px] font-black uppercase tracking-widest bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                      <Heart size={14} fill="currentColor" /> Global Heartbeat
                    </button>
                  )}
                  <div className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-wider bg-white px-4 py-1.5 rounded-full border border-white shadow-inner">
                    {activeVaults.length} Total Protected
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent">
                {activeVaults.length === 0 ? (
                  <div className="col-span-full py-28 flex flex-col items-center justify-center text-white/40 font-medium">
                    <CheckCircle2 size={56} className="mb-4 opacity-30" />
                    <p className="uppercase text-[11px] font-black tracking-[0.3em]">No protocols initialized yet</p>
                  </div>
                ) : (
                  activeVaults.map(vault => (
                    <div 
                      key={vault.id} 
                      className={`bg-white p-6 rounded-[32px] flex items-stretch justify-between transition-all group border-2 
                        ${vault.timeLeft === 0 
                          ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] bg-rose-50/50 opacity-90' 
                          : 'border-transparent hover:border-indigo-100 hover:shadow-md bg-white'
                        }`}
                    >
                      <div className="flex flex-col justify-between gap-3">
                        <div className={vault.timeLeft === 0 ? 'opacity-50' : ''}>
                          <h4 className="font-bold text-lg text-[#1A1C2E] truncate max-w-[180px]">{vault.name}</h4>
                          <p className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-wide">Created: {vault.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleHeartbeat(vault.id)}
                              className={`p-2 rounded-lg transition-colors active:scale-90 ${
                                vault.timeLeft === 0 ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                              }`}
                              title="Send Heartbeat"
                            >
                              <Heart size={14} fill={vault.timeLeft > 0 ? "currentColor" : "none"} />
                            </button>
                            <p className="text-[11px] font-bold text-[#5A5F82]/60 truncate max-w-[120px]">To: {vault.recipient.slice(0, 8)}...</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between items-end gap-2 text-right">
                        <div className={`p-3 rounded-2xl ${vault.timeLeft > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-500 text-white shadow-lg shadow-rose-200'}`}>
                          <FileText size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className={`text-4xl font-extrabold tracking-tighter ${
                              vault.timeLeft < 10 && vault.timeLeft > 0 ? 'text-rose-600 animate-pulse' : 
                              vault.timeLeft === 0 ? 'text-rose-600' : 'text-indigo-600'
                            }`}>
                             {vault.timeLeft}s
                            </p>
                            {vault.timeLeft === 0 && (
                              <span className="text-[10px] font-black text-white uppercase bg-rose-500 px-2 py-1 rounded-md shadow-sm">
                                Protocol Executed
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="bg-white/10 border border-white/20 rounded-[40px] p-8 md:p-10 shadow-inner">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl tracking-tight text-white">Protocol History Log</h3>
                <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{logs.length} TOTAL LOGS</span>
             </div>
             <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-50 scrollbar-track-transparent">
                {logs.length === 0 ? (
                    <div className="py-12 text-center text-white/20 uppercase text-[10px] font-bold tracking-[0.2em]">No system events recorded yet</div>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="bg-white p-4 rounded-[22px] flex items-center justify-between border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#C9F2D9] text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-100">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[#1A1C2E]">Sentinel dispatched data to beneficiary</p>
                                    <p className="text-[10px] font-medium text-[#5A5F82]">Protocol: {log.vaultName} <span className="opacity-50">•</span> Beneficiary: {log.recipient.slice(0, 8)}...</p>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-[#5A5F82]/70 text-right">{log.timestamp}</p>
                        </div>
                    ))
                )}
             </div>
          </section>
        </main>
      </div>
    </div>
  );
}
