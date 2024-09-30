declare module 'bun' {
  interface Env {
    POSTGRES_URL: string
    CLERK_WEBHOOK_SECRET: string
    CLERK_SECRET_KEY: string
    CLERK_PUBLISHABLE_KEY: string
  }
}

export const startup = () => {
  const keys = [
    'POSTGRES_URL',
    'CLERK_WEBHOOK_SECRET',
    'CLERK_SECRET_KEY',
    'CLERK_PUBLISHABLE_KEY',
  ]
  keys.map((key) => {
    if (!import.meta.env[key]) {
      console.error(`Env Var ${key} is missing!`)
      process.exit(0)
    }
  })
}
