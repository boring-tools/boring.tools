import { createLazyFileRoute } from '@tanstack/react-router'
//import { usePageById, usePageList } from '../hooks/usePage'

const Component = () => {
  //const { data, error } = usePageList()

  return <div>some</div>
}

export const Route = createLazyFileRoute('/page/')({
  component: Component,
})
