// components/dashboard/Tab3Context.tsx
'use client'

import DonutCard from './DonutCard'

interface ContextIndicator {
  id: string
  name: string
  freq: string
  observations: {
    displayValue: string | null
    signal: string
    note: string | null
    date: string | Date
  }[]
}

interface TopicWithContext {
  id: string
  code: string
  icon: string
  name: string
  status: string
  counts: { g: number; a: number; r: number }
  contextIndicators: ContextIndicator[]
}

interface Tab3Props {
  topics: TopicWithContext[]
  onOpenModal: (id: string) => void
}

const FREQ_SHORT: Record<string, string> = {
  'Ngày': 'Hàng ngày',
  'Tuần': 'Hàng tuần',
  'Tháng': 'Hàng tháng',
  'Quý': 'Hàng quý',
  'Kỳ họp': 'Kỳ họp',
  'Sự kiện': 'Sự kiện',
  'Kỳ 10 ngày': 'Kỳ 10 ngày',
}

function dotStyle(signal: string) {
  const colors: Record<string, string> = { green: '#22c55e', amber: '#f0a824', red: '#f04b4b' }
  return { backgroundColor: colors[signal] ?? colors.amber }
}

function formatDate(d: string | Date) {
  const date = new Date(d)
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`
}

export default function Tab3Context({ topics, onOpenModal }: Tab3Props) {
  return (
    <div>
      {/* Section Title */}
      <div className="mb-card-gap pb-4 border-b border-surface-variant">
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface uppercase flex items-center gap-3">
          <span className="text-primary-dim">03</span> — BỐI CẢNH &amp; CHỈ TIÊU KHÁC
          <span className="px-3 py-1 rounded-md uppercase tracking-wider font-medium"
            style={{ backgroundColor: '#f0a824', color: '#493100', fontSize: 'medium' }}
          >
            Đang xây
          </span>
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap w-full mt-6">
        {topics.map(topic => (
          <div
            key={topic.id}
            className="rounded-lg flex flex-col hover:border-primary/50 transition-colors"
            style={{ backgroundColor: '#131a2b', border: '1px solid #232d45' }}
          >
            {/* Card Header */}
            <div className="p-4 border-b flex items-center gap-2 rounded-t-lg"
              style={{ borderColor: '#232d45', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <span className="text-xl">{topic.icon}</span>
              <h3 className="font-headline-md text-data-number text-primary-dim">
                {topic.name} — Chỉ tiêu bối cảnh
              </h3>
            </div>

            <div className="p-card-padding flex flex-col gap-6">
              {/* Donut + Legend */}
              <DonutCard g={topic.counts.g} a={topic.counts.a} r={topic.counts.r} />

              {/* Data List */}
              <div className="flex flex-col border rounded-md overflow-hidden"
                style={{ borderColor: '#232d45', backgroundColor: '#0e1320' }}
              >
                {topic.contextIndicators.map((ind, idx) => {
                  const latest = ind.observations[0]
                  if (!latest) return null
                  const isLast = idx === topic.contextIndicators.length - 1

                  return (
                    <div
                      key={ind.id}
                      className={`flex items-center justify-between p-3 row-hover cursor-pointer h-row-height-compact ${!isLast ? 'border-b' : ''}`}
                      style={{ borderColor: '#232d45', borderOpacity: 0.5 }}
                      onClick={() => onOpenModal(ind.id)}
                    >
                      {/* Name + freq */}
                      <div className="flex items-center gap-2 w-1/3">
                        <span className="font-body-md text-sm font-semibold truncate text-on-surface">{ind.name}</span>
                        <span className="font-label-md text-[10px] px-1.5 py-0.5 rounded text-on-surface-variant flex-shrink-0"
                          style={{ backgroundColor: '#04183c' }}
                        >
                          {FREQ_SHORT[ind.freq] ?? ind.freq}
                        </span>
                      </div>

                      {/* Dot + Value */}
                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className="status-dot" style={dotStyle(latest.signal)} />
                        <span className="font-data-number text-sm w-20 text-right text-on-surface truncate">
                          {latest.displayValue ?? '—'}
                        </span>
                      </div>

                      {/* Note */}
                      <div className="w-1/3 text-right">
                        <span className="font-label-md text-xs text-on-surface-variant truncate block w-full" title={latest.note ?? ''}>
                          {latest.note ? `${latest.note.slice(0, 30)}... (${formatDate(latest.date)})` : `(${formatDate(latest.date)})`}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {topic.contextIndicators.length === 0 && (
                  <div className="p-4 text-center text-on-surface-variant text-sm">Chưa có dữ liệu bối cảnh</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
