import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarTrigger,
} from '@boring.tools/ui'
import { Link } from '@tanstack/react-router'

type Breadcrumbs = {
  name: string
  to: string
}

export const PageWrapper = ({
  children,
  breadcrumbs,
}: { children: React.ReactNode; breadcrumbs?: Breadcrumbs[] }) => {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs?.map((crumb, key) => {
                if (breadcrumbs.length - 1 === key) {
                  return (
                    <BreadcrumbItem key={crumb.to}>
                      <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )
                }

                return (
                  <div className="flex items-center gap-2" key={crumb.to}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link to={crumb.to}>{crumb.name}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </div>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Separator />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </>
  )
}
