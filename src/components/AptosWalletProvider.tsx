'use client';

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren, useEffect, useState } from "react";
import { Network } from "@aptos-labs/ts-sdk";

const wallets = [new PetraWallet()];

export const AptosWalletProvider = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by waiting for the component to mount on the client
  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return (
    <AptosWalletAdapterProvider 
      plugins={wallets} 
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
