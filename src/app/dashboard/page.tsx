'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { usePortalSettings } from '@/lib/store'
import { Campaign, DailyMetric, CreativeItem } from '@/lib/mock-data'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ExportReportModal } from '@/components/dashboard/export-report-modal'
import { VideoPlayerModal } from '@/components/dashboard/video-player-modal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  MousePointer,
  ArrowRight,
  Sparkles,
  Download,
  Film,
  Play,
  RotateCw,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

export default function DashboardOverviewPage() {
  const { fbAccessToken, fbAdAccountId, datePreset, clientName, agencyName } = usePortalSettings()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric[]>([])
  const [creatives, setCreatives] = useState<CreativeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const campUrl = new URL('/api/facebook/campaigns', window.location.origin)
      if (fbAccessToken) campUrl.searchParams.set('accessToken', fbAccessToken)
      if (fbAdAccountId) campUrl.searchParams.set('adAccountId', fbAdAccountId)
      if (datePreset) campUrl.searchParams.set('datePreset', datePreset)

      const creatUrl = new URL('/api/facebook/creatives', window.location.origin)
      if (fbAccessToken) creatUrl.searchParams.set('accessToken', fbAccessToken)
      if (fbAdAccountId) creatUrl.searchParams.set('adAccountId', fbAdAccountId)
      if (datePreset) creatUrl.searchParams.set('datePreset', datePreset)

      const [cRes, crRes] = await Promise.all([
        fetch(campUrl.toString()),
        fetch(creatUrl.toString()),
      ])

      if (cRes.ok) {
        const cData = await cRes.json()
        setCampaigns(cData.campaigns || [])
        setDailyMetrics(cData.dailyMetrics || [])
        setIsLive(cData.isLive || false)
      }

      if (crRes.ok) {
        const crData = await crRes.json()
        setCreatives(crData.creatives || [])
      }
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [fbAccessToken, fbAdAccountId, datePreset])

  // Aggregated KPIs
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0)
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0)
  const totalRevenue = campaigns.reduce((acc, c) => acc + (c.purchaseValue || 0), 0)
  const avgRoas = totalSpend > 0 && totalRevenue > 0 ? totalRevenue / totalSpend : 0
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0

  // Top 3 Creatives
  const topCreatives = [...creatives]
    .sort((a, b) => b.roas - a.roas || b.conversions - a.conversions)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Painel de Resultados
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Acompanhamento das campanhas ativas de {clientName} geridas pela {agencyName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <Button
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Demo Notification Banner if not connected to live keys */}
      {!isLive && (
        <div className="flex items-center justify-between rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-foreground">
                Exibindo dados em Modo Apresentação
              </span>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Para conectar sua conta real do Meta Ads, acesse a área de configurações e insira o Token e ID da conta.
              </p>
            </div>
          </div>
          <Link href="/dashboard/settings">
            <Button size="sm" variant="outline" className="h-7 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
              Conectar Conta
            </Button>
          </Link>
        </div>
      )}

      {/* Executive KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Investimento Total"
          value={formatCurrency(totalSpend)}
          subtitle="Valor aplicado em anúncios"
          icon={DollarSign}
          iconColor="text-blue-400"
          bgColor="bg-blue-500/10"
        />

        <KpiCard
          title="Retorno / Faturamento"
          value={totalRevenue > 0 ? formatCurrency(totalRevenue) : `${totalConversions} conv.`}
          change={avgRoas > 0 ? `${avgRoas.toFixed(2)}x ROAS` : undefined}
          trend={avgRoas >= 2 ? 'up' : 'neutral'}
          subtitle={totalRevenue > 0 ? 'Receita gerada rastreada' : 'Volume de conversões'}
          icon={TrendingUp}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />

        <KpiCard
          title="Total de Resultados"
          value={formatNumber(totalConversions)}
          subtitle={avgCpa > 0 ? `Custo médio: ${formatCurrency(avgCpa)}` : 'Conversões totais'}
          icon={Target}
          iconColor="text-purple-400"
          bgColor="bg-purple-500/10"
        />

        <KpiCard
          title="Alcance & Cliques"
          value={formatNumber(totalClicks)}
          subtitle={`CTR médio: ${formatPercent(avgCtr)} • CPC: ${formatCurrency(avgCpc)}`}
          icon={MousePointer}
          iconColor="text-amber-400"
          bgColor="bg-amber-500/10"
        />
      </div>

      {/* Main Evolution Chart */}
      <PerformanceChart data={dailyMetrics} />

      {/* Grid: Top Creatives & Campaigns Snapshot */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Video & Creative Highlights */}
        <Card className="lg:col-span-1 border border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                Criativos em Alta
              </CardTitle>
              <CardDescription className="text-xs">
                Peças com melhor eficiência de vendas
              </CardDescription>
            </div>
            <Link href="/dashboard/creatives">
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-primary">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {topCreatives.map((creative) => (
              <div
                key={creative.id}
                onClick={() => {
                  setSelectedCreative(creative)
                  setVideoModalOpen(true)
                }}
                className="group relative flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-2.5 hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-900 flex items-center justify-center">
                  <img
                    src={creative.thumbnailUrl || creative.imageUrl}
                    alt={creative.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {creative.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                    {creative.title || creative.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span>Gasto: {formatCurrency(creative.spend)}</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-medium">
                      {creative.roas > 0 ? `${creative.roas.toFixed(1)}x ROAS` : `${creative.conversions} conv.`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Campaigns Snapshot */}
        <Card className="lg:col-span-2 border border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Campanhas em Execução</CardTitle>
              <CardDescription className="text-xs">
                Desempenho consolidado por linha de campanha
              </CardDescription>
            </div>
            <Link href="/dashboard/campaigns">
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-primary">
                Tabela Completa <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="pb-2.5 font-medium">Campanha</th>
                    <th className="pb-2.5 font-medium">Status</th>
                    <th className="pb-2.5 font-medium text-right">Investimento</th>
                    <th className="pb-2.5 font-medium text-right">Resultados</th>
                    <th className="pb-2.5 font-medium text-right">CPA</th>
                    <th className="pb-2.5 font-medium text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {campaigns.slice(0, 4).map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20">
                      <td className="py-3 font-medium max-w-[200px] truncate text-foreground">
                        {c.name}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={
                            c.status === 'ACTIVE'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]'
                              : 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400 text-[10px]'
                          }
                        >
                          {c.status === 'ACTIVE' ? 'Ativa' : 'Pausada'}
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-medium text-foreground">
                        {formatCurrency(c.spend)}
                      </td>
                      <td className="py-3 text-right text-muted-foreground">
                        {formatNumber(c.conversions)}
                      </td>
                      <td className="py-3 text-right text-muted-foreground">
                        {c.cpa > 0 ? formatCurrency(c.cpa) : '-'}
                      </td>
                      <td className="py-3 text-right font-semibold text-emerald-500">
                        {c.roas > 0 ? `${c.roas.toFixed(2)}x` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ExportReportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        campaigns={campaigns}
      />

      <VideoPlayerModal
        creative={selectedCreative}
        open={videoModalOpen}
        onOpenChange={setVideoModalOpen}
      />
    </div>
  )
}
