// components/dashboard/IndicatorRow.tsx
'use client'

import Sparkline from './Sparkline'

interface Observation {
  id: string
  date: string | Date
  value: number | null
  displayValue: string | null
  signal: string
  note: string | null
  cmpW: string | null
  cmpM: string | null
  cmpYtd: string | null
  cmpYoy: string | null
}

interface IndicatorRowProps {
  id: string
  name: string
  freq: string
  manualEntry: boolean
  source: string | null
  observations: Observation[]
  onOpenModal: (id: string) => void
  latestUpdateDate: string
}

const FREQ_LABEL: Record<string, string> = {
  'Ngày': 'Hàng ngày',
  'Tuần': 'Hàng tuần',
  'Tháng': 'Hàng tháng',
  'Quý': 'Hàng quý',
  'Kỳ họp': 'Kỳ họp',
  'Sự kiện': 'Sự kiện',
  'Kỳ 10 ngày': 'Kỳ 10 ngày',
}

function dotClass(signal: string) {
  if (signal === 'green') return 'dot-green'
  if (signal === 'red') return 'dot-red'
  return 'dot-amber'
}

// "MỚI" chỉ áp dụng cho chỉ số có độ chi tiết theo ngày/tuần (Ngày, Tuần, Kỳ 10 ngày).
// Các chỉ số Tháng/Quý/Kỳ họp/Sự kiện dùng ngày mặc định khi asOf không có mốc ngày cụ
// thể (vd "H1/26", "Q2/26") — ngày đó không phản ánh việc dữ liệu vừa thật sự được cập
// nhật, nên loại khỏi badge để tránh hiện "MỚI" tràn lan trên các chỉ số không đổi.
const DAY_PRECISION_FREQ = new Set(['Ngày', 'Tuần', 'Kỳ 10 ngày'])

// Check if latest obs is within 7 days of the dashboard's actual latest update
function isNew(date: string | Date, freq: string, latestUpdateDate: string) {
  if (!DAY_PRECISION_FREQ.has(freq)) return false
  const d = new Date(date)
  const now = new Date(latestUpdateDate)
  return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000
}

function formatDate(date: string | Date) {
  const d = new Date(date)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
}

export default function IndicatorRow({ id, name, freq, manualEntry, source, observations, onOpenModal, latestUpdateDate }: IndicatorRowProps) {
  const latest = observations[0]
  if (!latest) return null

  const sources = source ? source.split(',').map(s => s.trim()).filter(Boolean) : []

  const signal = latest.signal ?? 'amber'
  const sparkData = observations
    .slice()
    .reverse()
    .map(o => o.value)
    .filter((v): v is number => v !== null)

  const cmpItems = [
    { label: 'W', val: latest.cmpW },
    { label: 'M', val: latest.cmpM },
    { label: 'YTD', val: latest.cmpYtd },
    { label: 'YoY', val: latest.cmpYoy },
  ]

  return (
    <div
      className="indicator-row p-3 flex flex-col gap-2 rounded-md"
      onClick={() => onOpenModal(id)}
    >
      {/* Row 1: name + freq badge + value */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`status-dot ${dotClass(signal)}`} />
          <span className="font-semibold text-sm text-on-surface">{name}</span>
          <span className="px-1.5 py-0.5 bg-surface-variant text-on-surface-variant text-[10px] rounded uppercase tracking-wider">
            {FREQ_LABEL[freq] ?? freq}
          </span>
          {manualEntry && (
            <span className="px-1.5 py-0.5 bg-surface-container-high text-primary text-[10px] rounded uppercase tracking-wider">nhập tay</span>
          )}
          {isNew(latest.date, freq, latestUpdateDate) && (
            <span className="px-1.5 py-0.5 bg-primary-container text-on-primary-container text-[10px] rounded uppercase tracking-wider font-bold">MỚI</span>
          )}
        </div>
        <div className="font-data-number text-lg text-on-surface ml-2 shrink-0">
          {latest.displayValue ?? (latest.value?.toString() ?? '—')}
        </div>
      </div>

      {/* Row 2: Sparkline + W/M/YTD/YoY */}
      <div className="flex items-center justify-between mt-1">
        <div className="w-[80px] h-[24px]">
          <Sparkline data={sparkData} signal={signal} width={80} height={24} />
        </div>
        <div className="flex gap-3 text-xs font-data-number">
          {cmpItems.map(({ label, val }) => val ? (
            <div key={label} className="flex flex-col items-end">
              <span className="text-on-surface-variant text-[10px] font-normal">{label}</span>
              <span className={
                val.startsWith('+') || val.startsWith('↑') || val.startsWith('tốt') ? 'text-secondary' :
                val.startsWith('−') || val.startsWith('-') || val.startsWith('↓') || val.startsWith('xấu') ? 'text-error' :
                'text-on-surface-variant'
              }>{val}</span>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Row 3: Note + date */}
      {latest.note && (
        <div className="text-[10px] text-on-surface-variant flex justify-between mt-1">
          <span className="line-clamp-1 flex-1 mr-2">{latest.note}</span>
          <span className="shrink-0">{formatDate(latest.date)}</span>
        </div>
      )}

      {/* Row 4: Data source websites (horizontal footer) */}
      {sources.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5 mt-1">
          <span className="material-symbols-outlined text-[12px] text-on-surface-variant/70">link</span>
          {sources.map(src => (
            <span
              key={src}
              className="px-1.5 py-0.5 bg-surface-container-high/60 text-on-surface-variant text-[9px] rounded tracking-wide"
            >
              {src}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
