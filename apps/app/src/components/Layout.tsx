import { SidebarInset } from '@boring.tools/ui'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export const description =
  'A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.'

export const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <>
      <Sidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  )
}
