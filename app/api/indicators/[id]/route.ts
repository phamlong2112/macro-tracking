// app/api/indicators/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const indicator = await prisma.indicator.findUnique({
      where: { id },
      include: {
        topic: { select: { id: true, name: true, icon: true } },
        observations: {
          orderBy: { date: 'asc' }
        }
      }
    })

    if (!indicator) {
      return NextResponse.json({ error: 'Indicator not found' }, { status: 404 })
    }

    return NextResponse.json(indicator)
  } catch (err) {
    console.error('[GET /api/indicators/:id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const indicator = await prisma.indicator.update({
      where: { id },
      data: {
        name: body.name,
        freq: body.freq,
        unit: body.unit,
        thresholdText: body.thresholdText,
        definition: body.definition,
        pnlChannel: body.pnlChannel,
        markValue: body.markValue ?? undefined,
        source: body.source,
      }
    })

    return NextResponse.json(indicator)
  } catch (err) {
    console.error('[PATCH /api/indicators/:id]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
