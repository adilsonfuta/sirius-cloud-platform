import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sirius Cloud — Infraestrutura para o teu próximo grande projecto',
  description: 'Cloud, hospedagem e infraestrutura digital com suporte local em Angola.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-AO"><body>{children}</body></html>;
}
