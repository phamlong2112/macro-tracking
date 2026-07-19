// components/layout/Header.tsx
'use client'

import { useState } from 'react'

interface HeaderProps {
  activeTab: number
  onTabChange: (tab: number) => void
  lastUpdated: string
}

const TABS = [
  { label: 'TỔNG QUAN', icon: 'dashboard' },
  { label: 'THỊ TRƯỜNG & BỐI CẢNH', icon: 'public' },
  { label: 'CÁC CHỈ SỐ MỞ RỘNG KHÁC', icon: 'monitoring' },
  { label: 'THƯ VIỆN CHỈ SỐ', icon: 'menu_book' },
  { label: 'CÀI ĐẶT', icon: 'settings' },
]

export default function Header({ activeTab, onTabChange, lastUpdated }: HeaderProps) {
  const [ribbonVisible, setRibbonVisible] = useState(true)

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0f172a] via-[#131a2b] to-[#1e1b4b] border-b border-surface-variant shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      {/* TopAppBar Content */}
      <div className="flex justify-between items-center w-full px-card-padding h-[72px]">
        {/* Left: Logo & Titles */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-bright/50 border border-outline-variant flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-dim" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-headline-md text-headline-md font-bold text-on-primary-container tracking-tight leading-none uppercase">
              THEO DÕI BIẾN ĐỘNG VĨ MÔ
            </h1>
            <p className="font-label-md text-label-md text-on-surface-variant mt-1">Tập đoàn FPT</p>
          </div>
        </div>

        {/* Top Navigation Cluster (Web) */}
        <nav className="hidden md:flex items-center h-full gap-2">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => onTabChange(idx)}
              className={`px-5 h-full flex items-center font-label-md text-label-md font-medium uppercase transition-colors duration-200 cursor-pointer active:opacity-80 ${
                activeTab === idx
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 bg-surface/50 border border-surface-variant px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></div>
            <span className="font-label-md text-[13px] text-on-surface-variant">Cập nhật: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-3 border-l border-surface-variant pl-6">
            <button className="w-10 h-10 rounded-full hover:bg-surface-bright/30 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-surface-bright/30 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-background"></span>
            </button>
            <button className="w-10 h-10 rounded-full bg-surface-bright hover:ring-2 ring-primary-dim transition-all overflow-hidden flex items-center justify-center border border-outline-variant cursor-pointer active:opacity-80">
              <span className="material-symbols-outlined text-primary-dim">account_circle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warning Ribbon */}
      {ribbonVisible && (
        <div className="w-full bg-[#f0a824] px-card-padding py-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 text-[#493100]">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span className="font-label-md text-[13px] font-semibold tracking-wide">
              Lưu ý: Số liệu chỉ mang tính tham khảo, không phải khuyến nghị đầu tư
            </span>
          </div>
          <button
            onClick={() => setRibbonVisible(false)}
            className="text-[#493100] hover:bg-[#c98715] rounded-full p-1 transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </header>
  )
}
