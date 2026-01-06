'use client';

import { useState } from 'react';
import { useStyleTheme, fontPresets, colorPalettes, FontPreset, ColorPalette } from '@/contexts/StyleThemeContext';

export default function ThemeSwitcher() {
  const {
    fontPreset,
    colorPalette,
    setFontPreset,
    setColorPalette,
    showThemeSwitcher,
    setShowThemeSwitcher
  } = useStyleTheme();

  const [activeTab, setActiveTab] = useState<'font' | 'color'>('font');

  if (!showThemeSwitcher) {
    return (
      <button
        onClick={() => setShowThemeSwitcher(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        style={{ backgroundColor: 'var(--color-primary)' }}
        title="Đổi giao diện"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <h3 className="text-sm font-medium tracking-wide">Tùy chỉnh giao diện</h3>
        <button
          onClick={() => setShowThemeSwitcher(false)}
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/10">
        <button
          onClick={() => setActiveTab('font')}
          className={`flex-1 py-2.5 text-xs tracking-wider uppercase transition-colors ${
            activeTab === 'font'
              ? 'text-black border-b-2'
              : 'text-black/50 hover:text-black'
          }`}
          style={{ borderColor: activeTab === 'font' ? 'var(--color-primary)' : 'transparent' }}
        >
          Font chữ
        </button>
        <button
          onClick={() => setActiveTab('color')}
          className={`flex-1 py-2.5 text-xs tracking-wider uppercase transition-colors ${
            activeTab === 'color'
              ? 'text-black border-b-2'
              : 'text-black/50 hover:text-black'
          }`}
          style={{ borderColor: activeTab === 'color' ? 'var(--color-primary)' : 'transparent' }}
        >
          Màu sắc
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-80 overflow-y-auto">
        {activeTab === 'font' ? (
          <div className="space-y-2">
            {(Object.keys(fontPresets) as FontPreset[]).map((key) => {
              const preset = fontPresets[key];
              const isActive = fontPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => setFontPreset(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'border-2 bg-black/5'
                      : 'border-black/10 hover:border-black/30'
                  }`}
                  style={{ borderColor: isActive ? 'var(--color-primary)' : undefined }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-base"
                      style={{ fontFamily: preset.heading }}
                    >
                      {preset.name}
                    </span>
                    {isActive && (
                      <svg className="w-4 h-4" style={{ color: 'var(--color-primary)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-black/50" style={{ fontFamily: preset.body }}>
                    {preset.description}
                  </p>
                  <p className="text-xs text-black/30 mt-1 truncate" style={{ fontFamily: preset.heading }}>
                    Trầm Hương Việt Nam
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {(Object.keys(colorPalettes) as ColorPalette[]).map((key) => {
              const palette = colorPalettes[key];
              const isActive = colorPalette === key;
              return (
                <button
                  key={key}
                  onClick={() => setColorPalette(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'border-2 bg-black/5'
                      : 'border-black/10 hover:border-black/30'
                  }`}
                  style={{ borderColor: isActive ? palette.primary : undefined }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{palette.name}</span>
                    {isActive && (
                      <svg className="w-4 h-4" style={{ color: palette.primary }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-black/50 mb-2">{palette.description}</p>
                  {/* Color swatches */}
                  <div className="flex gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full border border-black/10"
                      style={{ backgroundColor: palette.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-black/10"
                      style={{ backgroundColor: palette.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-black/10"
                      style={{ backgroundColor: palette.accent }}
                      title="Accent"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-black/10"
                      style={{ backgroundColor: palette.bgDark }}
                      title="Background Dark"
                    />
                    <div
                      className="w-8 h-8 rounded-full border border-black/10"
                      style={{ backgroundColor: palette.bgLight }}
                      title="Background Light"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-black/5 text-center">
        <p className="text-[10px] text-black/40">Nhấn vào icon bút vẽ để mở lại panel này</p>
      </div>
    </div>
  );
}
