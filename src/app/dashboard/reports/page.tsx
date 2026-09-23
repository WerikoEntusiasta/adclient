'use client'

import React, { useState, useEffect } from 'react'
import { usePortalSettings } from '@/lib/store'
import { Campaign } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, Download, FileSpreadsheet, CheckCircle, TrendingUp, DollarSign, Target } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

export default function ReportsPage() {
  const { clientName, agencyName, fbAccessToken, fbAdAccountId, datePreset } = usePortalSettings()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
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
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fbAccessToken, fbAdAccountId, datePreset])

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0)
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0)
  const totalRevenue = campaigns.reduce((acc, c) => acc + (c.purchaseValue || 0), 0)
  const avgRoas = totalSpend > 0 && totalRevenue > 0 ? totalRevenue / totalSpend : 0
  const avgCpa = totalConversions > 0 ? totalSpend / totalConversions : 0
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = ['Campanha', 'Status', 'Gasto (R$)', 'Conversões', 'CPA (R$)', 'ROAS', 'Cliques', 'CTR (%)']
    const rows = campaigns.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.status,
      c.spend.toFixed(2),
      c.conversions,
      c.cpa.toFixed(2),
      c.roas.toFixed(2),
      c.clicks,
      c.ctr.toFixed(2),
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `relatorio_executivo_${clientName.toLowerCase().replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            Relatório Executivo
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dossiê de performance pronto para prestação de contas e impressão em PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-8 gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />
            Planilha CSV
          </Button>
          <Button size="sm" onClick={handlePrint} className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90">
            <Printer className="h-3.5 w-3.5" />
            Imprimir / Gerar PDF
          </Button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md print:border-none print:shadow-none print:bg-transparent">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-border/60 pb-6 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Relatório de Tráfego Pago & Performance
              </span>
              <h1 className="text-2xl font-bold text-foreground mt-1">{clientName}</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Estratégia e Operação conduzidas por: <span className="font-semibold text-foreground">{agencyName}</span>
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-muted-foreground">
              <div>Data de Emissão: <span className="font-medium text-foreground">{new Date().toLocaleDateString('pt-BR')}</span></div>
              <div className="mt-1">Filtro de Período: <span className="font-medium text-foreground capitalize">{datePreset}</span></div>
            </div>
          </div>

          {/* Executive Overview Highlight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-[11px] font-medium text-muted-foreground">Investimento Feito</span>
              <div className="text-xl font-bold text-foreground mt-1">{formatCurrency(totalSpend)}</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-[11px] font-medium text-muted-foreground">Receita Rastreada</span>
              <div className="text-xl font-bold text-emerald-500 mt-1">{formatCurrency(totalRevenue)}</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-[11px] font-medium text-muted-foreground">ROAS Global</span>
              <div className="text-xl font-bold text-emerald-500 mt-1">{avgRoas > 0 ? `${avgRoas.toFixed(2)}x` : '-'}</div>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
              <span className="text-[11px] font-medium text-muted-foreground">Total de Conversões</span>
              <div className="text-xl font-bold text-foreground mt-1">{formatNumber(totalConversions)}</div>
            </div>
          </div>

          {/* Manager's Notes & Summary */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed">
            <h4 className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-primary" />
              Parecer Técnico do Gestor de Tráfego
            </h4>
            <p className="text-muted-foreground">
              Durante este ciclo de veiculação, priorizamos a eficiência orçamentária focando nos criativos de maior retenção e público comprador.
              O investimento de <strong className="text-foreground">{formatCurrency(totalSpend)}</strong> gerou um retorno direto estimado de <strong className="text-foreground">{formatCurrency(totalRevenue)}</strong>, mantendo o custo por resultado em níveis altamente competitivos.
            </p>
          </div>

          {/* Campaign Table Breakdown */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Detalhamento das Linhas de Ação</h3>
            <div className="overflow-x-auto rounded-lg border border-border/40">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground border-b border-border/40">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Campanha</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Investimento</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Cliques</th>
                    <th className="py-2.5 px-3 font-semibold text-right">CTR</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Conversões</th>
                    <th className="py-2.5 px-3 font-semibold text-right">CPA</th>
                    <th className="py-2.5 px-3 font-semibold text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {campaigns.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-medium text-foreground">{c.name}</td>
                      <td className="py-2.5 px-3 text-right">{formatCurrency(c.spend)}</td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">{formatNumber(c.clicks)}</td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">{formatPercent(c.ctr)}</td>
                      <td className="py-2.5 px-3 text-right font-semibold">{formatNumber(c.conversions)}</td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">{c.cpa > 0 ? formatCurrency(c.cpa) : '-'}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-500">{c.roas > 0 ? `${c.roas.toFixed(2)}x` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
