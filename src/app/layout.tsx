import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from '@/components/Providers';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { getSeoSettings, getImageUrl } from '@/lib/seo';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return {
    title: {
      default: seo.metaTitle || seo.siteName || 'Tree',
      template: `%s | ${seo.siteName || 'Tree'}`,
    },
    description: seo.metaDescription,
    keywords: seo.metaKeywords?.split(',').map((k) => k.trim()).filter(Boolean),
    metadataBase: new URL(seo.siteUrl || 'http://localhost:3000'),
    openGraph: {
      title: seo.metaTitle || seo.siteName,
      description: seo.metaDescription,
      url: seo.siteUrl,
      siteName: seo.siteName,
      images: seo.ogImage ? [{ url: getImageUrl(seo.ogImage), width: 1200, height: 630 }] : [],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle || seo.siteName,
      description: seo.metaDescription,
      site: seo.twitterHandle,
      images: seo.ogImage ? [getImageUrl(seo.ogImage)] : [],
    },
    verification: {
      google: seo.googleVerification || undefined,
    },
    robots: {
      index: seo.robotsAllowAll,
      follow: seo.robotsAllowAll,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <GoogleAnalytics />
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
