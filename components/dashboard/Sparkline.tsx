// components/dashboard/Sparkline.tsx
'use client'

interface SparklineProps {
  data: (number | null)[]
  signal: string  // "green" | "amber" | "red"
  width?: number
  height?: number
}

const SIGNAL_COLORS: Record<string, string> = {
  green: '#22c55e',
  amber: '#f0a824',
  red: '#f04b4b',
}

function buildPath(data: number[], w: number, h: number): { line: string; area: string } {
  if (data.length < 2) return { line: '', area: '' }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pad = 2

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return { x, y }
  })

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `M0 ${h} ${line.slice(1)} L${w} ${h} Z`

  return { line, area }
}

export default function Sparkline({ data, signal, width = 80, height = 24 }: SparklineProps) {
  const nums = data.filter((v): v is number => v !== null && !isNaN(Number(v)))
  const color = SIGNAL_COLORS[signal] ?? SIGNAL_COLORS.amber

  if (nums.length < 2) {
    return <div style={{ width, height }} className="opacity-30 flex items-center justify-center text-[8px] text-on-surface-variant">—</div>
  }

  const { line, area } = buildPath(nums, width, height)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="opacity-60"
    >
      {area && (
        <path d={area} fill={color} fillOpacity={0.1} stroke="none" />
      )}
      {line && (
        <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}
