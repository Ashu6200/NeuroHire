import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/utils/theme-provider';
import StoreProvider from '@/utils/StoreProvider';
import { Toaster } from '@/components/ui/sonner';

const geistPoppins = Poppins({
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata = {
  title: 'NeuroHire',
  description:
    'NeuroHire is the next-gen AI career assistant that transforms how you land your dream job. Craft intelligent resumes, experience real-time AI-driven voice interviews, and get instant feedback—all powered by cutting-edge neural models. The future of hiring prep starts here.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body
        className={`${geistPoppins.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <StoreProvider>
            {children}
            <Toaster position='top-right' richColors expand={true} />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
