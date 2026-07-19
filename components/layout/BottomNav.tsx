// components/layout/BottomNav.tsx
'use client'

const NAV_ITEMS = [
  { label: 'Tổng quan', icon: 'dashboard', filled: true },
  { label: 'Thị trường', icon: 'public', filled: false },
  { label: 'Chỉ số', icon: 'monitoring', filled: false },
  { label: 'Thư viện', icon: 'menu_book', filled: false },
  { label: 'Cài đặt', icon: 'settings', filled: false },
]

interface BottomNavProps {
  activeTab: number
  onTabChange: (tab: number) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface-dim border-t border-surface-variant flex justify-around items-center h-16 z-50">
      {NAV_ITEMS.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onTabChange(idx)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === idx ? 'text-primary' : 'text-on-surface-variant'
          } active:opacity-80`}
        >
          <span
            className="material-symbols-outlined mb-1"
            style={activeTab === idx ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-medium font-label-md">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
