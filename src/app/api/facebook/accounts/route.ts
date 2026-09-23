import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const accessToken = searchParams.get('accessToken')
  const adAccountId = searchParams.get('adAccountId')

  if (!accessToken || !adAccountId) {
    return NextResponse.json({
      connected: false,
      account: {
        id: 'act_demo_123',
        name: 'Conta Demonstração (Modo Apresentação)',
        currency: 'BRL',
        account_status: 1,
        timezone_name: 'America/Sao_Paulo',
      },
    })
  }

  const normalizedId = adAccountId.trim().startsWith('act_') ? adAccountId.trim() : 'act_' + adAccountId.trim()

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${normalizedId}?fields=id,name,account_status,currency,timezone_name,balance,amount_spent&access_token=${accessToken}`
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { connected: false, error: err.error?.message || 'Falha ao autenticar conta' },
        { status: 400 }
      )
    }

    const data = await res.json()
    return NextResponse.json({
      connected: true,
      account: data,
    })
  } catch (err: any) {
    return NextResponse.json({ connected: false, error: err.message }, { status: 500 })
  }
}
