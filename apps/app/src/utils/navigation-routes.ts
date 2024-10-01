import type { ReactNode } from '@tanstack/react-router'
import { FileStackIcon, HouseIcon, LayoutDashboardIcon } from 'lucide-react'

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
    childrens: [
      {
        name: 'Overview',
        to: '/changelog',
        icon: HouseIcon,
      },
      {
        name: 'Versions',
        to: '/changelog/version',
        icon: FileStackIcon,
      },
    ],
  },
]
