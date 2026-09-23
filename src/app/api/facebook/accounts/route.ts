import { NextRequest, NextResponse } from 'next/server'

const demoAccounts = [
  {
    id: 'act_demo_ecommerce',
    name: 'Demonstração — E-commerce & Varejo',
    currency: 'BRL',
    account_status: 1,
    timezone_name: 'America/Sao_Paulo',
  },
  {
    id: 'act_demo_leads',
    name: 'Demonstração — Captação de Leads VIP',
    currency: 'BRL',
    account_status: 1,
    timezone_name: 'America/Sao_Paulo',
  },
  {
    id: 'act_demo_infoproduto',
    name: 'Demonstração — Infoproduto & Lançamentos',
    currency: 'BRL',
    account_status: 1,
    timezone_name: 'America/Sao_Paulo',
  },
]

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const accessToken = searchParams.get('accessToken')
  const adAccountId = searchParams.get('adAccountId')

  if (!accessToken) {
    return NextResponse.json({
      connected: false,
      isLive: false,
      accounts: demoAccounts,
      selectedAccount: demoAccounts[0],
    })
  }

  try {
    // Fetch all ad accounts accessible by this access token
    const res = await fetch(
      `https://graph.facebook.com/v21.0/me/adaccounts?fields=id,name,account_status,currency,timezone_name,balance,amount_spent&limit=100&access_token=${accessToken}`
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        {
          connected: false,
          isLive: false,
          error: err.error?.message || 'Falha ao autenticar token na Meta Graph API',
          accounts: demoAccounts,
        },
        { status: 400 }
      )
    }

    const data = await res.json()
    const accounts = data.data || []

    let selectedAccount = null
    if (adAccountId) {
      const normalizedId = adAccountId.trim().startsWith('act_') ? adAccountId.trim() : 'act_' + adAccountId.trim()
      selectedAccount = accounts.find((a: any) => a.id === normalizedId) || null
    }

    if (!selectedAccount && accounts.length > 0) {
      selectedAccount = accounts[0]
    }

    return NextResponse.json({
      connected: true,
      isLive: true,
      accounts,
      selectedAccount,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        connected: false,
        isLive: false,
        error: err.message || 'Erro ao comunicar com a Meta API',
        accounts: demoAccounts,
      },
      { status: 500 }
    )
  }
}
