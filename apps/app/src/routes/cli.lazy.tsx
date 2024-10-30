import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { CopyIcon } from 'lucide-react'
import { PageWrapper } from '../components/PageWrapper'

const Platforms = [
  {
    name: 'Linux',
    arch: 'x86',
    svg: '/linux.svg',
    path: '/cli/linux/bt',
    filename: 'bt',
  },
  {
    name: 'Apple Intel',
    arch: 'Intel',
    svg: '/apple.svg',
    path: '/cli/mac-intel/bt',
    filename: 'bt',
  },
  {
    name: 'Apple ARM',
    arch: 'ARM',
    svg: '/apple.svg',
    path: '/cli/mac-arm/bt',
    filename: 'bt',
  },
  {
    name: 'Windows',
    arch: 'x86',
    svg: '/windows.svg',
    path: '/cli/windows/bt.exe',
    filename: 'bt.exe',
  },
]

const Component = () => {
  return (
    <PageWrapper breadcrumbs={[{ name: 'CLI', to: '/cli' }]}>
      <div className="flex flex-col gap-5 w-full max-w-screen-lg">
        <h1 className="text-3xl">CLI</h1>
        <p className="text-muted-foreground">
          With our CLI you can upload your commits for your changelog in just a
          few seconds.
        </p>
        <h2 className="text-xl">Download</h2>
        <div className="grid grid-cols-4 gap-10">
          {Platforms.map((platform) => {
            return (
              <a
                href={`https://cdn.boring.tools${platform.path}`}
                key={`${platform.arch}-${platform.name}`}
                download={platform.filename}
              >
                <Card className="hover:border-accent transition">
                  <CardHeader>
                    <img
                      src={platform.svg}
                      alt={platform.name}
                      className="h-20"
                    />
                  </CardHeader>
                  <CardContent className="text-center">
                    {platform.arch}
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>

        <h2 className="text-xl">Usage</h2>
        <pre className="bg-muted text-xl p-3 rounded text-center flex justify-between items-center">
          bt --changelogId=... --token=bt_...
        </pre>

        <p className="text-muted-foreground">
          Alternatively, you can use an .env file:
        </p>

        <pre className="bg-muted text-xl p-3 rounded text-center flex justify-between items-center">
          BT_CHANGELOG_ID=...
          <br />
          BT_AUTH_TOKEN=bt_...
        </pre>

        <p className="text-muted-foreground">
          If you have not yet created an Access Token, you can do so{' '}
          <Link to="/access-tokens/new" className="text-accent font-bold">
            here
          </Link>
          .
        </p>
      </div>
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/cli')({
  component: Component,
})
