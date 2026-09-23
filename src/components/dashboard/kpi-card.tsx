'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  bgColor?: string
}

export function KpiCard({
  title,
  value,
  change,
  trend = 'neutral',
  subtitle,
  icon: Icon,
  iconColor = 'text-primary',
  bgColor = 'bg-primary/10',
}: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden border border-border/60 bg-card/60 backdrop-blur-md hover:border-border transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div className={cn('p-2 rounded-lg', bgColor)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {(change || subtitle) && (
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              {change && (
                <span
                  className={cn(
                    'font-medium',
                    trend === 'up' && 'text-emerald-500',
                    trend === 'down' && 'text-rose-500',
                    trend === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  {change}
                </span>
              )}
              {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
