import './globals.css';
import React from 'react';

export const metadata = {
  title: 'VS Control Panel',
  description: 'Control Panel for VS/IYN',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}