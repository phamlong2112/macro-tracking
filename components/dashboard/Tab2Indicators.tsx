// components/dashboard/Tab2Indicators.tsx
'use client'

import { useEffect, useRef } from 'react'
import TopicColumn from './TopicColumn'

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

interface NewsItem {
  id: string
  tone: string
  text: string
}

interface TopicWithIndicators {
  id: string
  code: string
  icon: string
  name: string
  status: string
  news: NewsItem[]
  indicators: Indicator[]
}

interface Tab2Props {
  topics: TopicWithIndicators[]
  onOpenModal: (id: string) => void
  focusTopicId?: string | null
  latestUpdateDate: string
}

export default function Tab2Indicators({ topics, onOpenModal, focusTopicId, latestUpdateDate }: Tab2Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  // On mount, if we arrived here via a topic-card click (focusTopicId set), scroll that
  // column into view — this component fully remounts each time the user navigates back
  // to this tab, so an empty dep array correctly captures "just now clicked" only.
  useEffect(() => {
    if (!focusTopicId) return
    document.getElementById(`topic-col-${focusTopicId}`)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Page Header */}
      <div className="mb-6 shrink-0">
        <div className="flex justify-between items-end">
          <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface uppercase flex items-center gap-3">
            <span className="text-primary-dim">02</span> — CHỈ TIÊU THEO DÕI
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-480)}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant border border-surface-variant flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={() => scrollBy(480)}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant border border-surface-variant flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-surface-variant mt-4" />
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto horizontal-scroll pb-4 snap-x snap-mandatory flex gap-6"
      >
        {topics.map(topic => (
          <TopicColumn
            key={topic.id}
            topic={topic}
            indicators={topic.indicators}
            onOpenModal={onOpenModal}
            highlighted={topic.id === focusTopicId}
            latestUpdateDate={latestUpdateDate}
          />
        ))}
      </div>
    </div>
  )
}
