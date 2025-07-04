import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Mustafair',
  description: 'A Decentralized Social Media Platform',
  generator: 'Chris And Aditya',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000',
              border: '2px solid #fff',
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            },
          }}
        />
      </body>
    </html>
  );
}
