// app/page.tsx — Server Component: fetches all data from DB
import { prisma } from '@/lib/prisma'
import Dashboard from '@/components/dashboard/Dashboard'

// Revalidate every 5 minutes
export const revalidate = 300

function formatDateVN(d: Date) {
  return `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getUTCMonth() + 1).toString().padStart(2, '0')}/${d.getUTCFullYear()}`
}

async function getData() {
  const latestReport = await prisma.weeklyReport.findFirst({
    orderBy: { weekOf: 'desc' }
  })

  // Ngày cập nhật chung của dashboard = observation mới nhất được đẩy lên hệ thống
  // (không cố định — luôn phản ánh lần sync gần nhất, dùng chung cho header + badge "MỚI")
  const latestObs = await prisma.observation.aggregate({ _max: { date: true } })
  const latestUpdateDate = latestObs._max.date ?? new Date()

  const topics = await prisma.topic.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      indicators: {
        orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
        include: {
          observations: {
            orderBy: { date: 'desc' },
            take: 10 // enough for sparkline
          }
        }
      },
      news: latestReport
        ? { where: { weeklyReportId: latestReport.id } }
        : undefined,
      statuses: latestReport
        ? { where: { weeklyReportId: latestReport.id }, take: 1 }
        : undefined,
    }
  })

  // Enrich topics with counts and status
  const enrichedTopics = topics.map(topic => {
    const coreIndicators = topic.indicators.filter(i => i.category === 'core')
    const coreCounts = coreIndicators.reduce(
      (acc, ind) => {
        const sig = ind.observations[0]?.signal ?? 'amber'
        if (sig === 'green') acc.g++
        else if (sig === 'amber') acc.a++
        else acc.r++
        return acc
      },
      { g: 0, a: 0, r: 0 }
    )

    const topicStatus = topic.statuses?.[0]
    return {
      id: topic.id,
      code: topic.code,
      icon: topic.icon,
      name: topic.name,
      status: topicStatus?.status ?? 'cau',
      trend: topicStatus?.trend ?? 'flat',
      driverNote: topicStatus?.driverNote ?? null,
      counts: coreCounts,
      news: (topic.news ?? []).map(n => ({ id: n.id, tone: n.tone, text: n.text })),
      indicators: topic.indicators.map(ind => ({
        id: ind.id,
        name: ind.name,
        freq: ind.freq,
        manualEntry: ind.manualEntry,
        category: ind.category,
        source: ind.source,
        definition: ind.definition,
        thresholdText: ind.thresholdText,
        pnlChannel: ind.pnlChannel,
        observations: ind.observations.map(o => ({
          id: o.id,
          date: o.date.toISOString(),
          value: o.value,
          displayValue: o.displayValue,
          signal: o.signal,
          note: o.note,
          cmpW: o.cmpW,
          cmpM: o.cmpM,
          cmpYtd: o.cmpYtd,
          cmpYoy: o.cmpYoy,
        }))
      }))
    }
  })

  return { topics: enrichedTopics, lastUpdated: formatDateVN(latestUpdateDate), latestUpdateDate: latestUpdateDate.toISOString() }
}

export default async function Page() {
  const { topics, lastUpdated, latestUpdateDate } = await getData()
  return <Dashboard topics={topics} lastUpdated={lastUpdated} latestUpdateDate={latestUpdateDate} />
}
