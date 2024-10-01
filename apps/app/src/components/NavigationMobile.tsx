import {
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
          {NavigationRoutes.map((route) => (
            <Link
              key={route.to}
              to={route.to}
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
              activeProps={{
                className: 'bg-muted text-foreground',
              }}
            >
              <route.icon className="h-5 w-5" />
              {route.name}
            </Link>
          ))}
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
