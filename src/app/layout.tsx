import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import DemoSwitcher from '@/components/DemoSwitcher';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

export const metadata: Metadata = {
  title: 'Thaluwa Bazar | থলুৱা বজাৰ - Assam Hyperlocal Marketplace',
  description: 'Assam-first hyperlocal marketplace connecting nearby buyers and local sellers within 5km for fresh duck eggs, river fish, Joha rice, vegetables, dairy and bamboo handicrafts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="as">
      <body className="bg-slate-50 font-sans text-slate-900 flex flex-col min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
        <AppProvider>
          <ScrollProgress />
          <DemoSwitcher />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
