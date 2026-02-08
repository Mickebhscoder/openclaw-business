import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StytchProvider } from '@/components/stytch-provider';
import { AmplitudeProvider } from '@/components/amplitude-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenClaw Business',
  description: 'Launch and manage AI agents for your business',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StytchProvider>
          <AmplitudeProvider>{children}</AmplitudeProvider>
        </StytchProvider>
      </body>
    </html>
  );
}
