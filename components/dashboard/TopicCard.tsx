// components/dashboard/TopicCard.tsx
'use client'

interface TopicCardProps {
  id: string
  code: string
  icon: string
  name: string
  status: string   // "pos" | "cau" | "risk"
  trend: string    // "up" | "down" | "flat"
  driverNote?: string | null
  counts: { g: number; a: number; r: number }
  onClick?: () => void
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pos: { label: 'Tích cực', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  cau: { label: 'Lưu ý', color: '#f0a824', bg: 'rgba(240,168,36,0.1)', border: 'rgba(240,168,36,0.2)' },
  risk: { label: 'Rủi ro', color: '#f04b4b', bg: 'rgba(240,75,75,0.1)', border: 'rgba(240,75,75,0.2)' },
}

const TREND_MAP: Record<string, { icon: string; label: string }> = {
  up: { icon: 'arrow_upward', label: 'Đang tốt lên' },
  flat: { icon: 'swap_horiz', label: 'Đi ngang' },
  down: { icon: 'arrow_downward', label: 'Đang xấu đi' },
}

export default function TopicCard({ id, code, icon, name, status, trend, driverNote, counts, onClick }: TopicCardProps) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.cau
  const t = TREND_MAP[trend] ?? TREND_MAP.flat

  // Signal dots: render g green + a amber + r red
  const dots = [
    ...Array(counts.g).fill('#22c55e'),
    ...Array(counts.a).fill('#f0a824'),
    ...Array(counts.r).fill('#f04b4b'),
  ]

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-xl border border-surface-variant p-[24px] hover:border-primary-dim/40 hover:shadow-[0_0_20px_rgba(108,156,255,0.12)] transition-all duration-300 group cursor-pointer flex flex-col min-h-[180px]"
    >
      {/* Top: Name + Status Badge */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-headline-md text-[20px] font-semibold text-on-surface group-hover:text-primary-dim transition-colors">
          {icon} {name}
        </h3>
        <div
          className="px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0 ml-2"
          style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
          />
          <span
            className="font-label-md text-[12px] font-bold uppercase tracking-wider"
            style={{ color: s.color }}
          >
            {s.label}
          </span>
        </div>
      </div>

      {/* Bottom: Trend + Dots + Note */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span
            className="font-label-md text-[13px] font-medium flex items-center gap-1 px-2 py-0.5 rounded"
            style={{ color: s.color, backgroundColor: s.bg }}
          >
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </span>
          {/* Signal dots */}
          <div className="flex gap-1.5" title={`${counts.g} Tốt, ${counts.a} Vừa, ${counts.r} Xấu`}>
            {dots.map((color, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-surface-variant/50" />
        <p className="font-body-md text-[15px] text-on-surface-variant leading-relaxed">
          {driverNote || `${counts.g + counts.a + counts.r} chỉ số theo dõi`}
        </p>
      </div>
    </div>
  )
}
