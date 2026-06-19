import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../store/AuthContext';
import { LayoutWrapper } from '../components/LayoutWrapper';
import { ToastContainer } from '../components/ToastContainer';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'SOSA Tenant Portal - Hostel & PG Management Dashboard',
  description: 'Premium mobile-first Tenant Portal. Manage room settings, fees, raise complaint tickets, view status and interact with owners.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full bg-[#050814] text-slate-100 antialiased overflow-x-hidden">
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
