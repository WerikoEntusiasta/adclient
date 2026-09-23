import { NextRequest, NextResponse } from 'next/server'
import {
  getCampaigns,
  getCampaignInsights,
  getDailyInsights,
  extractCampaignResults,
  extractPurchases,
  extractPurchaseValue,
  extractLeads,
  extractMessages,
} from '@/lib/facebook'
import { mockCampaigns, mockDailyMetrics, Campaign } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const accessToken = searchParams.get('accessToken')
  const adAccountId = searchParams.get('adAccountId')
  const datePreset = searchParams.get('datePreset') || 'maximum'

  // If no credentials provided, return high-fidelity mock data
  if (!accessToken || !adAccountId) {
    return NextResponse.json({
      campaigns: mockCampaigns,
      dailyMetrics: mockDailyMetrics,
      isLive: false,
    })
  }

  try {
    const config = { accessToken, adAccountId }

    // Run fetches concurrently
    const [rawCampaigns, rawInsights, rawDaily] = await Promise.all([
      getCampaigns(config),
      getCampaignInsights(config, datePreset),
      getDailyInsights(config, datePreset === 'maximum' ? 'last_30d' : datePreset),
    ])

    const insightsByCampaignId = new Map<string, any>()
    for (const ins of rawInsights) {
      if (ins.campaign_id) {
        insightsByCampaignId.set(ins.campaign_id, ins)
      }
    }

    const campaigns: Campaign[] = rawCampaigns.map((camp) => {
      const ins = insightsByCampaignId.get(camp.id)
      const spend = ins ? parseFloat(ins.spend || '0') : 0
      const impressions = ins ? parseInt(ins.impressions || '0', 10) : 0
      const clicks = ins ? parseInt(ins.clicks || '0', 10) : 0
      const reach = ins ? parseInt(ins.reach || '0', 10) : 0
      const ctr = ins ? parseFloat(ins.ctr || '0') : 0
      const cpc = ins ? parseFloat(ins.cpc || '0') : 0
      const cpm = ins ? parseFloat(ins.cpm || '0') : 0

      const actions = ins?.actions || []
      const actionValues = ins?.action_values || []

      const { conversions, resultLabel } = extractCampaignResults(camp.objective, actions)
      const purchases = extractPurchases(actions)
      const purchaseValue = extractPurchaseValue(actionValues)
      const leads = extractLeads(actions)
      const messages = extractMessages(actions)

      const cpa = conversions > 0 ? spend / conversions : 0
      const roas = spend > 0 && purchaseValue > 0 ? purchaseValue / spend : 0

      return {
        id: camp.id,
        name: camp.name,
        status: (camp.status as any) || 'PAUSED',
        effectiveStatus: (camp as any).effective_status || camp.status,
        objective: camp.objective,
        dailyBudget: camp.daily_budget ? parseFloat(camp.daily_budget) / 100 : undefined,
        spend,
        impressions,
        reach,
        clicks,
        ctr,
        cpc,
        cpm,
        conversions,
        resultLabel,
        cpa,
        messages,
        leads,
        purchases,
        purchaseValue,
        roas,
        startDate: camp.start_time || camp.created_time || '',
        endDate: camp.stop_time || null,
      }
    })

    const dailyMetrics = rawDaily.map((d) => ({
      date: d.date_start,
      spend: parseFloat(d.spend || '0'),
      impressions: parseInt(d.impressions || '0', 10),
      clicks: parseInt(d.clicks || '0', 10),
      conversions: extractPurchases(d.actions) || extractLeads(d.actions) || extractMessages(d.actions) || 0,
      revenue: extractPurchaseValue(d.action_values),
    }))

    return NextResponse.json({
      campaigns,
      dailyMetrics,
      isLive: true,
    })
  } catch (error: any) {
    console.error('Meta API campaigns error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Erro ao carregar dados do Facebook Ads',
        fallback: true,
        campaigns: mockCampaigns,
        dailyMetrics: mockDailyMetrics,
        isLive: false,
      },
      { status: 500 }
    )
  }
}
