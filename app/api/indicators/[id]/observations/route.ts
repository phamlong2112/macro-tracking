// app/api/indicators/[id]/observations/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const obs = await prisma.observation.findMany({
      where: { indicatorId: id },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(obs)
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const obs = await prisma.observation.upsert({
      where: {
        indicatorId_date: {
          indicatorId: id,
          date: new Date(body.date)
        }
      },
      update: {
        value: body.value ?? null,
        displayValue: body.displayValue ?? null,
        signal: body.signal,
        note: body.note ?? null,
        cmpW: body.cmpW ?? null,
        cmpM: body.cmpM ?? null,
        cmpYtd: body.cmpYtd ?? null,
        cmpYoy: body.cmpYoy ?? null,
      },
      create: {
        indicatorId: id,
        date: new Date(body.date),
        value: body.value ?? null,
        displayValue: body.displayValue ?? null,
        signal: body.signal,
        note: body.note ?? null,
        cmpW: body.cmpW ?? null,
        cmpM: body.cmpM ?? null,
        cmpYtd: body.cmpYtd ?? null,
        cmpYoy: body.cmpYoy ?? null,
      }
    })
    return NextResponse.json(obs, { status: 201 })
  } catch (err) {
    console.error('[POST /api/indicators/:id/observations]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
