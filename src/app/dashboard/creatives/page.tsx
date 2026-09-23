'use client'

import React, { useState, useEffect } from 'react'
import { usePortalSettings } from '@/lib/store'
import { CreativeItem } from '@/lib/mock-data'
import { VideoPlayerModal } from '@/components/dashboard/video-player-modal'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Film,
  Play,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  MousePointer,
  RotateCw,
  Sparkles,
} from 'lucide-react'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'

export default function CreativesPage() {
  const { fbAccessToken, fbAdAccountId, datePreset } = usePortalSettings()
  const [creatives, setCreatives] = useState<CreativeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL')

  const fetchCreatives = async () => {
    setLoading(true)
    try {
      const url = new URL('/api/facebook/creatives', window.location.origin)
      if (fbAccessToken) url.searchParams.set('accessToken', fbAccessToken)
      if (fbAdAccountId) url.searchParams.set('adAccountId', fbAdAccountId)
      if (datePreset) url.searchParams.set('datePreset', datePreset)

      const res = await fetch(url.toString())
      if (res.ok) {
        const data = await res.json()
        setCreatives(data.creatives || [])
      }
    } catch (err) {
      console.error('Erro ao buscar criativos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreatives()
  }, [fbAccessToken, fbAdAccountId, datePreset])

  const filteredCreatives = creatives.filter((cr) => {
    const matchesSearch =
      cr.name.toLowerCase().includes(search.toLowerCase()) ||
      cr.title.toLowerCase().includes(search.toLowerCase()) ||
      cr.body.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      mediaFilter === 'ALL' ||
      (mediaFilter === 'VIDEO' && cr.isVideo) ||
      (mediaFilter === 'IMAGE' && !cr.isVideo)

    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            Galeria de Criativos & Vídeos
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Clique em qualquer peça para assistir ao vídeo, revisar a copy e conferir as métricas detalhadas.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCreatives}
          disabled={loading}
          className="h-8 gap-1.5 text-xs self-start sm:self-auto"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recarregar Criativos
        </Button>
      </div>

      {/* Filters and Search Bar */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por anúncio, título ou copy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-background/50 border-border/60"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Formato:
              </span>
              <Button
                size="sm"
                variant={mediaFilter === 'ALL' ? 'default' : 'ghost'}
                className="h-8 text-xs px-2.5"
                onClick={() => setMediaFilter('ALL')}
              >
                Todos ({creatives.length})
              </Button>
              <Button
                size="sm"
                variant={mediaFilter === 'VIDEO' ? 'default' : 'ghost'}
                className="h-8 text-xs px-2.5"
                onClick={() => setMediaFilter('VIDEO')}
              >
                Vídeos ({creatives.filter((c) => c.isVideo).length})
              </Button>
              <Button
                size="sm"
                variant={mediaFilter === 'IMAGE' ? 'default' : 'ghost'}
                className="h-8 text-xs px-2.5"
                onClick={() => setMediaFilter('IMAGE')}
              >
                Imagens ({creatives.filter((c) => !c.isVideo).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid of Creatives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCreatives.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhum criativo encontrado com os filtros aplicados.
          </div>
        ) : (
          filteredCreatives.map((cr) => (
            <Card
              key={cr.id}
              onClick={() => {
                setSelectedCreative(cr)
                setVideoModalOpen(true)
              }}
              className="group cursor-pointer overflow-hidden border border-border/60 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Media Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950 flex items-center justify-center">
                  <img
                    src={cr.thumbnailUrl || cr.imageUrl}
                    alt={cr.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {cr.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-950 shadow-md group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 fill-neutral-950 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Badges on preview */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {cr.isVideo && (
                      <Badge variant="outline" className="bg-black/60 backdrop-blur-sm text-white border-white/20 text-[9px]">
                        Vídeo
                      </Badge>
                    )}
                    {cr.badges.map((b, i) => (
                      <Badge key={i} variant="default" className="text-[9px] shadow">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 space-y-1.5">
                  <h3 className="font-semibold text-xs leading-snug line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                    {cr.title || cr.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {cr.body || 'Sem texto de descrição.'}
                  </p>
                </div>
              </div>

              {/* Metrics footer */}
              <div className="p-4 pt-2 border-t border-border/40 grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <DollarSign className="h-3 w-3 text-blue-400" />
                  <span>{formatCurrency(cr.spend)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="font-medium text-emerald-500">
                    {cr.roas > 0 ? `${cr.roas.toFixed(2)}x ROAS` : `${cr.conversions} conv.`}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Video Modal Player */}
      <VideoPlayerModal
        creative={selectedCreative}
        open={videoModalOpen}
        onOpenChange={setVideoModalOpen}
      />
    </div>
  )
}
