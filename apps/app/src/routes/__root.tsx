import { ThemeToggle } from '@boring.tools/ui'
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <SignedOut>
        <div className="flex items-center justify-center w-full h-screen">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <>
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
            <ThemeToggle />
            <UserButton />
          </div>
          <hr />
          <Outlet />
          <TanStackRouterDevtools />
        </>
      </SignedIn>
    </>
  ),
})
