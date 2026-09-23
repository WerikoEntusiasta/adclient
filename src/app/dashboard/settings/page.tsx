'use client'

import React, { useState } from 'react'
import { usePortalSettings, AdAccountSummary } from '@/lib/store'
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
  Search,
  Check,
  Radio,
} from 'lucide-react'

export default function SettingsPage() {
  const {
    clientName,
    agencyName,
    agencyWhatsapp,
    fbAccessToken,
    fbAdAccountId,
    availableAccounts,
    setAvailableAccounts,
    selectAccount,
    setClientBranding,
    setFbKeys,
  } = usePortalSettings()

  const [tokenInput, setTokenInput] = useState(fbAccessToken)
  const [accountInput, setAccountInput] = useState(fbAdAccountId)
  const [clientInput, setClientInput] = useState(clientName)
  const [agencyInput, setAgencyInput] = useState(agencyName)
  const [whatsappInput, setWhatsappInput] = useState(agencyWhatsapp)

  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const [accountsList, setAccountsList] = useState<AdAccountSummary[]>(availableAccounts)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Fetch all accounts connected to this access token
  const handleFetchAccounts = async () => {
    if (!tokenInput) {
      setTestResult({
        success: false,
        message: 'Cole o seu Meta Access Token para buscar as contas vinculadas.',
      })
      return
    }

    setLoadingAccounts(true)
    setTestResult(null)

    try {
      const url = new URL('/api/facebook/accounts', window.location.origin)
      url.searchParams.set('accessToken', tokenInput.trim())

      const res = await fetch(url.toString())
      const data = await res.json()

      if (res.ok && data.connected && data.accounts) {
        setAccountsList(data.accounts)
        setAvailableAccounts(data.accounts)

        // If the current accountInput is in the list, keep it; otherwise pick the first
        const exists = data.accounts.find((a: any) => a.id === accountInput)
        if (!exists && data.accounts.length > 0) {
          setAccountInput(data.accounts[0].id)
          setClientInput(data.accounts[0].name)
        }

        setTestResult({
          success: true,
          message: `${data.accounts.length} conta(s) de anúncio encontrada(s) com sucesso! Escolha uma abaixo.`,
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Não foi possível carregar as contas vinculadas a este token.',
        })
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Erro de conexão ao buscar contas na Meta API.',
      })
    } finally {
      setLoadingAccounts(false)
    }
  }

  const handleSelectAccountItem = (acc: AdAccountSummary) => {
    setAccountInput(acc.id)
    setClientInput(acc.name)
    selectAccount(acc.id, acc.name)
  }

  const handleSave = () => {
    setClientBranding({
      clientName: clientInput,
      agencyName: agencyInput,
      agencyWhatsapp: whatsappInput,
    })

    setFbKeys({
      fbAccessToken: tokenInput.trim(),
      fbAdAccountId: accountInput.trim(),
      selectedAccountName: clientInput,
    })

    setAvailableAccounts(accountsList)

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleResetDemo = () => {
    setTokenInput('')
    setAccountInput('')
    setClientInput('Minha Empresa')
    setAgencyInput('Agência de Performance')
    setWhatsappInput('5511999999999')
    setAccountsList([])

    setClientBranding({
      clientName: 'Minha Empresa',
      agencyName: 'Agência de Performance',
      agencyWhatsapp: '5511999999999',
    })
    setFbKeys({
      fbAccessToken: '',
      fbAdAccountId: '',
      selectedAccountName: '',
    })
    setAvailableAccounts([])
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
          Conecte a conta do cliente via Token, selecione qual conta exibir e personalize a identidade do portal.
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
            Cole o Token de Acesso da Meta para puxar automaticamente todas as contas de anúncio às quais você tem acesso.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Token input & Fetch button */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Meta Access Token (Token de Acesso do Usuário)</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="password"
                placeholder="Cole o token de acesso (EAAB...)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="bg-background/50 text-xs font-mono h-9 border-border/60 flex-1"
              />
              <Button
                type="button"
                onClick={handleFetchAccounts}
                disabled={loadingAccounts || !tokenInput}
                className="text-xs h-9 gap-1.5 shrink-0 bg-primary hover:bg-primary/90"
              >
                <Search className={`h-3.5 w-3.5 ${loadingAccounts ? 'animate-spin' : ''}`} />
                {loadingAccounts ? 'Buscando Contas...' : 'Buscar Contas'}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Requer permissões de leitura da Graph API (<code className="text-[10px]">ads_read</code>, <code className="text-[10px]">read_insights</code>).
            </p>
          </div>

          {/* Test feedback */}
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

          {/* Ad Accounts Selection List */}
          {accountsList.length > 0 && (
            <div className="space-y-2 pt-2">
              <Label className="text-xs font-medium flex items-center justify-between">
                <span>Escolha a Conta de Anúncios Ativa:</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  {accountsList.length} conta(s) encontrada(s)
                </span>
              </Label>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {accountsList.map((acc) => {
                  const isSelected = accountInput === acc.id
                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectAccountItem(acc)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/40'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold truncate text-foreground">
                            {acc.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            {acc.id} {acc.currency ? `• Moeda: ${acc.currency}` : ''}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Badge variant="default" className="text-[10px] shrink-0">
                          Conta Ativa
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Manual ID Input fallback */}
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <Label className="text-xs font-medium text-muted-foreground">
              ID da Conta Selecionada (Ad Account ID)
            </Label>
            <Input
              placeholder="Ex: act_1234567890"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="bg-background/50 text-xs font-mono h-9 border-border/60"
            />
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
