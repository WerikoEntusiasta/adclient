'use client'

import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DailyMetric } from '@/lib/mock-data'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface PerformanceChartProps {
  data: DailyMetric[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [metric, setMetric] = useState<'spend_revenue' | 'conversions' | 'clicks'>('spend_revenue')

  const formattedData = data.map((item) => {
    const parts = item.date.split('-')
    const dateFormatted = parts.length === 3 ? `${parts[2]}/${parts[1]}` : item.date
    return {
      ...item,
      dateFormatted,
    }
  })

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Evolução de Desempenho</CardTitle>
          <CardDescription className="text-xs">
            Acompanhe o ritmo diário de investimento, retorno e conversões da sua conta
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/40">
          <Button
            size="sm"
            variant={metric === 'spend_revenue' ? 'default' : 'ghost'}
            className="h-7 text-xs px-2.5"
            onClick={() => setMetric('spend_revenue')}
          >
            Investimento & Retorno
          </Button>
          <Button
            size="sm"
            variant={metric === 'conversions' ? 'default' : 'ghost'}
            className="h-7 text-xs px-2.5"
            onClick={() => setMetric('conversions')}
          >
            Conversões
          </Button>
          <Button
            size="sm"
            variant={metric === 'clicks' ? 'default' : 'ghost'}
            className="h-7 text-xs px-2.5"
            onClick={() => setMetric('clicks')}
          >
            Cliques
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.3 0 0 / 0.3)" />
              <XAxis
                dataKey="dateFormatted"
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#888888"
                fontSize={11}
                tickFormatter={(val) =>
                  metric === 'spend_revenue'
                    ? `R$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`
                    : `${val}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(value: any, name: any) => {
                  if (name === 'spend') return [formatCurrency(Number(value)), 'Investimento']
                  if (name === 'revenue') return [formatCurrency(Number(value)), 'Retorno Estimado']
                  if (name === 'conversions') return [formatNumber(Number(value)), 'Conversões']
                  if (name === 'clicks') return [formatNumber(Number(value)), 'Cliques']
                  return [value, name]
                }}
              />
              {metric === 'spend_revenue' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSpend)"
                    name="spend"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="revenue"
                  />
                </>
              )}
              {metric === 'conversions' && (
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConv)"
                  name="conversions"
                />
              )}
              {metric === 'clicks' && (
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                  name="clicks"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
