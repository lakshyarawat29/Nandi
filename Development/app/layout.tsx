import type React from 'react';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { NavigationProgress } from '@/components/navigation-progress';
import { EnhancedPageTransition } from '@/components/enhanced-page-transition';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nandi | AI Financial Co-pilot for Farmers',
  description:
    'Empowering Indian smallholder farmers with AI-powered financial guidance, weather insights, and market intelligence',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.className} bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProgress />
          <EnhancedPageTransition>{children}</EnhancedPageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
