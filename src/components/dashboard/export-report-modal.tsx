'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react'
import { usePortalSettings } from '@/lib/store'
import { Campaign } from '@/lib/mock-data'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

interface ExportReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaigns: Campaign[]
}

export function ExportReportModal({ open, onOpenChange, campaigns }: ExportReportModalProps) {
  const { clientName, agencyName } = usePortalSettings()

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0)
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0)
  const totalRevenue = campaigns.reduce((acc, c) => acc + (c.purchaseValue || 0), 0)
  const avgRoas = totalSpend > 0 && totalRevenue > 0 ? totalRevenue / totalSpend : 0

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadCSV = () => {
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
    link.setAttribute('download', `relatorio_${clientName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-border bg-card">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Exportar Relatório Executivo
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            Gere uma versão pronta para apresentação com o resumo das métricas de {clientName}.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 space-y-2 rounded-lg bg-muted/40 p-4 border border-border/50 text-xs">
          <div className="flex justify-between py-1 border-b border-border/30">
            <span className="text-muted-foreground">Cliente:</span>
            <span className="font-semibold">{clientName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/30">
            <span className="text-muted-foreground">Gestão:</span>
            <span className="font-semibold">{agencyName}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/30">
            <span className="text-muted-foreground">Total Investido:</span>
            <span className="font-semibold text-foreground">{formatCurrency(totalSpend)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/30">
            <span className="text-muted-foreground">Retorno Total:</span>
            <span className="font-semibold text-emerald-500">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">ROAS Consolidado:</span>
            <span className="font-semibold text-emerald-500">{avgRoas.toFixed(2)}x</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full gap-2 text-xs" onClick={handleDownloadCSV}>
            <Download className="h-4 w-4" /> Baixar Planilha CSV
          </Button>
          <Button className="w-full gap-2 text-xs" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
