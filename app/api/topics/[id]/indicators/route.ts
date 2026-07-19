// app/api/topics/[id]/indicators/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const indicators = await prisma.indicator.findMany({
      where: { topicId: id },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      include: {
        observations: {
          orderBy: { date: 'desc' },
          take: 10  // latest 10 for sparkline
        }
      }
    })

    return NextResponse.json(indicators)
  } catch (err) {
    console.error('[GET /api/topics/:id/indicators]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
