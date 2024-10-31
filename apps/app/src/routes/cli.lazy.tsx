import { Button, Card, CardContent, CardHeader, cn } from '@boring.tools/ui'
import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PageWrapper } from '../components/PageWrapper'

const Platforms = [
  {
    name: 'Linux',
    arch: 'x86',
    svg: '/linux.svg',
    path: '/cli/linux/bt-cli',
    filename: 'bt-cli',
  },
  {
    name: 'Apple Intel',
    arch: 'Intel',
    svg: '/apple.svg',
    path: '/cli/mac-intel/bt-cli',
    filename: 'bt-cli',
  },
  {
    name: 'Apple ARM',
    arch: 'ARM',
    svg: '/apple.svg',
    path: '/cli/mac-arm/bt-cli',
    filename: 'bt-cli',
  },
  {
    name: 'Windows',
    arch: 'x86',
    svg: '/windows.svg',
    path: '/cli/windows/bt-cli.exe',
    filename: 'bt-cli.exe',
  },
]

const Component = () => {
  const [activePlatform, setPlatform] = useState('Linux')
  const getPlatform = Platforms.find((p) => p.name === activePlatform)
  return (
    <PageWrapper breadcrumbs={[{ name: 'CLI', to: '/cli' }]}>
      <div className="flex flex-col gap-5 w-full md:max-w-screen-lg">
        <h1 className="text-3xl">CLI</h1>
        <p className="text-muted-foreground">
          With our CLI you can upload your commits for your changelog in just a
          few seconds.
        </p>
        <h2 className="text-xl">Platform</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {Platforms.map((platform) => {
            return (
              // <a
              //   href={`https://cdn.boring.tools${platform.path}`}
              //   key={`${platform.arch}-${platform.name}`}
              //   download={platform.filename}
              // >
              <Card
                className={cn('hover:border-accent transition', {
                  'border-accent': platform.name === activePlatform,
                })}
                key={`${platform.arch}-${platform.name}`}
                onClick={() => setPlatform(platform.name)}
              >
                <CardHeader>
                  <img
                    src={platform.svg}
                    alt={platform.name}
                    className="h-10 md:h-20"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  {platform.arch}
                </CardContent>
              </Card>
              // </a>
            )
          })}
        </div>
        <h2 className="text-xl">Download</h2>
        <Button asChild variant={'outline'}>
          <a
            href={`https://cdn.boring.tools${getPlatform?.path}`}
            download={getPlatform?.filename}
          >
            https://cdn.boring.tools{getPlatform?.path}
          </a>
        </Button>
        <h2 className="text-xl">WGET</h2>
        <pre className="bg-muted text-xs md:text-xl p-3 rounded text-center flex justify-between items-center">
          wget https://cdn.boring.tools{getPlatform?.path}
        </pre>
        <h2 className="text-xl">Usage</h2>
        <pre className="bg-muted text-xs md:text-xl p-3 rounded text-center flex justify-between items-center">
          {getPlatform?.filename} --help
        </pre>

        <p className="text-muted-foreground">
          Alternatively, you can use an .env file:
        </p>

        <pre className="bg-muted text-xs md:text-xl p-3 rounded text-center flex justify-between items-center">
          BT_CHANGELOG_ID=...
          <br />
          BT_ACCESS_TOKEN=bt_...
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
