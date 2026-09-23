'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Layers,
  Film,
  FileSpreadsheet,
  Headphones,
  Sliders,
  TrendingUp,
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Visão Geral',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Campanhas',
    href: '/dashboard/campaigns',
    icon: Layers,
  },
  {
    name: 'Criativos & Vídeos',
    href: '/dashboard/creatives',
    icon: Film,
  },
  {
    name: 'Relatórios Executivos',
    href: '/dashboard/reports',
    icon: FileSpreadsheet,
  },
  {
    name: 'Falar com o Gestor',
    href: '/dashboard/contact',
    icon: Headphones,
  },
  {
    name: 'Configurações de Conta',
    href: '/dashboard/settings',
    icon: Sliders,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/60 bg-sidebar/50 p-4 backdrop-blur-md">
      {/* Brand logo & portal name */}
      <div className="flex items-center gap-2.5 px-3 py-4 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm shadow-md">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
            AdClient Portal
          </span>
          <span className="text-[10px] text-muted-foreground">
            Painel Executivo de Tráfego
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Footer Notice */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-3.5 text-center">
        <span className="block text-[11px] font-semibold text-foreground">
          Visualização Segura
        </span>
        <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
          Este painel opera em modo de leitura executiva para segurança dos dados da sua empresa.
        </p>
      </div>
    </aside>
  )
}
