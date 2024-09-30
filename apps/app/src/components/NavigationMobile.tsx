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
import { HomeIcon, MenuIcon } from 'lucide-react'

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
          <Link
            to="/"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
            activeProps={{
              className: 'bg-muted text-foreground',
            }}
          >
            <HomeIcon className="h-5 w-5" />
            Dashboard
          </Link>
        </nav>
        <div className="mt-auto">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>More Infos</CardTitle>
              <CardDescription>
                If you want more informations about boring.tools, visit our
                documenation!
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
