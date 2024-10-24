import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@boring.tools/ui'
import { Link } from '@tanstack/react-router'
import { ChevronRightIcon, FileStackIcon, PlusIcon } from 'lucide-react'
import { useChangelogList } from '../hooks/useChangelog'

export const SidebarChangelog = () => {
  const { data, error } = useChangelogList()

  return (
    <Collapsible asChild>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Changelog">
          <Link
            to="/changelog"
            activeProps={{ className: 'bg-sidebar-accent' }}
          >
            <FileStackIcon />
            <span>Changelog</span>
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

            <SidebarMenuSubItem className="opacity-60">
              <SidebarMenuSubButton asChild>
                <Link
                  to="/changelog/create"
                  activeProps={{
                    className: 'bg-sidebar-primary',
                  }}
                >
                  <span className="flex items-center gap-1">
                    <PlusIcon className="w-3 h-3" />
                    New changelog
                  </span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}
