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
import { ChevronRightIcon, NotebookTextIcon, PlusIcon } from 'lucide-react'
import { usePageList } from '../hooks/usePage'

export const SidebarPage = () => {
  const { data, error } = usePageList()

  return (
    <Collapsible asChild>
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
  )
}
