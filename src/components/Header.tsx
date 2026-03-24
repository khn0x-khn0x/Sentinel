'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { AptosClient } from "aptos";
import { Coins, Wallet, LogOut } from "lucide-react";

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");

export default function Header({ onHome }: { onHome: () => void }) {
  const { connected, account, connect, disconnect, wallets } = useWallet();
  const [balance, setBalance] = useState<string>('0.00');

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && account?.address) {
        try {
          const addr = account.address.toString();
          
          const payload = {
            function: "0x1::coin::balance",
            type_arguments: ["0x1::aptos_coin::AptosCoin"],
            arguments: [addr],
          };

          const result = await client.view(payload);
          
          if (result && result[0]) {
            const amount = Number(result[0]);
            setBalance((amount / 100_000_000).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }));
          }
        } catch (e) {
          console.error("Balance fetch error:", e);
          setBalance('0.00');
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [connected, account]);

  const displayName = account?.ansName 
    ? `${account.ansName}.apt` 
    : account?.address 
      ? `${account.address.toString().slice(0, 6)}...${account.address.toString().slice(-4)}`
      : '';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-[#F1F3F9]/90 backdrop-blur-xl p-6 w-full z-[100] border-b border-white/20 shadow-sm">
        <div className="flex flex-col cursor-pointer" onClick={onHome}>
          <h1 className="font-bold tracking-tight text-xl leading-none text-[#1A1C2E]">Sentinel</h1>
          <span className="text-[9px] font-black uppercase text-[#5A5F82]/50 tracking-[0.2em] mt-1">Testnet Protocol</span>
        </div>

        <div className="flex items-center gap-4">
          {!connected ? (
            <button 
              onClick={() => wallets?.[0] && connect(wallets[0].name)} 
              className="flex items-center gap-2 px-6 py-3 bg-[#1A1C2E] text-white text-[11px] font-bold uppercase rounded-2xl transition-all shadow-lg active:scale-95"
            >
              <Wallet size={14} /> Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* APT Balance Badge - Unified h-[46px] and px-4 for consistency */}
              <div className="hidden md:flex items-center gap-2 bg-white/50 border border-white/80 px-4 h-[46px] rounded-2xl shadow-sm">
                <Coins size={14} className="text-indigo-500" />
                <span className="text-xs font-bold text-[#1A1C2E]">{balance} APT</span>
              </div>

              {/* Account / ANS Badge - Unified h-[46px] and centered flex-col layout */}
              <div className="flex items-center gap-4 bg-white border border-white/60 px-4 h-[46px] rounded-2xl shadow-sm">
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-black text-[#5A5F82]/60 uppercase tracking-widest leading-none mb-0.5">Account</span>
                  <span className="text-xs font-bold text-indigo-600 leading-tight">
                    {displayName}
                  </span>
                </div>
                <button onClick={disconnect} className="p-1.5 text-rose-400 hover:text-rose-600 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-[92px] w-full" />
    </>
  );
}
