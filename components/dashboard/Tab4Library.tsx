// components/dashboard/Tab4Library.tsx
'use client'

import { useState } from 'react'

interface LibraryIndicator {
  id: string
  name: string
  freq: string
  category: string
  source: string | null
  definition: string | null
  thresholdText: string | null
  pnlChannel: string | null
}

interface LibraryTopic {
  id: string
  code: string
  icon: string
  name: string
  indicators: LibraryIndicator[]
}

interface Tab4LibraryProps {
  topics: LibraryTopic[]
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

const CATEGORY_LABEL: Record<string, { label: string; className: string }> = {
  core: { label: 'Core', className: 'bg-primary-container/20 text-primary' },
  context: { label: 'Bối cảnh', className: 'bg-surface-variant text-on-surface-variant' },
}

export default function Tab4Library({ topics }: Tab4LibraryProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalIndicators = topics.reduce((acc, t) => acc + t.indicators.length, 0)

  return (
    <section>
      {/* Section Header */}
      <div className="mb-card-gap pb-4 border-b border-surface-variant">
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface uppercase flex items-center gap-3">
          <span className="text-primary-dim">04</span> — THƯ VIỆN CHỈ SỐ
        </h2>
        <p className="text-sm text-on-surface-variant mt-2">
          Danh mục {totalIndicators} chỉ số đang theo dõi — bấm vào từng chỉ số để xem cách theo dõi, cách phân tích và nguồn dữ liệu.
        </p>
      </div>

      {/* Topic Groups */}
      <div className="flex flex-col gap-8 mt-6">
        {topics.map(topic => (
          <div key={topic.id}>
            <h3 className="font-headline-md text-lg text-on-surface flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-dim text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {topic.icon}
              </span>
              {topic.name}
              <span className="text-xs text-on-surface-variant font-normal">({topic.indicators.length} chỉ số)</span>
            </h3>

            <div className="flex flex-col gap-2">
              {topic.indicators.map(ind => {
                const isOpen = openIds.has(ind.id)
                const sources = ind.source ? ind.source.split(',').map(s => s.trim()).filter(Boolean) : []
                const cat = CATEGORY_LABEL[ind.category] ?? CATEGORY_LABEL.context
                const hasDetail = ind.definition || ind.thresholdText || ind.pnlChannel || sources.length > 0

                return (
                  <div
                    key={ind.id}
                    className="rounded-lg border border-surface-variant overflow-hidden"
                    style={{ backgroundColor: '#131a2b' }}
                  >
                    {/* Card header (click to toggle) */}
                    <button
                      onClick={() => toggle(ind.id)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer hover:bg-surface-bright/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-semibold text-sm text-on-surface truncate">{ind.name}</span>
                        <span className={`px-1.5 py-0.5 text-[10px] rounded uppercase tracking-wider shrink-0 ${cat.className}`}>
                          {cat.label}
                        </span>
                        <span className="px-1.5 py-0.5 bg-surface-variant text-on-surface-variant text-[10px] rounded uppercase tracking-wider shrink-0">
                          {FREQ_LABEL[ind.freq] ?? ind.freq}
                        </span>
                      </div>
                      <span className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-surface-variant/50 flex flex-col gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            Theo dõi
                          </span>
                          <p className="text-sm text-on-surface mt-1 leading-relaxed">
                            {ind.definition ?? 'Chưa có mô tả cho chỉ số này.'}
                          </p>
                        </div>

                        {(ind.thresholdText || ind.pnlChannel) && (
                          <div>
                            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">insights</span>
                              Cách phân tích
                            </span>
                            {ind.thresholdText && (
                              <p className="text-sm text-on-surface mt-1 leading-relaxed">{ind.thresholdText}</p>
                            )}
                            {ind.pnlChannel && (
                              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                                Kênh ảnh hưởng P&amp;L: {ind.pnlChannel}
                              </p>
                            )}
                          </div>
                        )}

                        <div>
                          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">link</span>
                            Nguồn dữ liệu
                          </span>
                          {sources.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                              {sources.map(src => (
                                <span
                                  key={src}
                                  className="px-1.5 py-0.5 bg-surface-container-high/60 text-on-surface-variant text-[10px] rounded tracking-wide"
                                >
                                  {src}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-on-surface-variant mt-1 italic">Chưa gắn nguồn.</p>
                          )}
                        </div>

                        {!hasDetail && (
                          <p className="text-sm text-on-surface-variant italic">Chưa có thông tin chi tiết cho chỉ số này.</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {topic.indicators.length === 0 && (
                <div className="p-4 text-center text-on-surface-variant text-sm rounded-lg border border-surface-variant" style={{ backgroundColor: '#131a2b' }}>
                  Chưa có chỉ số nào trong chủ đề này.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
