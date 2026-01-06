'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Font presets - đa dạng font cho heading và body
export const fontPresets = {
  elegant: {
    name: 'Elegant',
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', -apple-system, sans-serif",
    description: 'Sang trọng, cổ điển'
  },
  modern: {
    name: 'Modern',
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', -apple-system, sans-serif",
    description: 'Hiện đại, thanh lịch'
  },
  minimal: {
    name: 'Minimal',
    heading: "'Crimson Pro', Georgia, serif",
    body: "'Source Sans 3', -apple-system, sans-serif",
    description: 'Tối giản, dễ đọc'
  },
  luxury: {
    name: 'Luxury',
    heading: "'Cinzel', Georgia, serif",
    body: "'Lato', -apple-system, sans-serif",
    description: 'Cao cấp, quý phái'
  },
  classic: {
    name: 'Classic',
    heading: "'Libre Baskerville', Georgia, serif",
    body: "'Open Sans', -apple-system, sans-serif",
    description: 'Truyền thống, ổn định'
  },
  artistic: {
    name: 'Artistic',
    heading: "'Bodoni Moda', Georgia, serif",
    body: "'Nunito', -apple-system, sans-serif",
    description: 'Nghệ thuật, ấn tượng'
  }
} as const;

// Color palettes - tông màu trầm hương
export const colorPalettes = {
  warmGold: {
    name: 'Vàng Ấm',
    primary: '#c9a962',
    secondary: '#8b7355',
    accent: '#d4c5a9',
    bgDark: '#1a1510',
    bgLight: '#fdfbf7',
    textDark: '#2c2416',
    textLight: '#d4c5a9',
    description: 'Trầm hương vàng kim cổ điển'
  },
  deepBrown: {
    name: 'Nâu Sâu',
    primary: '#8b6914',
    secondary: '#5c4a1f',
    accent: '#c4a35a',
    bgDark: '#1c1810',
    bgLight: '#f9f6f0',
    textDark: '#3d3425',
    textLight: '#c4a35a',
    description: 'Màu gỗ trầm đậm'
  },
  honeyAmber: {
    name: 'Hổ Phách',
    primary: '#d4a574',
    secondary: '#a67c52',
    accent: '#e8c9a3',
    bgDark: '#241d14',
    bgLight: '#fef9f3',
    textDark: '#352b1e',
    textLight: '#e8c9a3',
    description: 'Hổ phách mật ong'
  },
  antiqueGold: {
    name: 'Vàng Cổ',
    primary: '#b8860b',
    secondary: '#8b6914',
    accent: '#daa520',
    bgDark: '#18150e',
    bgLight: '#faf8f2',
    textDark: '#2e2817',
    textLight: '#daa520',
    description: 'Vàng cổ điển quý tộc'
  },
  rosewood: {
    name: 'Gỗ Hồng',
    primary: '#9c6b5e',
    secondary: '#6b4a42',
    accent: '#c9a090',
    bgDark: '#1a1412',
    bgLight: '#fdf8f6',
    textDark: '#3c2e2a',
    textLight: '#c9a090',
    description: 'Gỗ hồng sang trọng'
  },
  sandalwood: {
    name: 'Gỗ Đàn',
    primary: '#a68b5b',
    secondary: '#7a6642',
    accent: '#d4bc8a',
    bgDark: '#1e1a14',
    bgLight: '#fcf9f4',
    textDark: '#3a3228',
    textLight: '#d4bc8a',
    description: 'Gỗ đàn hương tự nhiên'
  }
} as const;

export type FontPreset = keyof typeof fontPresets;
export type ColorPalette = keyof typeof colorPalettes;

interface StyleThemeContextType {
  fontPreset: FontPreset;
  colorPalette: ColorPalette;
  setFontPreset: (preset: FontPreset) => void;
  setColorPalette: (palette: ColorPalette) => void;
  fonts: typeof fontPresets[FontPreset];
  colors: typeof colorPalettes[ColorPalette];
  showThemeSwitcher: boolean;
  setShowThemeSwitcher: (show: boolean) => void;
}

const StyleThemeContext = createContext<StyleThemeContextType | undefined>(undefined);

export function StyleThemeProvider({ children }: { children: ReactNode }) {
  const [fontPreset, setFontPresetState] = useState<FontPreset>('elegant');
  const [colorPalette, setColorPaletteState] = useState<ColorPalette>('warmGold');
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedFont = localStorage.getItem('style-font') as FontPreset;
    const savedColor = localStorage.getItem('style-color') as ColorPalette;

    if (savedFont && fontPresets[savedFont]) {
      setFontPresetState(savedFont);
    }
    if (savedColor && colorPalettes[savedColor]) {
      setColorPaletteState(savedColor);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('style-font', fontPreset);
    localStorage.setItem('style-color', colorPalette);

    const fonts = fontPresets[fontPreset];
    const colors = colorPalettes[colorPalette];

    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--font-heading', fonts.heading);
    root.style.setProperty('--font-body', fonts.body);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--bg-dark', colors.bgDark);
    root.style.setProperty('--bg-light', colors.bgLight);
    root.style.setProperty('--text-dark', colors.textDark);
    root.style.setProperty('--text-light', colors.textLight);
  }, [fontPreset, colorPalette, mounted]);

  const setFontPreset = (preset: FontPreset) => setFontPresetState(preset);
  const setColorPalette = (palette: ColorPalette) => setColorPaletteState(palette);

  return (
    <StyleThemeContext.Provider
      value={{
        fontPreset,
        colorPalette,
        setFontPreset,
        setColorPalette,
        fonts: fontPresets[fontPreset],
        colors: colorPalettes[colorPalette],
        showThemeSwitcher,
        setShowThemeSwitcher
      }}
    >
      {children}
    </StyleThemeContext.Provider>
  );
}

export function useStyleTheme() {
  const context = useContext(StyleThemeContext);
  if (context === undefined) {
    throw new Error('useStyleTheme must be used within a StyleThemeProvider');
  }
  return context;
}
