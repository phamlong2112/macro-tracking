// components/dashboard/DonutCard.tsx
'use client'

interface DonutCardProps {
  g: number  // green count
  a: number  // amber count
  r: number  // red count
}

export default function DonutCard({ g, a, r }: DonutCardProps) {
  const total = g + a + r
  if (total === 0) return null

  const gPct = (g / total) * 100
  const aPct = (a / total) * 100

  const gradient = `conic-gradient(
    #22c55e 0% ${gPct.toFixed(2)}%,
    #f0a824 ${gPct.toFixed(2)}% ${(gPct + aPct).toFixed(2)}%,
    #f04b4b ${(gPct + aPct).toFixed(2)}% 100%
  )`

  return (
    <div className="flex items-center gap-6 justify-center">
      {/* Donut */}
      <div
        className="w-[100px] h-[100px] rounded-full flex items-center justify-center relative shrink-0"
        style={{ background: gradient }}
      >
        {/* Donut hole */}
        <div
          className="flex flex-col items-center justify-center rounded-full"
          style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', backgroundColor: '#131a2b' }}
        >
          <span className="font-data-number text-2xl font-bold text-on-surface">{total}</span>
          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Tổng</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 font-label-md text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="status-dot" style={{ backgroundColor: '#22c55e' }} />
          {g} Tích cực
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot" style={{ backgroundColor: '#f0a824' }} />
          {a} Lưu ý
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot" style={{ backgroundColor: '#f04b4b' }} />
          {r} Rủi ro
        </div>
      </div>
    </div>
  )
}
