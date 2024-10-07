import { ThemeProvider, TooltipProvider } from '@boring.tools/ui'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './base.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

const queryClient = new QueryClient()

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Render the app
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <TooltipProvider delayDuration={350}>
            <QueryClientProvider client={queryClient}>
              {import.meta.env.PROD && (
                <script
                  defer
                  src="https://umami.hashdot.co/script.js"
                  data-website-id="446678cc-e2d8-4b6f-8e8f-389cd7f6db28"
                />
              )}
              <RouterProvider router={router} />
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </ClerkProvider>
    </StrictMode>,
  )
}
