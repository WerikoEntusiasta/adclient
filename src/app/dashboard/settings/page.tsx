'use client'

import React, { useState } from 'react'
import { usePortalSettings } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sliders,
  KeyRound,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

export default function SettingsPage() {
  const {
    clientName,
    agencyName,
    agencyWhatsapp,
    fbAccessToken,
    fbAdAccountId,
    setClientBranding,
    setFbKeys,
  } = usePortalSettings()

  const [tokenInput, setTokenInput] = useState(fbAccessToken)
  const [accountInput, setAccountInput] = useState(fbAdAccountId)
  const [clientInput, setClientInput] = useState(clientName)
  const [agencyInput, setAgencyInput] = useState(agencyName)
  const [whatsappInput, setWhatsappInput] = useState(agencyWhatsapp)

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    account?: any
  } | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleTestConnection = async () => {
    if (!tokenInput || !accountInput) {
      setTestResult({
        success: false,
        message: 'Preencha o Token de Acesso e o ID da Conta de Anúncios para testar.',
      })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const url = new URL('/api/facebook/accounts', window.location.origin)
      url.searchParams.set('accessToken', tokenInput)
      url.searchParams.set('adAccountId', accountInput)

      const res = await fetch(url.toString())
      const data = await res.json()

      if (res.ok && data.connected) {
        setTestResult({
          success: true,
          message: `Conexão bem-sucedida! Conta: ${data.account?.name || accountInput} (${data.account?.currency || 'BRL'})`,
          account: data.account,
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Falha ao autenticar com a Meta Graph API.',
        })
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Erro inesperado ao conectar à Meta API.',
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    setClientBranding({
      clientName: clientInput,
      agencyName: agencyInput,
      agencyWhatsapp: whatsappInput,
    })

    setFbKeys({
      fbAccessToken: tokenInput,
      fbAdAccountId: accountInput,
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleResetDemo = () => {
    setTokenInput('')
    setAccountInput('')
    setClientInput('Minha Empresa')
    setAgencyInput('Agência de Performance')
    setWhatsappInput('5511999999999')

    setClientBranding({
      clientName: 'Minha Empresa',
      agencyName: 'Agência de Performance',
      agencyWhatsapp: '5511999999999',
    })
    setFbKeys({
      fbAccessToken: '',
      fbAdAccountId: '',
    })
    setTestResult(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sliders className="h-6 w-6 text-primary" />
          Configurações da Conexão & Identidade
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Conecte a conta do cliente no Meta Ads e personalize os nomes e contatos exibidos no portal.
        </p>
      </div>

      {/* Meta API Connection Card */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Credenciais Meta Ads Graph API</CardTitle>
            </div>
            {fbAccessToken && fbAdAccountId ? (
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
                Chaves Configuradas
              </Badge>
            ) : (
              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs">
                Modo Demonstração
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            As chaves de leitura são mantidas de forma segura no seu navegador para alimentar o dashboard do cliente.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Meta Access Token (Token de Acesso)</Label>
            <Input
              type="password"
              placeholder="Ex: EAAB..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="bg-background/50 text-xs font-mono h-9 border-border/60"
            />
            <p className="text-[11px] text-muted-foreground">
              Token com permissões de leitura (<code className="text-[10px]">ads_read</code>, <code className="text-[10px]">read_insights</code>).
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">ID da Conta de Anúncios (Ad Account ID)</Label>
            <Input
              placeholder="Ex: act_1234567890 ou 1234567890"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="bg-background/50 text-xs font-mono h-9 border-border/60"
            />
          </div>

          {/* Test connection alert */}
          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={testing}
              className="text-xs h-8"
            >
              {testing ? 'Testando Conexão...' : 'Testar Conexão com a Meta'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portal Branding Card */}
      <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold">Identidade do Cliente & Agência</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Personalize a experiência do cliente com o nome da empresa dele e os contatos da sua agência.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nome do Cliente</Label>
              <Input
                placeholder="Ex: Minha Loja Virtual"
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                className="bg-background/50 text-xs h-9 border-border/60"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Nome da sua Agência / Consultoria</Label>
              <Input
                placeholder="Ex: Nexus Marketing"
                value={agencyInput}
                onChange={(e) => setAgencyInput(e.target.value)}
                className="bg-background/50 text-xs h-9 border-border/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">WhatsApp do Gestor para Suporte</Label>
            <Input
              placeholder="Ex: 5511999999999 (com DDI e DDD)"
              value={whatsappInput}
              onChange={(e) => setWhatsappInput(e.target.value)}
              className="bg-background/50 text-xs h-9 border-border/60"
            />
            <p className="text-[11px] text-muted-foreground">
              Usado no botão &quot;Falar com o Gestor&quot; do menu superior e página de suporte.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetDemo}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar Dados de Demonstração
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="text-xs bg-primary hover:bg-primary/90 gap-1.5 w-full sm:w-auto"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Salvo com Sucesso!
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Security Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-muted/20 text-xs text-muted-foreground">
        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-foreground">Proteção e Isolamento:</strong> Este sistema foi projetado estritamente como um portal de visualização de métricas (read-only). Nenhuma ação de criação, exclusão, pausa ou alteração de orçamento é permitida a partir desta interface, garantindo total integridade das contas de anúncio.
        </p>
      </div>
    </div>
  )
}
