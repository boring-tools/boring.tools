import {
  SidebarProvider,
  ThemeProvider,
  TooltipProvider,
} from '@boring.tools/ui'
import { ClerkProvider } from '@clerk/clerk-react'
import * as Sentry from '@sentry/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

Sentry.init({
  dsn: 'https://eee8b9e634a9ae0812518003d0512897@o4508167321354240.ingest.de.sentry.io/4508167916290128',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

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
      <SidebarProvider>
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
      </SidebarProvider>
    </StrictMode>,
  )
}
