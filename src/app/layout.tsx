import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const meta = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  title: 'App',
  description: 'A Next.js app.',
};

async function generateMetadata() {
  return {
    metadataBase: meta.siteUrl ? new URL(meta.siteUrl) : undefined,
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: '/',
    },
  };
}

function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

export { generateMetadata };
export default RootLayout;
