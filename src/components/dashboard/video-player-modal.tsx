'use client'

import React, { useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CreativeItem } from '@/lib/mock-data'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'
import { Play, TrendingUp, DollarSign, MousePointer, Eye } from 'lucide-react'

interface VideoPlayerModalProps {
  creative: CreativeItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VideoPlayerModal({ creative, open, onOpenChange }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause()
    }
  }, [open])

  if (!creative) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 border border-border bg-card">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Video or Image Preview */}
          <div className="relative bg-black flex items-center justify-center min-h-[340px] md:min-h-[460px]">
            {creative.videoUrl ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                className="w-full h-full max-h-[500px] object-contain"
                poster={creative.thumbnailUrl || creative.imageUrl}
              >
                <source src={creative.videoUrl} type="video/mp4" />
                Seu navegador não suporta reprodução de vídeo.
              </video>
            ) : creative.imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={creative.imageUrl}
                  alt={creative.name}
                  className="max-h-[450px] w-auto object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground p-6">
                <Play className="h-10 w-10 mb-2 opacity-40" />
                <span className="text-xs">Sem mídia visual disponível</span>
              </div>
            )}
          </div>

          {/* Details & Metrics */}
          <div className="p-6 flex flex-col justify-between overflow-y-auto max-h-[500px]">
            <div>
              <DialogHeader className="text-left space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {creative.isVideo && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                      Vídeo
                    </Badge>
                  )}
                  {creative.badges.map((b, i) => (
                    <Badge key={i} variant="default" className="text-[10px]">
                      {b}
                    </Badge>
                  ))}
                </div>
                <DialogTitle className="text-lg font-bold leading-snug">
                  {creative.title || creative.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground line-clamp-3">
                  {creative.body || 'Sem texto de descrição associado.'}
                </DialogDescription>
              </DialogHeader>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-border/60">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-blue-400" />
                    <span>Investimento</span>
                  </div>
                  <div className="font-semibold text-sm">{formatCurrency(creative.spend)}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span>ROAS</span>
                  </div>
                  <div className="font-semibold text-sm text-emerald-500">
                    {creative.roas > 0 ? `${creative.roas.toFixed(2)}x` : '-'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <MousePointer className="h-3.5 w-3.5 text-purple-400" />
                    <span>CTR / CPC</span>
                  </div>
                  <div className="font-semibold text-xs">
                    {formatPercent(creative.ctr)} • {formatCurrency(creative.cpc)}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    <span>Conversões</span>
                  </div>
                  <div className="font-semibold text-sm">
                    {formatNumber(creative.conversions)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/40 text-[11px] text-muted-foreground">
              ID do Criativo: <span className="font-mono text-[10px]">{creative.id}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
