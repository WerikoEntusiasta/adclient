'use client'

import React, { useState, useEffect } from 'react'
import { usePortalSettings } from '@/lib/store'
import { Campaign } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, Layers, DollarSign, TrendingUp, Target, RotateCw } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

export default function CampaignsPage() {
  const { fbAccessToken, fbAdAccountId, datePreset } = usePortalSettings()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED'>('ALL')

  const fetchCampaigns = async () => {
    setLoading(true)
    try {
      const url = new URL('/api/facebook/campaigns', window.location.origin)
      if (fbAccessToken) url.searchParams.set('accessToken', fbAccessToken)
      if (fbAdAccountId) url.searchParams.set('adAccountId', fbAdAccountId)
      if (datePreset) url.searchParams.set('datePreset', datePreset)

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data.campaigns || [])
      }
    } catch (err) {
      console.error('Erro ao buscar campanhas:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [fbAccessToken, fbAdAccountId, datePreset])

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && c.status === 'ACTIVE') ||
      (statusFilter === 'PAUSED' && c.status === 'PAUSED')
    return matchesSearch && matchesStatus
  })

  const totalFilteredSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0)
  const totalFilteredConv = filteredCampaigns.reduce((acc, c) => acc + c.conversions, 0)
  const totalFilteredRev = filteredCampaigns.reduce((acc, c) => acc + (c.purchaseValue || 0), 0)
  const avgFilteredRoas = totalFilteredSpend > 0 && totalFilteredRev > 0 ? totalFilteredRev / totalFilteredSpend : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Campanhas em Execução
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Visualize o desempenho e custos de cada campanha de tráfego ativa na conta.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCampaigns}
          disabled={loading}
          className="h-8 gap-1.5 text-xs self-start sm:self-auto"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recarregar Dados
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card/40">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Total em Exibição
          </span>
          <div className="text-xl font-bold mt-1 text-foreground">
            {formatCurrency(totalFilteredSpend)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/40">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Resultados Obtidos
          </span>
          <div className="text-xl font-bold mt-1 text-foreground">
            {formatNumber(totalFilteredConv)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/40">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Receita Rastreável
          </span>
          <div className="text-xl font-bold mt-1 text-emerald-500">
            {formatCurrency(totalFilteredRev)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/40">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            ROAS Médio
          </span>
          <div className="text-xl font-bold mt-1 text-emerald-500">
            {avgFilteredRoas > 0 ? `${avgFilteredRoas.toFixed(2)}x` : '-'}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar campanha pelo nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/50 border-border/60"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Filtrar:
              </span>
              <Button
                size="sm"
                variant={statusFilter === 'ALL' ? 'default' : 'ghost'}
                className="h-8 text-xs px-2.5"
                onClick={() => setStatusFilter('ALL')}
              >
                Todas ({campaigns.length})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'ACTIVE' ? 'default' : 'ghost'}
                className="h-8 text-xs px-2.5"
                onClick={() => setStatusFilter('ACTIVE')}
              >
                Ativas ({campaigns.filter((c) => c.status === 'ACTIVE').length})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === 'PAUSED' ? 'default' : 'ghost'}
                className="h-8 text-xs px-2.5"
                onClick={() => setStatusFilter('PAUSED')}
              >
                Pausadas ({campaigns.filter((c) => c.status === 'PAUSED').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 font-semibold">Campanha</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold">Orçamento</th>
                  <th className="py-3 px-3 font-semibold text-right">Investimento</th>
                  <th className="py-3 px-3 font-semibold text-right">Cliques (CTR)</th>
                  <th className="py-3 px-3 font-semibold text-right">CPC Médio</th>
                  <th className="py-3 px-3 font-semibold text-right">Resultados</th>
                  <th className="py-3 px-3 font-semibold text-right">CPA</th>
                  <th className="py-3 px-4 font-semibold text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground">
                      Nenhuma campanha encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium max-w-[240px]">
                        <div className="truncate font-semibold text-foreground" title={camp.name}>
                          {camp.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          ID: {camp.id} • {camp.objective}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          variant="outline"
                          className={
                            camp.status === 'ACTIVE'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]'
                              : 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400 text-[10px]'
                          }
                        >
                          {camp.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-muted-foreground">
                        {camp.dailyBudget ? `${formatCurrency(camp.dailyBudget)}/dia` : 'Conjunto'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium text-foreground">
                        {formatCurrency(camp.spend)}
                      </td>
                      <td className="py-3.5 px-3 text-right text-muted-foreground">
                        {formatNumber(camp.clicks)}
                        <span className="text-[10px] block text-muted-foreground/70">
                          {formatPercent(camp.ctr)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right text-muted-foreground">
                        {camp.cpc > 0 ? formatCurrency(camp.cpc) : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-foreground">
                        {formatNumber(camp.conversions)}
                        <span className="text-[10px] block text-muted-foreground font-normal">
                          {camp.resultLabel || 'conv.'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right text-muted-foreground">
                        {camp.cpa > 0 ? formatCurrency(camp.cpa) : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-500">
                        {camp.roas > 0 ? `${camp.roas.toFixed(2)}x` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
