import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@boring.tools/ui'
import { Link } from '@tanstack/react-router'
import { BellIcon } from 'lucide-react'
import { NavigationRoutes } from '../utils/navigation-routes'

export const Navigation = () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="">boring.tools</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
            {NavigationRoutes.map((route) => {
              if (!route.childrens) {
                return (
                  <Link
                    key={route.name}
                    to={route.to}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                    activeProps={{ className: 'bg-muted text-primary' }}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.name}
                  </Link>
                )
              }

              return (
                <Accordion
                  type="single"
                  collapsible
                  key={route.name}
                  defaultValue="changelog"
                >
                  <AccordionItem value="changelog">
                    <AccordionTrigger>Changelog</AccordionTrigger>
                    <AccordionContent className="gap-2 flex flex-col">
                      {route.childrens.map((childRoute) => (
                        <Link
                          key={childRoute.name}
                          to={childRoute.to}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                          activeProps={{ className: 'bg-muted text-primary' }}
                          activeOptions={{ exact: true }}
                        >
                          <childRoute.icon className="h-4 w-4" />
                          {childRoute.name}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>More Infos</CardTitle>
              <CardDescription>
                If you want more information about boring.tools, visit our
                documentation!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <a href="https://boring.tools">
                <Button size="sm" className="w-full">
                  Documentation
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
