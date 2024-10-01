import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/changelog/')({
  component: () => <div>Hello /changelog/!</div>,
})
