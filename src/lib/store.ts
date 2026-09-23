'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdAccountSummary {
  id: string
  name: string
  currency?: string
  account_status?: number
  timezone_name?: string
}

interface ClientPortalState {
  // Configurações do Cliente e da Agência
  clientName: string
  agencyName: string
  agencyWhatsapp: string

  // Facebook Ads
  fbAccessToken: string
  fbAdAccountId: string
  selectedAccountName: string
  currency: string

  // Lista de Contas Disponíveis
  availableAccounts: AdAccountSummary[]

  // Preferências de visualização
  datePreset: string

  // Ações
  setClientBranding: (branding: Partial<Pick<ClientPortalState, 'clientName' | 'agencyName' | 'agencyWhatsapp'>>) => void
  setFbKeys: (keys: Partial<Pick<ClientPortalState, 'fbAccessToken' | 'fbAdAccountId' | 'currency' | 'selectedAccountName'>>) => void
  setAvailableAccounts: (accounts: AdAccountSummary[]) => void
  selectAccount: (accountId: string, accountName?: string) => void
  setDatePreset: (datePreset: string) => void
  hasFbKeys: () => boolean
}

export const usePortalSettings = create<ClientPortalState>()(
  persist(
    (set, get) => ({
      clientName: 'Minha Empresa',
      agencyName: 'Agência de Performance',
      agencyWhatsapp: '5511999999999',

      fbAccessToken: '',
      fbAdAccountId: '',
      selectedAccountName: '',
      currency: 'BRL',
      availableAccounts: [],

      datePreset: 'maximum',

      setClientBranding: (branding) => set((state) => ({ ...state, ...branding })),
      setFbKeys: (keys) => set((state) => ({ ...state, ...keys })),
      setAvailableAccounts: (availableAccounts) => set({ availableAccounts }),
      selectAccount: (accountId, accountName) =>
        set((state) => {
          const acc = state.availableAccounts.find((a) => a.id === accountId)
          const name = accountName || acc?.name || state.selectedAccountName
          return {
            ...state,
            fbAdAccountId: accountId,
            selectedAccountName: name,
            clientName: name || state.clientName,
            currency: acc?.currency || state.currency,
          }
        }),
      setDatePreset: (datePreset) => set({ datePreset }),
      hasFbKeys: () => {
        const s = get()
        return !!(s.fbAccessToken && s.fbAdAccountId)
      },
    }),
    { name: 'adclient-portal-settings' }
  )
)
