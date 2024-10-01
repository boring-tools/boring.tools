import { UserProfile } from '@clerk/clerk-react'
import { createLazyFileRoute } from '@tanstack/react-router'

const Component = () => {
  return <UserProfile routing="virtual" />
}

export const Route = createLazyFileRoute('/user/')({
  component: Component,
})
