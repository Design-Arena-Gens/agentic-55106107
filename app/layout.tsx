import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Institutional Accumulation Radar',
  description:
    'Agentic NSE scanner that ingests the last five bhav copies to surface stealth accumulation patterns by large institutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
