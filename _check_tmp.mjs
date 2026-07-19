import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const rows = await prisma.topicWeeklyStatus.findMany({
  where: { weeklyReportId: 'report-2026-07-18' },
  select: { topicId: true, status: true, trend: true, driverNote: true }
})
console.log(JSON.stringify(rows, null, 2))
const ind = await prisma.indicator.findFirst({ where: { name: 'Hang Seng TECH Index (HSTECH)' }, include: { observations: { orderBy: { date: 'asc' } } } })
console.log('HSTECH indicator found:', !!ind)
if (ind) {
  console.log('obs dates:', ind.observations.map(o => o.date.toISOString().slice(0,10) + '=' + o.value))
}
const nd = await prisma.indicator.findFirst({ where: { name: 'Cổ phiếu công nghệ (Nasdaq-100)' }, include: { observations: { orderBy: { date: 'asc' } } } })
console.log('obs dates NDX:', nd.observations.map(o => o.date.toISOString().slice(0,10) + '=' + o.value))
await prisma.$disconnect()
