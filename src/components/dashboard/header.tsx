'use client'

import React from 'react'
import Link from 'next/link'
import { usePortalSettings } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Layers,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export function Header() {
  const {
    clientName,
    agencyName,
    agencyWhatsapp,
    datePreset,
    setDatePreset,
    hasFbKeys,
  } = usePortalSettings()

  const isLive = hasFbKeys()

  const presets = [
    { label: 'Hoje', value: 'today' },
    { label: 'Ontem', value: 'yesterday' },
    { label: 'Últimos 7 dias', value: 'last_7d' },
    { label: 'Últimos 14 dias', value: 'last_14d' },
    { label: 'Últimos 30 dias', value: 'last_30d' },
    { label: 'Este Mês', value: 'this_month' },
    { label: 'Todo o Período', value: 'maximum' },
  ]

  const cleanPhone = agencyWhatsapp.replace(/\D/g, '')

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-8 backdrop-blur-md">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-foreground md:text-base">
              {clientName}
            </h1>
            <Badge
              variant="outline"
              className={
                isLive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]'
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px]'
              }
            >
              {isLive ? (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Meta Ads Conectado
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  Demonstração Ativa
                </span>
              )}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Gerenciado por <span className="font-medium text-foreground/80">{agencyName}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Preset Selector */}
        <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
          >
            {presets.map((p) => (
              <option key={p.value} value={p.value} className="bg-card text-foreground">
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* WhatsApp Support Button */}
        {cleanPhone && (
          <a
            href={`https://wa.me/${cleanPhone}?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20o%20dashboard%20de%20tráfego.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hidden md:flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Falar com o Gestor
            </Button>
          </a>
        )}

        {/* Settings button for the media buyer */}
        <Link href="/dashboard/settings">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Configurações de Conexão">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
