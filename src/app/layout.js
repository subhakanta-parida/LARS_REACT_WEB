import '@manulife/mux-tokens/fonts/fonts.css';
import 'src/styles/globals.css';

import Providers from 'src/components/providers/Providers';

export const metadata = {
  title: 'LARS | Manulife',
  description: 'Sign in to LARS with your Manulife credentials.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="m-0 min-h-full">
      <body className="m-0 min-h-full bg-white font-['Manulife_JH_Sans',sans-serif] text-lars-ink"><Providers>{children}</Providers></body>
    </html>
  );
}