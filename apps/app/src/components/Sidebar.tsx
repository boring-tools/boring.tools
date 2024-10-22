import { ChevronRightIcon, FileStackIcon } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar as SidebarComp,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@boring.tools/ui'
import { Link } from '@tanstack/react-router'
import { useChangelogList } from '../hooks/useChangelog'
import { SidebarUser } from './SidebarUser'

const items = [
  {
    title: 'Changelog',
    url: '/changelog',
    icon: FileStackIcon,
    isActive: true,
  },
]

export function Sidebar() {
  const { data, error } = useChangelogList()
  return (
    <SidebarComp>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  BT
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">boring.tools</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      to={item.url}
                      activeProps={{ className: 'bg-sidebar-accent' }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRightIcon />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {!error &&
                        data?.map((changelog) => (
                          <SidebarMenuSubItem key={changelog.id}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                to={`/changelog/${changelog.id}`}
                                activeProps={{
                                  className: 'bg-sidebar-primary',
                                }}
                              >
                                <span>{changelog.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </SidebarComp>
  )
}
