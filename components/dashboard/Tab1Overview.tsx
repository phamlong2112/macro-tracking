// components/dashboard/Tab1Overview.tsx
'use client'

import TopicCard from './TopicCard'

interface Observation {
  signal: string
}

interface Indicator {
  category: string
  observations: Observation[]
}

interface TopicSummary {
  id: string
  code: string
  icon: string
  name: string
  status: string
  trend: string
  driverNote: string | null
  counts: { g: number; a: number; r: number }
  indicators: Indicator[]
}

interface Tab1OverviewProps {
  topics: TopicSummary[]
  onTopicClick: (topicId: string) => void
}

// Mức độ nghiêm trọng của tín hiệu, dùng để so sánh lần cập nhật mới nhất với lần trước
const SEVERITY: Record<string, number> = { green: 0, amber: 1, red: 2 }

// Tóm tắt thay đổi tín hiệu của các chỉ số core: so observations[0] (mới nhất) với
// observations[1] (lần trước). Bỏ qua chỉ số chưa có đủ 2 lần quan sát để so sánh.
function computeCoreChangeSummary(topics: TopicSummary[]) {
  let worsened = 0, improved = 0, unchanged = 0, comparable = 0, totalCore = 0
  for (const topic of topics) {
    for (const ind of topic.indicators) {
      if (ind.category !== 'core') continue
      totalCore++
      const [latest, prev] = ind.observations
      if (!latest || !prev) continue
      comparable++
      const a = SEVERITY[latest.signal] ?? 1
      const b = SEVERITY[prev.signal] ?? 1
      if (a > b) worsened++
      else if (a < b) improved++
      else unchanged++
    }
  }
  return { worsened, improved, unchanged, comparable, totalCore }
}

export default function Tab1Overview({ topics, onTopicClick }: Tab1OverviewProps) {
  const { worsened, improved, unchanged, comparable, totalCore } = computeCoreChangeSummary(topics)

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface uppercase flex items-center gap-3">
          <span className="text-primary-dim">01</span> — TỔNG QUAN TÌNH HÌNH
        </h2>
        <div className="h-px bg-surface-variant flex-1 ml-4 shadow-[0_1px_0_rgba(255,255,255,0.02)]" />
      </div>

      {/* Core indicator change summary */}
      {comparable > 0 && (
        <div className="mb-8 rounded-xl border border-surface-variant bg-surface p-4 flex items-center gap-6 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant shrink-0">
            So với lần cập nhật trước
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f04b4b' }} />
            <span className="text-sm text-on-surface"><b>{worsened}</b> chỉ số xấu đi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            <span className="text-sm text-on-surface"><b>{improved}</b> chỉ số cải thiện</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant/40" />
            <span className="text-sm text-on-surface-variant"><b>{unchanged}</b> không đổi</span>
          </div>
          <span className="text-[11px] text-on-surface-variant/60 ml-auto">
            {comparable}/{totalCore} chỉ số core có đủ dữ liệu so sánh
          </span>
        </div>
      )}

      {/* 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-card-gap">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            {...topic}
            onClick={() => onTopicClick(topic.id)}
          />
        ))}
      </div>
    </section>
  )
}
