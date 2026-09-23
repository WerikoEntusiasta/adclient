const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0'

export interface FacebookConfig {
  accessToken: string
  adAccountId: string
}

export interface FacebookCampaign {
  id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED'
  objective: string
  daily_budget?: string
  lifetime_budget?: string
  created_time: string
  start_time?: string
  stop_time?: string
}

export interface FacebookInsight {
  campaign_id?: string
  campaign_name?: string
  adset_id?: string
  adset_name?: string
  ad_id?: string
  ad_name?: string
  spend: string
  impressions: string
  clicks: string
  ctr: string
  cpc: string
  cpm: string
  reach: string
  frequency?: string
  actions?: Array<{ action_type: string; value: string }>
  action_values?: Array<{ action_type: string; value: string }>
  date_start: string
  date_stop: string
}

function normalizeAdAccountId(id: string): string {
  const trimmed = id.trim()
  return trimmed.startsWith('act_') ? trimmed : 'act_' + trimmed
}

export function extractPurchases(actions?: Array<{ action_type: string; value: string }>): number {
  if (!actions || !Array.isArray(actions)) return 0
  const purchase = actions.find(a => a.action_type === 'purchase')
  if (purchase) return Number(purchase.value) || 0
  const omni = actions.find(a => a.action_type === 'omni_purchase')
  if (omni) return Number(omni.value) || 0
  return 0
}

export function extractPurchaseValue(actionValues?: Array<{ action_type: string; value: string }>): number {
  if (!actionValues || !Array.isArray(actionValues)) return 0
  const purchase = actionValues.find(a => a.action_type === 'purchase')
  if (purchase) return Number(purchase.value) || 0
  const omni = actionValues.find(a => a.action_type === 'omni_purchase')
  if (omni) return Number(omni.value) || 0
  return 0
}

export function extractMessages(actions?: Array<{ action_type: string; value: string }>): number {
  if (!actions || !Array.isArray(actions)) return 0
  const msgAction = actions.find(a => a.action_type === 'onsite_conversion.messaging_conversation_started_7d')
  if (msgAction) return Number(msgAction.value) || 0
  const generalMsg = actions.find(a => a.action_type === 'messaging_conversation_started_7d')
  if (generalMsg) return Number(generalMsg.value) || 0
  return 0
}

export function extractLeads(actions?: Array<{ action_type: string; value: string }>): number {
  if (!actions || !Array.isArray(actions)) return 0
  const leadAction = actions.find(a => a.action_type === 'lead')
  if (leadAction) return Number(leadAction.value) || 0
  const onFacebookLead = actions.find(a => a.action_type === 'on_facebook_lead')
  if (onFacebookLead) return Number(onFacebookLead.value) || 0
  return 0
}

export function extractVideoViews(actions?: Array<{ action_type: string; value: string }>): number {
  if (!actions || !Array.isArray(actions)) return 0
  const video = actions.find(a => a.action_type === 'video_view')
  return video ? Number(video.value) || 0 : 0
}

export function extractCampaignResults(objective: string, actions?: Array<{ action_type: string; value: string }>): { conversions: number; resultLabel: string } {
  if (!actions || !Array.isArray(actions)) {
    return { conversions: 0, resultLabel: 'Resultados' }
  }

  const obj = (objective || '').toUpperCase()

  if (obj.includes('SALE') || obj.includes('CONVERSION')) {
    const p = extractPurchases(actions)
    if (p > 0) return { conversions: p, resultLabel: 'Compras no Site' }
  }

  if (obj.includes('LEAD')) {
    const l = extractLeads(actions)
    if (l > 0) return { conversions: l, resultLabel: 'Leads' }
  }

  if (obj.includes('MESSAGE')) {
    const m = extractMessages(actions)
    if (m > 0) return { conversions: m, resultLabel: 'Conversas Iniciadas' }
  }

  const purchases = extractPurchases(actions)
  if (purchases > 0) return { conversions: purchases, resultLabel: 'Compras' }

  const leads = extractLeads(actions)
  if (leads > 0) return { conversions: leads, resultLabel: 'Leads' }

  const msgs = extractMessages(actions)
  if (msgs > 0) return { conversions: msgs, resultLabel: 'Mensagens' }

  const linkClicks = actions.find(a => a.action_type === 'link_click')
  if (linkClicks) return { conversions: Number(linkClicks.value) || 0, resultLabel: 'Cliques no Link' }

  return { conversions: 0, resultLabel: 'Resultados' }
}

