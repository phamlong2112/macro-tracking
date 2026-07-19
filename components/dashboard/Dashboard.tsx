// components/dashboard/Dashboard.tsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import Tab1Overview from './Tab1Overview'
import Tab2Indicators from './Tab2Indicators'
import Tab3Context from './Tab3Context'
import Tab4Library from './Tab4Library'
import IndicatorModal from './IndicatorModal'

// Types shared across tabs
interface TopicSummary {
  id: string
  code: string
  icon: string
  name: string
  status: string
  trend: string
  driverNote: string | null
  counts: { g: number; a: number; r: number }
  news: { id: string; tone: string; text: string }[]
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
  category: string
  source: string | null
  definition: string | null
  thresholdText: string | null
  pnlChannel: string | null
  observations: Observation[]
}

interface TopicFull extends TopicSummary {
  indicators: Indicator[]
}

interface DashboardProps {
  topics: TopicFull[]
  lastUpdated: string
  latestUpdateDate: string
}

export default function Dashboard({ topics, lastUpdated, latestUpdateDate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [modalId, setModalId] = useState<string | null>(null)
  const [focusTopicId, setFocusTopicId] = useState<string | null>(null)

  // Split indicators by category for Tab2 (core) and Tab3 (context)
  const safeTopics = Array.isArray(topics) ? topics : []
  const tab2Topics = safeTopics.map(t => ({
    ...t,
    indicators: t.indicators.filter(i => i.category === 'core')
  }))

  const tab3Topics = safeTopics.map(t => {
    const contextInds = t.indicators.filter(i => i.category === 'context')
    const contextCounts = contextInds.reduce(
      (acc, ind) => {
        const sig = ind.observations[0]?.signal ?? 'amber'
        if (sig === 'green') acc.g++
        else if (sig === 'amber') acc.a++
        else acc.r++
        return acc
      },
      { g: 0, a: 0, r: 0 }
    )
    return {
      ...t,
      counts: contextCounts,
      contextIndicators: contextInds
    }
  })

  // Tab4: thư viện chỉ số — toàn bộ chỉ số (core + context), không lọc
  const tab4Topics = safeTopics.map(t => ({
    id: t.id,
    code: t.code,
    icon: t.icon,
    name: t.name,
    indicators: t.indicators
  }))

  // Clicking a topic card in Tab1 → switch to Tab2 and scroll/highlight that column
  function handleTopicClick(topicId: string) {
    setActiveTab(1)
    setFocusTopicId(topicId)
    // Clear after the highlight has had time to play; Tab2Indicators captures the
    // scroll target on mount independently, so this only controls the glow fade-out.
    setTimeout(() => setFocusTopicId(null), 1600)
  }

  // Header offset: 72px header + ~36px ribbon when visible ≈ ~112px
  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} lastUpdated={lastUpdated} />

      <div className="flex flex-1 pt-[112px] h-screen overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-fixed-dim/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-error-dim/5 rounded-full blur-[120px]" />
        </div>

        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-10 relative z-10">
          <div className="w-full max-w-[1720px] mx-auto relative flex flex-col gap-section-gap pb-12">
            {activeTab === 0 && (
              <Tab1Overview topics={topics} onTopicClick={handleTopicClick} />
            )}

            {activeTab === 1 && (
              <Tab2Indicators topics={tab2Topics} onOpenModal={setModalId} focusTopicId={focusTopicId} latestUpdateDate={latestUpdateDate} />
            )}

            {activeTab === 2 && (
              <Tab3Context topics={tab3Topics} onOpenModal={setModalId} />
            )}

            {activeTab === 3 && (
              <Tab4Library topics={tab4Topics} />
            )}

            {activeTab === 4 && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-30">settings</span>
                <p className="text-lg">Trang Cài đặt — đang phát triển</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="w-full mt-12 bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center px-card-padding py-6 text-on-surface-variant font-label-md text-label-md opacity-80">
            <span>© 2026 Macro Weekly Dashboard. High-Signal Clarity System. Tập đoàn FPT.</span>
            <div className="flex gap-8">
              <a className="hover:text-primary-dim transition-colors" href="#">Điều khoản</a>
              <a className="hover:text-primary-dim transition-colors" href="#">Bảo mật</a>
              <a className="hover:text-primary-dim transition-colors" href="#">Hỗ trợ</a>
            </div>
          </footer>
        </main>
      </div>

      {/* Bottom Nav (mobile) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modal */}
      <IndicatorModal indicatorId={modalId} onClose={() => setModalId(null)} />
    </>
  )
}
