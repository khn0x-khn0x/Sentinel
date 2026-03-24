import { AptosWalletProvider } from "@/components/AptosWalletProvider";
import "./globals.css";

export const metadata = {
  title: "Sentinel",
  description: "Secure and hereditary storage powered by the Shelby Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AptosWalletProvider>
          {children}
        </AptosWalletProvider>
      </body>
    </html>
  );
}