export async function getCampaigns(config: FacebookConfig): Promise<FacebookCampaign[]> {
  const accountId = normalizeAdAccountId(config.adAccountId)
  const url = new URL(`${GRAPH_API_BASE}/${accountId}/campaigns`)
  url.searchParams.set('access_token', config.accessToken)
  url.searchParams.set('fields', 'id,name,status,objective,daily_budget,lifetime_budget,created_time,start_time,stop_time,effective_status')
  url.searchParams.set('limit', '100')

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Erro ao buscar campanhas (${res.status})`)
  }
  const data = await res.json()
  return data.data || []
}

export async function getCampaignInsights(config: FacebookConfig, datePreset = 'maximum'): Promise<FacebookInsight[]> {
  const accountId = normalizeAdAccountId(config.adAccountId)
  const url = new URL(`${GRAPH_API_BASE}/${accountId}/insights`)
  url.searchParams.set('access_token', config.accessToken)
  url.searchParams.set('level', 'campaign')
  url.searchParams.set('fields', 'campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,action_values,date_start,date_stop')
  url.searchParams.set('date_preset', datePreset)
  url.searchParams.set('limit', '100')

  const res = await fetch(url.toString())
  if (!res.ok) return []
  const data = await res.json()
  return data.data || []
}

export async function getDailyInsights(config: FacebookConfig, datePreset = 'last_30d'): Promise<FacebookInsight[]> {
  const accountId = normalizeAdAccountId(config.adAccountId)
  const url = new URL(`${GRAPH_API_BASE}/${accountId}/insights`)
  url.searchParams.set('access_token', config.accessToken)
  url.searchParams.set('time_increment', '1')
  url.searchParams.set('fields', 'spend,impressions,clicks,actions,date_start,date_stop')
  url.searchParams.set('date_preset', datePreset)
  url.searchParams.set('limit', '90')

  const res = await fetch(url.toString())
  if (!res.ok) return []
  const data = await res.json()
  return data.data || []
}

export async function getAccountAds(config: FacebookConfig): Promise<any[]> {
  const accountId = normalizeAdAccountId(config.adAccountId)
  const url = new URL(`${GRAPH_API_BASE}/${accountId}/ads`)
  url.searchParams.set('access_token', config.accessToken)
  url.searchParams.set('fields', 'id,name,status,effective_status,campaign_id,adset_id,creative{id,name,title,body,image_url,thumbnail_url,object_story_spec,asset_feed_spec,video_id}')
  url.searchParams.set('limit', '100')

  const res = await fetch(url.toString())
  if (!res.ok) return []
  const data = await res.json()
  return data.data || []
}

export async function getAccountAdInsights(config: FacebookConfig, datePreset = 'maximum'): Promise<FacebookInsight[]> {
  const accountId = normalizeAdAccountId(config.adAccountId)
  const url = new URL(`${GRAPH_API_BASE}/${accountId}/insights`)
  url.searchParams.set('access_token', config.accessToken)
  url.searchParams.set('level', 'ad')
  url.searchParams.set('fields', 'ad_id,ad_name,spend,impressions,clicks,ctr,cpc,cpm,reach,frequency,actions,action_values,date_start,date_stop')
  url.searchParams.set('date_preset', datePreset)
  url.searchParams.set('limit', '100')

  const res = await fetch(url.toString())
  if (!res.ok) return []
  const data = await res.json()
  return data.data || []
}
