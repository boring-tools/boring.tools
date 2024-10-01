import type { ReactNode } from '@tanstack/react-router'
import { FileStackIcon, LayoutDashboardIcon } from 'lucide-react'

type Route = {
  name: string
  to?: string
  icon?: ReactNode
  childrens?: Route[]
}

export const NavigationRoutes: Route[] = [
  {
    name: 'Dashboard',
    to: '/',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Changelog',
    to: '/changelog',
    icon: FileStackIcon,
  },
]
