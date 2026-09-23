export interface Campaign {
  id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  effectiveStatus?: string
  objective: string
  dailyBudget?: number
  spend: number
  impressions: number
  reach?: number
  clicks: number
  ctr: number
  cpc: number
  cpm?: number
  conversions: number
  resultLabel?: string
  cpa: number
  messages?: number
  leads?: number
  purchases?: number
  videoViews?: number
  purchaseValue?: number
  costPerMessage?: number
  costPerLead?: number
  roas: number
  startDate: string
  endDate?: string | null
}

export interface DailyMetric {
  date: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  messages?: number
  revenue?: number
}

export interface CreativeItem {
  id: string
  name: string
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  campaignId: string
  adsetId: string
  title: string
  body: string
  imageUrl?: string
  thumbnailUrl?: string
  videoUrl?: string
  videoId?: string
  isVideo?: boolean
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  reach: number
  frequency: number
  purchases: number
  purchaseValue: number
  roas: number
  messages: number
  leads: number
  conversions: number
  cpa: number
  badges: string[]
}

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Vendas Diretas — Coleção Outono/Inverno (CBO)',
    status: 'ACTIVE',
    effectiveStatus: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 250,
    spend: 4890.50,
    impressions: 215400,
    reach: 168000,
    clicks: 6840,
    ctr: 3.18,
    cpc: 0.71,
    conversions: 184,
    resultLabel: 'Compras no Site',
    cpa: 26.58,
    purchases: 184,
    purchaseValue: 21450.00,
    roas: 4.39,
    startDate: '2026-08-01',
  },
  {
    id: 'camp_002',
    name: 'Remarketing Dinâmico — Carrinho Abandonado',
    status: 'ACTIVE',
    effectiveStatus: 'ACTIVE',
    objective: 'OUTCOME_SALES',
    dailyBudget: 120,
    spend: 1840.20,
    impressions: 89300,
    reach: 42000,
    clicks: 2950,
    ctr: 3.30,
    cpc: 0.62,
    conversions: 92,
    resultLabel: 'Compras no Site',
    cpa: 20.00,
    purchases: 92,
    purchaseValue: 10890.00,
    roas: 5.92,
    startDate: '2026-08-10',
  },
  {
    id: 'camp_003',
    name: 'Captação de Leads VIP — WhatsApp Direto',
    status: 'ACTIVE',
    effectiveStatus: 'ACTIVE',
    objective: 'OUTCOME_LEADS',
    dailyBudget: 100,
    spend: 1450.00,
    impressions: 112000,
    reach: 94000,
    clicks: 3410,
    ctr: 3.04,
    cpc: 0.43,
    conversions: 310,
    resultLabel: 'Leads Cadastrados',
    cpa: 4.68,
    leads: 310,
    roas: 0,
    startDate: '2026-08-15',
  },
  {
    id: 'camp_004',
    name: 'Reconhecimento & Reels Virais — Topo de Funil',
    status: 'PAUSED',
    effectiveStatus: 'PAUSED',
    objective: 'OUTCOME_AWARENESS',
    dailyBudget: 80,
    spend: 960.00,
    impressions: 340000,
    reach: 285000,
    clicks: 4200,
    ctr: 1.24,
    cpc: 0.23,
    conversions: 45,
    resultLabel: 'Engajamento',
    cpa: 21.33,
    roas: 1.20,
    startDate: '2026-07-20',
    endDate: '2026-08-05',
  },
]

