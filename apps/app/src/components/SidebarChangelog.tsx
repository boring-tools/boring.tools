import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@boring.tools/ui'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRightIcon, FileStackIcon, PlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useChangelogList } from '../hooks/useChangelog'

export const SidebarChangelog = () => {
  const location = useLocation()
  const [value, setValue] = useLocalStorage('sidebar-changelog-open', false)
  const { data, error, isLoading } = useChangelogList()

  useEffect(() => {
    const firstElement = location.href.split('/')[1]
    if (firstElement === 'changelog') {
      setValue(true)
    }
  }, [location, setValue])

  return (
    <SidebarMenu>
      <Collapsible asChild open={value} onOpenChange={() => setValue(!value)}>
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
              {isLoading && !data && (
                <div className="flex flex-col gap-1 animate-pulse">
                  <SidebarMenuSubItem>
                    <div className="w-[100px] h-[20px] bg-border rounded" />
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <div className="w-[130px] h-[20px] bg-border rounded" />
                  </SidebarMenuSubItem>
                </div>
              )}
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
    </SidebarMenu>
  )
}
