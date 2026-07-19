// app/api/topics/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const latestReport = await prisma.weeklyReport.findFirst({
      orderBy: { weekOf: 'desc' }
    })

    const topics = await prisma.topic.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        indicators: {
          where: { category: 'core' },
          orderBy: { sortOrder: 'asc' },
          include: {
            observations: {
              orderBy: { date: 'desc' },
              take: 1
            }
          }
        },
        news: latestReport ? { where: { weeklyReportId: latestReport.id } } : false,
        statuses: latestReport ? {
          where: { weeklyReportId: latestReport.id },
          take: 1
        } : false
      }
    })

    // Enrich with signal counts from latest observations
    const enriched = topics.map(topic => {
      const counts = { g: 0, a: 0, r: 0 }
      topic.indicators.forEach(ind => {
        const sig = ind.observations[0]?.signal ?? 'amber'
        if (sig === 'green') counts.g++
        else if (sig === 'amber') counts.a++
        else counts.r++
      })

      const status = topic.statuses?.[0]
      return {
        id: topic.id,
        code: topic.code,
        icon: topic.icon,
        name: topic.name,
        status: status?.status ?? 'cau',
        trend: status?.trend ?? 'flat',
        driverNote: status?.driverNote ?? null,
        counts,
        news: topic.news ?? []
      }
    })

    return NextResponse.json(enriched)
  } catch (err) {
    console.error('[GET /api/topics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