export const mockDailyMetrics: DailyMetric[] = [
  { date: '2026-09-01', spend: 280, impressions: 14500, clicks: 460, conversions: 12, revenue: 1420 },
  { date: '2026-09-02', spend: 310, impressions: 15800, clicks: 510, conversions: 15, revenue: 1780 },
  { date: '2026-09-03', spend: 290, impressions: 14900, clicks: 480, conversions: 14, revenue: 1650 },
  { date: '2026-09-04', spend: 350, impressions: 17200, clicks: 590, conversions: 18, revenue: 2190 },
  { date: '2026-09-05', spend: 380, impressions: 19100, clicks: 640, conversions: 21, revenue: 2540 },
  { date: '2026-09-06', spend: 420, impressions: 21500, clicks: 720, conversions: 25, revenue: 3100 },
  { date: '2026-09-07', spend: 450, impressions: 22800, clicks: 780, conversions: 28, revenue: 3450 },
  { date: '2026-09-08', spend: 390, impressions: 19800, clicks: 650, conversions: 22, revenue: 2680 },
  { date: '2026-09-09', spend: 410, impressions: 20400, clicks: 690, conversions: 24, revenue: 2950 },
  { date: '2026-09-10', spend: 440, impressions: 22100, clicks: 740, conversions: 26, revenue: 3200 },
  { date: '2026-09-11', spend: 460, impressions: 23400, clicks: 790, conversions: 29, revenue: 3600 },
  { date: '2026-09-12', spend: 480, impressions: 24200, clicks: 820, conversions: 31, revenue: 3890 },
  { date: '2026-09-13', spend: 510, impressions: 25900, clicks: 880, conversions: 34, revenue: 4250 },
  { date: '2026-09-14', spend: 530, impressions: 26800, clicks: 910, conversions: 36, revenue: 4500 },
]

export const mockCreatives: CreativeItem[] = [
  {
    id: 'cr_01',
    name: 'Vídeo Demonstração Produto — Reels (Vertical)',
    status: 'ACTIVE',
    campaignId: 'camp_001',
    adsetId: 'adset_001',
    title: 'Transforme seus resultados em até 7 dias',
    body: 'Veja na prática como centenas de clientes estão economizando tempo e aumentando seu faturamento.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=90',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isVideo: true,
    spend: 1980.50,
    impressions: 89400,
    clicks: 3420,
    ctr: 3.83,
    cpc: 0.58,
    cpm: 22.15,
    reach: 72000,
    frequency: 1.24,
    purchases: 82,
    purchaseValue: 9840.00,
    roas: 4.97,
    messages: 0,
    leads: 82,
    conversions: 82,
    cpa: 24.15,
    badges: ['🥇 #1 ROAS', '💎 Mais Conversões'],
  },
  {
    id: 'cr_02',
    name: 'Carrossel Destaques da Coleção — Feed & Stories',
    status: 'ACTIVE',
    campaignId: 'camp_001',
    adsetId: 'adset_002',
    title: 'Edição limitada com frete grátis hoje',
    body: 'Deslize para ver todas as peças exclusivas disponíveis no site.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=90',
    spend: 1420.00,
    impressions: 64000,
    clicks: 2240,
    ctr: 3.50,
    cpc: 0.63,
    cpm: 22.19,
    reach: 51000,
    frequency: 1.25,
    purchases: 54,
    purchaseValue: 6480.00,
    roas: 4.56,
    messages: 0,
    leads: 54,
    conversions: 54,
    cpa: 26.30,
    badges: ['🔥 Alto Desempenho'],
  },
  {
    id: 'cr_03',
    name: 'Vídeo Depoimento Cliente Satisfeito — Prova Social',
    status: 'ACTIVE',
    campaignId: 'camp_002',
    adsetId: 'adset_003',
    title: 'Ainda com dúvida? Veja o que quem comprou está falando',
    body: 'Garantia incondicional de 30 dias com devolução facilitada.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    isVideo: true,
    spend: 1120.00,
    impressions: 48000,
    clicks: 1680,
    ctr: 3.50,
    cpc: 0.67,
    cpm: 23.33,
    reach: 38000,
    frequency: 1.26,
    purchases: 48,
    purchaseValue: 5760.00,
    roas: 5.14,
    messages: 0,
    leads: 48,
    conversions: 48,
    cpa: 23.33,
    badges: ['⭐ Maior Prova Social'],
  },
  {
    id: 'cr_04',
    name: 'Imagem Estática Benefício Exclusivo — Retargeting',
    status: 'ACTIVE',
    campaignId: 'camp_002',
    adsetId: 'adset_004',
    title: 'Cupom especial de 10% OFF na primeira compra',
    body: 'Use o cupom BEMVINDO10 no checkout e garanta sua condição especial agora.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=90',
    spend: 720.20,
    impressions: 41300,
    clicks: 1270,
    ctr: 3.08,
    cpc: 0.57,
    cpm: 17.44,
    reach: 29000,
    frequency: 1.42,
    purchases: 44,
    purchaseValue: 5130.00,
    roas: 7.12,
    messages: 0,
    leads: 44,
    conversions: 44,
    cpa: 16.37,
    badges: ['🚀 Melhor Retorno de Remarketing'],
  },
]
