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
import { ChevronRightIcon, NotebookTextIcon, PlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { usePageList } from '../hooks/usePage'

export const SidebarPage = () => {
  const location = useLocation()
  const [value, setValue] = useLocalStorage('sidebar-page-open', false)
  const { data, error } = usePageList()

  useEffect(() => {
    const firstElement = location.href.split('/')[1]
    if (firstElement === 'page') {
      setValue(true)
    }
  }, [location, setValue])

  return (
    <SidebarMenu>
      <Collapsible asChild open={value} onOpenChange={() => setValue(!value)}>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Page">
            <Link to="/page" activeProps={{ className: 'bg-sidebar-accent' }}>
              <NotebookTextIcon />
              <span>Page</span>
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
                data?.map((page) => (
                  <SidebarMenuSubItem key={page.id}>
                    <SidebarMenuSubButton asChild>
                      <Link
                        to={`/page/${page?.id}`}
                        activeProps={{
                          className: 'bg-sidebar-primary',
                        }}
                      >
                        <span>{page.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}

              <SidebarMenuSubItem className="opacity-60">
                <SidebarMenuSubButton asChild>
                  <Link
                    to="/page/create"
                    activeProps={{
                      className: 'bg-sidebar-primary',
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <PlusIcon className="w-3 h-3" />
                      New page
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
