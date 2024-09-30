import { ThemeToggle } from '@boring.tools/ui'
import { SignIn, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout } from '../components/Layout'

export const Route = createRootRoute({
  component: () => (
    <>
      <SignedOut>
        <div className="flex items-center justify-center w-full h-screen">
          <SignIn />
        </div>
      </SignedOut>
      <SignedIn>
        <Layout>
          <Outlet />
          {!import.meta.env.PROD && <TanStackRouterDevtools />}
        </Layout>
      </SignedIn>
    </>
  ),
})
