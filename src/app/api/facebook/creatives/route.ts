import { NextRequest, NextResponse } from 'next/server'
import {
  getAccountAds,
  getAccountAdInsights,
  extractPurchases,
  extractPurchaseValue,
  extractLeads,
  extractMessages,
} from '@/lib/facebook'
import { mockCreatives, CreativeItem } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const accessToken = searchParams.get('accessToken')
  const adAccountId = searchParams.get('adAccountId')
  const datePreset = searchParams.get('datePreset') || 'maximum'

  if (!accessToken || !adAccountId) {
    return NextResponse.json({
      creatives: mockCreatives,
      isLive: false,
    })
  }

  try {
    const config = { accessToken, adAccountId }

    const [rawAds, rawInsights] = await Promise.all([
      getAccountAds(config),
      getAccountAdInsights(config, datePreset),
    ])

    const insightsByAdId = new Map<string, any>()
    for (const ins of rawInsights) {
      if (ins.ad_id) {
        insightsByAdId.set(ins.ad_id, ins)
      }
    }

    const creatives: CreativeItem[] = []

    for (const ad of rawAds) {
      const ins = insightsByAdId.get(ad.id)
      const spend = ins ? parseFloat(ins.spend || '0') : 0
      const impressions = ins ? parseInt(ins.impressions || '0', 10) : 0
      const clicks = ins ? parseInt(ins.clicks || '0', 10) : 0
      const reach = ins ? parseInt(ins.reach || '0', 10) : 0
      const frequency = ins ? parseFloat(ins.frequency || '1') : 1
      const ctr = ins ? parseFloat(ins.ctr || '0') : 0
      const cpc = ins ? parseFloat(ins.cpc || '0') : 0
      const cpm = ins ? parseFloat(ins.cpm || '0') : 0

      const actions = ins?.actions || []
      const actionValues = ins?.action_values || []

      const purchases = extractPurchases(actions)
      const purchaseValue = extractPurchaseValue(actionValues)
      const leads = extractLeads(actions)
      const messages = extractMessages(actions)
      const conversions = purchases || leads || messages || 0
      const cpa = conversions > 0 ? spend / conversions : 0
      const roas = spend > 0 && purchaseValue > 0 ? purchaseValue / spend : 0

      const cr = ad.creative || {}
      const story = cr.object_story_spec || {}
      const linkData = story.link_data || {}
      const videoData = story.video_data || {}

      const title = cr.title || linkData.name || videoData.title || ad.name || 'Anúncio'
      const body = cr.body || linkData.message || videoData.message || ''
      const imageUrl = cr.image_url || linkData.image_url || videoData.image_url || cr.thumbnail_url || ''
      const thumbnailUrl = cr.thumbnail_url || videoData.image_url || imageUrl
      const videoId = cr.video_id || videoData.video_id
      const isVideo = Boolean(videoId || videoData.video_id || cr.video_id)

      let videoUrl: string | undefined = undefined
      if (videoId && accessToken) {
        // Try to fetch source video URL if available
        try {
          const vRes = await fetch(`https://graph.facebook.com/v21.0/${videoId}?fields=source,picture&access_token=${accessToken}`)
          if (vRes.ok) {
            const vData = await vRes.json()
            if (vData.source) videoUrl = vData.source
          }
        } catch {
          // ignore video source lookup errors
        }
      }

      creatives.push({
        id: ad.id,
        name: ad.name,
        status: (ad.status as any) || 'PAUSED',
        campaignId: ad.campaign_id,
        adsetId: ad.adset_id,
        title,
        body,
        imageUrl,
        thumbnailUrl,
        videoUrl,
        videoId,
        isVideo,
        spend,
        impressions,
        clicks,
        ctr,
        cpc,
        cpm,
        reach,
        frequency,
        purchases,
        purchaseValue,
        roas,
        messages,
        leads,
        conversions,
        cpa,
        badges: [],
      })
    }

    // Rank and assign badges
    const sortedByRoas = [...creatives].filter((c) => c.spend > 100).sort((a, b) => b.roas - a.roas)
    if (sortedByRoas[0] && sortedByRoas[0].roas > 1) {
      sortedByRoas[0].badges.push('🥇 #1 ROAS')
    }
    const sortedByConv = [...creatives].sort((a, b) => b.conversions - a.conversions)
    if (sortedByConv[0] && sortedByConv[0].conversions > 0) {
      if (!sortedByConv[0].badges.includes('🥇 #1 ROAS')) {
        sortedByConv[0].badges.push('💎 Mais Conversões')
      }
    }

    return NextResponse.json({
      creatives: creatives.length > 0 ? creatives : mockCreatives,
      isLive: creatives.length > 0,
    })
  } catch (error: any) {
    console.error('Meta API creatives error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Erro ao carregar criativos',
        fallback: true,
        creatives: mockCreatives,
        isLive: false,
      },
      { status: 500 }
    )
  }
}
