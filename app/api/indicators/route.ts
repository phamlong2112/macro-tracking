import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const indicators = await prisma.indicator.findMany({
      select: { id: true, name: true }
    })
    return NextResponse.json(indicators)
  } catch (err) {
    console.error('[GET /api/indicators]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
