import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
});

// FIX: normalise NEXT_PUBLIC_SITE_URL — strip any existing protocol prefix
// so we never end up with "https://https://..." in og:url.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
const siteUrl = `https://${rawSiteUrl.replace(/^https?:\/\//, '')}`;

export const metadata: Metadata = {
  title: 'Annas Anuraga | Web Dev & IT Business Analyst',
  description:
    'Portofolio Annas Anuraga',
  openGraph: {
    title: 'Annas Anuraga | Web Dev & IT Business Analyst',
    description:
      'Portofolio Annas Anuraga',
    url: siteUrl,
    type: 'website',
  },
};

// FIX: removed ThemeProvider wrapper — this portfolio uses a permanent dark theme
// (class="dark" hardcoded on <html>). ThemeProvider / ThemeToggle / next-themes are
// therefore dead code and have been removed. If you ever want a light/dark toggle,
// remove the hardcoded "dark" class here and re-introduce next-themes properly.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} scroll-smooth dark`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[#09090b] text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}