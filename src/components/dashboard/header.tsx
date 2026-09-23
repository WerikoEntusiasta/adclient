'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePortalSettings, AdAccountSummary } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Layers,
  MessageCircle,
  Settings,
  Sparkles,
  ChevronDown,
  Building2,
  Check,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const {
    clientName,
    agencyName,
    agencyWhatsapp,
    fbAccessToken,
    fbAdAccountId,
    selectedAccountName,
    availableAccounts,
    setAvailableAccounts,
    selectAccount,
    datePreset,
    setDatePreset,
    hasFbKeys,
  } = usePortalSettings()

  const isLive = hasFbKeys()

  // On mount or token change, if availableAccounts is empty or token changed, fetch accounts list
  useEffect(() => {
    async function loadAccounts() {
      try {
        const url = new URL('/api/facebook/accounts', window.location.origin)
        if (fbAccessToken) url.searchParams.set('accessToken', fbAccessToken)
        if (fbAdAccountId) url.searchParams.set('adAccountId', fbAdAccountId)

        const res = await fetch(url.toString())
        if (res.ok) {
          const data = await res.json()
          if (data.accounts && data.accounts.length > 0) {
            setAvailableAccounts(data.accounts)
            // If none selected yet, default to first
            if (!fbAdAccountId) {
              selectAccount(data.accounts[0].id, data.accounts[0].name)
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar lista de contas:', err)
      }
    }

    loadAccounts()
  }, [fbAccessToken])

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
      {/* Branding & Account Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Layers className="h-5 w-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            {/* Account Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 font-bold tracking-tight text-foreground text-sm md:text-base hover:text-primary transition-colors text-left focus:outline-none group">
                  <span className="truncate max-w-[160px] sm:max-w-[240px] md:max-w-[320px]">
                    {selectedAccountName || clientName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-transform" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-72 bg-card border-border p-1.5 shadow-xl">
                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  Contas de Anúncio Disponíveis
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-border/40" />

                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {availableAccounts.length === 0 ? (
                    <div className="p-3 text-xs text-muted-foreground text-center">
                      Nenhuma conta carregada. Insira o token em Configurações.
                    </div>
                  ) : (
                    availableAccounts.map((acc) => {
                      const isSelected = fbAdAccountId === acc.id
                      return (
                        <DropdownMenuItem
                          key={acc.id}
                          onClick={() => selectAccount(acc.id, acc.name)}
                          className={`flex items-start justify-between p-2 rounded-md cursor-pointer text-xs ${
                            isSelected
                              ? 'bg-primary/15 text-primary font-medium'
                              : 'hover:bg-muted/60 text-foreground'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="truncate font-medium">{acc.name}</div>
                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              {acc.id} {acc.currency ? `• ${acc.currency}` : ''}
                            </div>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                        </DropdownMenuItem>
                      )
                    })
                  )}
                </div>

                <DropdownMenuSeparator className="my-1 bg-border/40" />
                <Link href="/dashboard/settings" className="w-full">
                  <DropdownMenuItem className="p-2 text-xs text-primary hover:bg-primary/10 rounded-md cursor-pointer flex items-center gap-1.5 font-medium">
                    <Settings className="h-3.5 w-3.5" />
                    Gerenciar Contas & Conexão
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Connection badge */}
            <Badge
              variant="outline"
              className={
                isLive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] hidden sm:inline-flex'
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] hidden sm:inline-flex'
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
                  Modo Demonstração
                </span>
              )}
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Gestão estratégica por <span className="font-medium text-foreground/80">{agencyName}</span>
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
