'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface SeoSettings {
  googleAnalyticsId?: string;
}

export default function GoogleAnalytics() {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGaId = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/public/seo`
        );
        if (res.ok) {
          const json = await res.json();
          const settings: SeoSettings = json.data;
          if (settings?.googleAnalyticsId) {
            setGaId(settings.googleAnalyticsId);
          }
        }
      } catch (error) {
        console.error('Failed to fetch GA ID:', error);
      }
    };

    fetchGaId();
  }, []);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
