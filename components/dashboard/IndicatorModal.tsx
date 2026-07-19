// components/dashboard/IndicatorModal.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

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

interface IndicatorDetail {
  id: string
  name: string
  freq: string
  manualEntry: boolean
  definition: string | null
  thresholdText: string | null
  pnlChannel: string | null
  markValue: number | null
  topic: { id: string; name: string; icon: string }
  observations: Observation[]
}

interface IndicatorModalProps {
  indicatorId: string | null
  onClose: () => void
}

const SIGNAL_COLORS = { green: '#22c55e', amber: '#f0a824', red: '#f04b4b' }

export default function IndicatorModal({ indicatorId, onClose }: IndicatorModalProps) {
  const [data, setData] = useState<IndicatorDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!indicatorId) return
    setLoading(true)
    fetch(`/api/indicators/${indicatorId}`)
      .then(r => r.json())
      .then(d => { 
        if (d.error || !d.observations) setData(null)
        else setData(d)
        setLoading(false) 
      })
      .catch(() => { setData(null); setLoading(false) })
  }, [indicatorId])

  useEffect(() => {
    if (!data || !chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
      chartInstance.current = null
    }

    const obs = data.observations.filter(o => o.value !== null)
    if (obs.length < 2) return

    const latest = obs[obs.length - 1]
    const signalColor = SIGNAL_COLORS[latest?.signal as keyof typeof SIGNAL_COLORS] ?? SIGNAL_COLORS.amber

    const labels = obs.map(o => {
      const d = new Date(o.date)
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`
    })

    const datasets: any[] = [{
      data: obs.map(o => o.value),
      borderColor: signalColor,
      backgroundColor: signalColor + '15',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: true,
      tension: 0.3,
    }]

    // Threshold annotation line
    if (data.markValue !== null) {
      datasets.push({
        data: obs.map(() => data.markValue),
        borderColor: '#5f74a9',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0,
        label: `Ngưỡng ${data.markValue}`,
      })
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#131a2b',
            titleColor: '#a8b3c7',
            bodyColor: '#e7ebf3',
            borderColor: '#232d45',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            ticks: { color: '#a8b3c7', font: { size: 11 }, maxTicksLimit: 8 },
            grid: { color: '#232d45' },
          },
          y: {
            ticks: { color: '#a8b3c7', font: { size: 11 } },
            grid: { color: '#232d45' },
          }
        }
      }
    })

    return () => { chartInstance.current?.destroy() }
  }, [data])

  if (!indicatorId) return null

  const latest = data?.observations?.slice().reverse().find(o => o !== undefined)
  const signal = latest?.signal ?? 'amber'
  const dotClass = signal === 'green' ? 'dot-green' : signal === 'red' ? 'dot-red' : 'dot-amber'

  const cmpItems = [
    { label: 'Tuần', val: latest?.cmpW },
    { label: 'Tháng', val: latest?.cmpM },
    { label: 'YTD', val: latest?.cmpYtd },
    { label: 'YoY', val: latest?.cmpYoy },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-5xl bg-surface border border-surface-variant rounded-xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header (Block A) */}
        <div className="flex items-start justify-between p-6 border-b border-surface-variant shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`status-dot ${dotClass}`} />
              <h2 className="text-3xl font-bold text-primary font-headline-lg">
                {loading ? '...' : data?.name}
              </h2>
            </div>
            {data && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-label-md text-[13px] text-on-surface-variant">{data.topic.icon} {data.topic.name}</span>
                <span className="px-2 py-0.5 bg-surface-variant text-on-surface-variant text-[11px] rounded uppercase tracking-wider">
                  {data.freq}
                </span>
                {data.manualEntry && (
                  <span className="px-2 py-0.5 bg-primary-container/20 text-primary text-[11px] rounded uppercase tracking-wider">nhập tay</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-surface-bright/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
          </div>
        ) : data ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left col: Chart + Comparisons */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Block B: Chart */}
                <div className="bg-surface-dim rounded-xl p-4 border border-surface-variant" style={{ height: 320 }}>
                  <canvas ref={chartRef} />
                </div>

                {/* Block C: Comparisons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cmpItems.map(({ label, val }) => (
                    <div key={label} className="bg-surface-container rounded-lg p-4 border border-surface-variant text-center">
                      <div className="text-[11px] text-on-surface-variant font-label-md mb-1 uppercase tracking-wider">{label}</div>
                      <div className={`font-data-number text-lg font-bold ${
                        !val || val === '—' ? 'text-on-surface-variant' :
                        (val.startsWith('+') || val.startsWith('↑') ? 'text-secondary' :
                        val.startsWith('−') || val.startsWith('-') || val.startsWith('↓') ? 'text-error' :
                        'text-on-surface')
                      }`}>
                        {val ?? '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right col: Interpretation + Definition */}
              <div className="flex flex-col gap-4">
                {/* Block D: Diễn giải */}
                {latest?.note && (
                  <div className="bg-surface-container-low rounded-xl p-5 border border-surface-variant">
                    <h4 className="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">insights</span>
                      Diễn giải biến động
                    </h4>
                    <p className="text-sm text-on-surface leading-relaxed">{latest.note}</p>
                  </div>
                )}

                {/* Block E: Giải thích chỉ số */}
                <div className="bg-surface-container-low rounded-xl p-5 border border-surface-variant">
                  <h4 className="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">help_outline</span>
                    Giải thích chỉ số
                  </h4>
                  <div className="space-y-3 text-sm">
                    {data.definition && (
                      <p className="text-on-surface-variant leading-relaxed">{data.definition}</p>
                    )}
                    {data.thresholdText && (
                      <div>
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Ngưỡng cảnh báo</span>
                        <p className="text-on-surface mt-1">{data.thresholdText}</p>
                      </div>
                    )}
                    {data.pnlChannel && (
                      <div>
                        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Kênh ảnh hưởng P&L</span>
                        <p className="text-on-surface mt-1">{data.pnlChannel}</p>
                      </div>
                    )}
                    {!data.definition && !data.thresholdText && !data.pnlChannel && (
                      <p className="text-on-surface-variant italic">Chưa có mô tả cho chỉ số này.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-error">
            Không tải được dữ liệu
          </div>
        )}
      </div>
    </div>
  )
}
