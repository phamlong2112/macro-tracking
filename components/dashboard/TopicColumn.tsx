// components/dashboard/TopicColumn.tsx
'use client'

import IndicatorRow from './IndicatorRow'

interface NewsItem {
  id: string
  tone: string
  text: string
}

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

interface Indicator {
  id: string
  name: string
  freq: string
  manualEntry: boolean
  source: string | null
  observations: Observation[]
}

interface TopicColumnProps {
  topic: {
    id: string
    code: string
    icon: string
    name: string
    status: string
    news: NewsItem[]
  }
  indicators: Indicator[]
  onOpenModal: (id: string) => void
  highlighted?: boolean
  latestUpdateDate: string
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pos: { label: 'Tích cực', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  cau: { label: 'Lưu ý', color: '#f0a824', bg: 'rgba(240,168,36,0.1)', border: 'rgba(240,168,36,0.2)' },
  risk: { label: 'Rủi ro', color: '#f04b4b', bg: 'rgba(240,75,75,0.1)', border: 'rgba(240,75,75,0.2)' },
}

const TOPIC_ICONS: Record<string, string> = {
  fx: 'currency_exchange',
  demand: 'memory',
  rates: 'account_balance',
  trade: 'import_export',
  macro: 'monitoring',
  hormuz: 'local_fire_department',
}

export default function TopicColumn({ topic, indicators, onOpenModal, highlighted, latestUpdateDate }: TopicColumnProps) {
  const badge = STATUS_BADGE[topic.status] ?? STATUS_BADGE.cau

  return (
    <div id={`topic-col-${topic.id}`} className="border rounded-xl w-[480px] shrink-0 snap-center flex flex-col h-full shadow-lg shadow-black/20 transition-all duration-500"
      style={{
        backgroundColor: '#131a2b',
        borderColor: highlighted ? '#6c9cff' : '#232d45',
        boxShadow: highlighted ? '0 0 0 3px rgba(108,156,255,0.35), 0 0 24px rgba(108,156,255,0.25)' : undefined,
      }}
    >
      {/* Card Header */}
      <div className="p-5 border-b flex justify-between items-center rounded-t-xl shrink-0"
        style={{ borderColor: '#232d45', backgroundColor: '#182136' }}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {TOPIC_ICONS[topic.id] ?? 'analytics'}
          </span>
          <h3 className="font-headline-md text-xl text-on-surface">{topic.name}</h3>
        </div>
        <span
          className="px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5"
          style={{ color: badge.color, backgroundColor: badge.bg, borderColor: badge.border }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.color }} />
          {badge.label}
        </span>
      </div>

      {/* Data Rows Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {indicators.map(ind => (
          <IndicatorRow key={ind.id} {...ind} onOpenModal={onOpenModal} latestUpdateDate={latestUpdateDate} />
        ))}
      </div>

      {/* News Section Bottom */}
      {topic.news.length > 0 && (
        <div className="mt-auto p-4 border-t shrink-0"
          style={{ borderColor: '#232d45', backgroundColor: 'rgba(11,15,25,0.5)', borderRadius: '0 0 0.75rem 0.75rem' }}
        >
          <h4 className="text-xs font-bold text-on-surface-variant mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">newspaper</span>
            TIN TRỌNG ĐIỂM
          </h4>
          <div className="space-y-3">
            {topic.news.slice(0, 3).map(item => (
              <div key={item.id} className="flex gap-3 items-start group cursor-pointer">
                <div
                  className="w-1 min-h-[32px] rounded-full mt-0.5 shrink-0"
                  style={{ backgroundColor: item.tone === 'pos' ? '#22c55e' : item.tone === 'neg' ? '#f04b4b' : '#f0a824' }}
                />
                <div>
                  <p className="text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
