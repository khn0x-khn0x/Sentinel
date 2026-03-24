'use client';
import React, { useState, useRef } from 'react';
import { Trash2, Download, Clock, Lock, CheckCircle2, CloudFog, ArrowUpCircle, HardDrive, Search, Plus, FileText, Activity } from 'lucide-react';

interface QueuedFile {
  file: File;
  status: 'queued' | 'encrypting' | 'uploading' | 'completed';
}

interface StoredFile {
  id: string;
  name: string;
  uploadDate: string;
  expiryDate: string;
  size: string;
  originalFile: File;
  type: string;
}

export default function EncryptedVault() {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([]);
  const [expiry, setExpiry] = useState('30d');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) addFilesToQueue(e.dataTransfer.files);
  };

  const addFilesToQueue = (files: FileList) => {
    const newQueue = Array.from(files).map(f => ({ file: f, status: 'queued' as const }));
    setQueue(prev => [...prev, ...newQueue]);
  };

  const downloadFile = (fileData: StoredFile) => {
    const element = document.createElement("a");
    element.href = URL.createObjectURL(fileData.originalFile);
    element.download = `DECRYPTED_${fileData.name}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const deleteFile = (id: string) => {
    setStoredFiles(prev => prev.filter(file => file.id !== id));
  };

  // Mock upload logic simulating blockchain/node deployment
  const startShelbyUpload = async () => {
    if (queue.length === 0) return;
    setIsProcessing(true);
    for (const item of queue) {
      await new Promise(r => setTimeout(r, 1000));
      const newStoredFile: StoredFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: item.file.name,
        uploadDate: new Date().toLocaleDateString(),
        expiryDate: expiry,
        size: (item.file.size / 1024).toFixed(1) + ' KB',
        originalFile: item.file,
        type: item.file.type.split('/')[0]
      };
      setStoredFiles(prev => [newStoredFile, ...prev]);
    }
    setQueue([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#D1D5E8] p-4 md:p-8 font-sans text-[#1A1C2E] animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar: Upload & Persistence Settings */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white rounded-[40px] p-10 shadow-xl shadow-indigo-200/50 border border-white/50 flex flex-col min-h-[680px]">
            
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 rounded-xl">
                    <Activity size={20} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1A1C2E]">
                  Vault Protocol
                </h2>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold leading-tight tracking-tighter">Secure your <br/>digital assets.</h3>
                <p className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-widest">Decentralized Encryption Protocol</p>
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={`aspect-square rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer
                  ${dragActive ? 'border-indigo-500 bg-slate-50 scale-95' : 'border-[#C4C9E2] bg-[#F1F3F9] hover:bg-slate-50'}`}
              >
                <input type="file" hidden ref={fileInputRef} multiple onChange={(e) => e.target.files && addFilesToQueue(e.target.files)} />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 transition-transform hover:scale-110 border border-slate-100">
                    <Plus size={32} className="text-[#525CEB]" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest text-[#5A5F82]">
                  {queue.length > 0 ? `${queue.length} files selected` : 'Drop or click to vault'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase font-black tracking-widest text-[#5A5F82]">File Expiration</label>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{expiry}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-[#F1F3F9] rounded-2xl border border-white shadow-inner">
                  {['7d', '30d', '90d', '365d'].map(d => (
                    <button 
                      key={d} 
                      onClick={() => setExpiry(d)} 
                      className={`py-3 rounded-xl text-[10px] font-bold transition-all 
                        ${expiry === d 
                          ? 'bg-white text-indigo-600 shadow-md' 
                          : 'text-[#5A5F82] hover:bg-white/50'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={queue.length === 0 || isProcessing}
                onClick={startShelbyUpload}
                className="w-full py-5 bg-[#1A1C2E] hover:bg-[#2A2D45] disabled:bg-[#C4C9E2] text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 mt-auto flex items-center justify-center gap-2"
              >
                {isProcessing ? <Clock size={16} className="animate-spin" /> : <Lock size={18} />}
                {isProcessing ? 'Deploying to Nodes...' : 'Seal to Vault'}
              </button>
            </div>
          </section>
        </aside>

        {/* Main Content: Storage Status & History */}
        <main className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#BFC8F2] p-8 rounded-[32px] border border-white/60 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-wider mb-1">Vault Storage</p>
                <div className="flex items-baseline gap-2 text-[#1A1C2E]">
                  <span className="text-5xl font-extrabold tracking-tighter">{storedFiles.length}</span>
                  <span className="text-[11px] font-bold opacity-60 uppercase">Assets</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center border border-white/20">
                <HardDrive size={32} className="text-[#1A1C2E]" />
              </div>
            </div>
            
            <div className="bg-[#C1E9D2] p-8 rounded-[32px] border border-white/60 shadow-sm flex justify-between items-center text-emerald-900">
              <div>
                <p className="text-[11px] font-bold opacity-60 uppercase tracking-wider mb-1">Network Status</p>
                <h3 className="text-3xl font-bold italic tracking-tighter uppercase">Verified</h3>
                <p className="text-[11px] font-bold opacity-40 mt-1 uppercase">Shelby Node Active</p>
              </div>
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center border border-emerald-400 shadow-lg shadow-emerald-100">
                <CheckCircle2 size={32} className="text-white" />
              </div>
            </div>
          </div>

          <section className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm flex flex-col">
            <div className="p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-2xl tracking-tight text-[#1A1C2E]">Recent Transactions</h3>
                <div className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-wider bg-white/80 px-4 py-1.5 rounded-full border border-white shadow-inner">
                  {storedFiles.length} Total Vaulted
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                {storedFiles.length === 0 ? (
                  <div className="col-span-full py-28 flex flex-col items-center justify-center text-[#1A1C2E]/40 font-medium">
                    <CloudFog size={56} className="mb-4 opacity-30" />
                    <p className="uppercase text-[11px] font-black tracking-[0.3em]">No activity recorded yet</p>
                  </div>
                ) : (
                  storedFiles.map(file => (
                    <div key={file.id} className="bg-white p-6 rounded-[32px] flex items-stretch justify-between transition-all group border border-transparent hover:border-white hover:shadow-lg">
                      <div className="flex flex-col justify-between gap-3 overflow-hidden text-[#1A1C2E]">
                        <div>
                          <h4 className="font-bold text-lg truncate pr-2">{file.name}</h4>
                          <p className="text-[11px] font-bold text-[#5A5F82] uppercase tracking-wide">
                            Size: {file.size}
                          </p>
                        </div>
                        <p className="text-[11px] font-bold text-[#5A5F82]/60 uppercase tracking-widest">Expiry: {file.expiryDate}</p>
                      </div>
                      
                      <div className="flex flex-col justify-between items-end gap-2">
                        <div className={`p-3 rounded-2xl bg-indigo-50 text-indigo-600`}>
                          <FileText size={20} />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => downloadFile(file)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                            <Download size={16} />
                          </button>
                          <button onClick={() => deleteFile(file.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
