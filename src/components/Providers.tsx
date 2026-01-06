'use client';

import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import { StyleThemeProvider } from '@/contexts/StyleThemeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <StyleThemeProvider>
        {children}
      </StyleThemeProvider>
    </SiteSettingsProvider>
  );
}
