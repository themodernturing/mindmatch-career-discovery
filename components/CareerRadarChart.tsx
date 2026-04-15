import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// RIASEC colors per dimension
const DIMENSION_COLORS: Record<string, string> = {
  'Hands-On':       '#10b981', // emerald
  'Analytical':     '#3b82f6', // blue
  'Creative':       '#a855f7', // purple
  'People-Oriented':'#eab308', // yellow
  'Leadership':     '#ef4444', // red
  'Organised':      '#94a3b8', // slate
}

interface CareerRadarChartProps {
  data: { subject: string; score: number; fullMark: number }[]
}

// Custom tick that renders label + score, colored per dimension
function CustomTick({ x, y, payload, cx, cy }: { x?: number; y?: number; payload?: { value: string }; cx?: number; cy?: number }) {
  if (!payload || x === undefined || y === undefined || cx === undefined || cy === undefined) return null

  const label = payload.value
  const color = DIMENSION_COLORS[label] ?? '#64748b'

  // Push label outward slightly from center
  const dx = (x - cx) * 0.12
  const dy = (y - cy) * 0.12

  return (
    <text
      x={x + dx}
      y={y + dy}
      textAnchor="middle"
      dominantBaseline="middle"
      fill={color}
      fontSize={11}
      fontWeight={700}
    >
      {label}
    </text>
  )
}

export function CareerRadarChart({ data }: CareerRadarChartProps) {
  return (
    <div className="w-full h-[320px] mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={(props) => <CustomTick {...props} />}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#cbd5e1', fontSize: 9 }}
            tickCount={5}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              backgroundColor: 'white',
              fontSize: '13px',
            }}
          />
          <Radar
            name="Your Profile"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="#3b82f6"
            fillOpacity={0.15}
            dot={(props: { cx: number; cy: number; payload: { subject: string } }) => {
              const color = DIMENSION_COLORS[props.payload?.subject] ?? '#3b82f6'
              return (
                <circle
                  key={`dot-${props.cx}-${props.cy}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill={color}
                  stroke="white"
                  strokeWidth={2}
                />
              )
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
