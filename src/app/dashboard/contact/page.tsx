'use client'

import React from 'react'
import { usePortalSettings } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Headphones, MessageCircle, Clock, ShieldCheck, Mail, Sparkles, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const { agencyName, agencyWhatsapp, clientName } = usePortalSettings()
  const cleanPhone = agencyWhatsapp.replace(/\D/g, '')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Headphones className="h-6 w-6 text-primary" />
          Falar com o seu Gestor de Tráfego
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Canal direto de comunicação entre a equipe de {clientName} e os especialistas da {agencyName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Contact Card */}
        <Card className="md:col-span-2 border border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Atendimento e Alinhamentos</CardTitle>
            <CardDescription className="text-xs">
              Precisa tirar dúvidas sobre métricas, solicitar novos testes de criativos ou alinhar investimentos?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Canal Prioritário no WhatsApp</h4>
                  <p className="text-xs text-muted-foreground">
                    Contato rápido com os gestores dedicados da sua conta.
                  </p>
                </div>
              </div>

              {cleanPhone ? (
                <a
                  href={`https://wa.me/${cleanPhone}?text=Olá,%20aqui%20é%20da%20equipe%20${encodeURIComponent(clientName)}%20e%20gostaria%20de%20falar%20sobre%20as%20campanhas.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2"
                >
                  <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs h-10 shadow-md">
                    <MessageCircle className="h-4 w-4" />
                    Iniciar Conversa no WhatsApp
                  </Button>
                </a>
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Número de WhatsApp da agência ainda não cadastrado nas configurações.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  Horário de Atendimento
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Segunda a Sexta, das 09:00 às 18:00 (horário de Brasília).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/40 bg-muted/20 text-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Otimizações Contínuas
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Análise diária dos lances, criativos e orçamentos da sua conta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agency Profile / Trust Card */}
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Equipe Responsável</CardTitle>
            <CardDescription className="text-xs">
              {agencyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Especialistas certificados em Meta Ads</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Acompanhamento antifraude e proteção orçamentária</span>
            </div>
            <div className="flex items-start gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Testes A/B contínuos de criativos e públicos</span>
            </div>

            <div className="pt-4 border-t border-border/40">
              <span className="block text-[11px] text-muted-foreground">
                Cliente Atendido:
              </span>
              <strong className="text-foreground text-xs">{clientName}</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
