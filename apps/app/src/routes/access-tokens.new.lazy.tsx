import { AccessTokenCreateInput } from '@boring.tools/schema'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@boring.tools/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute, useRouter } from '@tanstack/react-router'
import { AlertCircle, CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCopyToClipboard } from 'usehooks-ts'
import type { z } from 'zod'
import { PageWrapper } from '../components/PageWrapper'
import { useAccessTokenCreate } from '../hooks/useAccessToken'

const Component = () => {
  const router = useRouter()
  const [, copy] = useCopyToClipboard()
  const [token, setToken] = useState<null | string>(null)
  const accessTokenCreate = useAccessTokenCreate()
  const form = useForm<z.infer<typeof AccessTokenCreateInput>>({
    resolver: zodResolver(AccessTokenCreateInput),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = (values: z.infer<typeof AccessTokenCreateInput>) => {
    accessTokenCreate.mutate(values, {
      onSuccess(data) {
        if (data.token) {
          setToken(data.token)
        }
      },
    })
  }
  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Access tokens',
          to: '/access-tokens',
        },
        {
          name: 'New',
          to: '/access-tokens/new',
        },
      ]}
    >
      <div className="flex w-full gap-5 justify-between items-center">
        <h1 className="text-3xl">New access token</h1>
      </div>

      {token && (
        <div className="flex flex-col gap-3 w-full max-w-screen-md">
          <h2 className="text-xl">Your token</h2>
          <pre className="bg-muted text-xl p-3 rounded text-center flex justify-between items-center">
            {token}
            <Button
              onClick={() => copy(token)}
              size={'icon'}
              variant={'outline'}
            >
              <CopyIcon className="w-4 h-4" />
            </Button>
          </pre>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Reminder</AlertTitle>
            <AlertDescription>
              Your token is only visible this time. Please notify it securely.
              If you forget it, you have to create a new token.
            </AlertDescription>
          </Alert>
          <div className="flex items-center justify-end">
            <Button
              variant={'ghost'}
              type="button"
              onClick={() => router.history.back()}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {!token && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-screen-md"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="CLI Token" {...field} autoFocus />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex items-center justify-end gap-5">
              <Button
                variant={'ghost'}
                type="button"
                onClick={() => router.history.back()}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      )}
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/access-tokens/new')({
  component: Component,
})
