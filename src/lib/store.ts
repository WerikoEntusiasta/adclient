'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ClientPortalState {
  // Configurações do Cliente e da Agência
  clientName: string
  agencyName: string
  agencyWhatsapp: string
  
  // Facebook Ads
  fbAccessToken: string
  fbAdAccountId: string
  currency: string

  // Preferências de visualização
  datePreset: string

  // Ações
  setClientBranding: (branding: Partial<Pick<ClientPortalState, 'clientName' | 'agencyName' | 'agencyWhatsapp'>>) => void
  setFbKeys: (keys: Partial<Pick<ClientPortalState, 'fbAccessToken' | 'fbAdAccountId' | 'currency'>>) => void
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
      currency: 'BRL',
      datePreset: 'maximum',

      setClientBranding: (branding) => set((state) => ({ ...state, ...branding })),
      setFbKeys: (keys) => set((state) => ({ ...state, ...keys })),
      setDatePreset: (datePreset) => set({ datePreset }),
      hasFbKeys: () => {
        const s = get()
        return !!(s.fbAccessToken && s.fbAdAccountId)
      },
    }),
    { name: 'adclient-portal-settings' }
  )
)
