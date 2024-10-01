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
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@boring.tools/ui'
import { Link } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'
import { NavigationRoutes } from '../utils/navigation-routes'

export const NavigationMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <span className="sr-only">boring.tools</span>
          </Link>
          {NavigationRoutes.map((route) => {
            if (!route.childrens) {
              return (
                <Link
                  key={route.name}
                  to={route.to}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                  activeProps={{ className: 'bg-muted text-primary' }}
                  activeOptions={{ exact: true }}
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
        <div className="mt-auto">
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
      </SheetContent>
    </Sheet>
  )
}
