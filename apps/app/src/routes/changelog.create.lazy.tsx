import { ChangelogCreateInput } from '@boring.tools/schema'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@boring.tools/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { PageWrapper } from '../components/PageWrapper'
import { useChangelogCreate } from '../hooks/useChangelog'

const Component = () => {
  const navigate = useNavigate({ from: '/changelog/create' })
  const changelogCreate = useChangelogCreate()
  const form = useForm<z.infer<typeof ChangelogCreateInput>>({
    resolver: zodResolver(ChangelogCreateInput),
    defaultValues: {
      title: '',
      description: '',
      isSemver: true,
      isConventional: true,
    },
  })

  const onSubmit = (values: z.infer<typeof ChangelogCreateInput>) => {
    changelogCreate.mutate(values, {
      onSuccess(data) {
        navigate({ to: '/changelog/$id', params: { id: data.id } })
      },
    })
  }

  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Changelog',
          to: '/changelog',
        },
        { name: 'New', to: '/changelog/create' },
      ]}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">New changelog</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10 w-full max-w-screen-lg"
          >
            <div className="flex gap-10 w-full max-w-screen-lg">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 w-full">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="My changelog"
                              {...field}
                              autoFocus
                            />
                          </FormControl>{' '}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Some details about the changelog..."
                              {...field}
                            />
                          </FormControl>{' '}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full flex flex-col gap-5">
                    <FormField
                      control={form.control}
                      name="isSemver"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Using Semver</FormLabel>
                            <FormDescription>
                              If this changelog is following the{' '}
                              <a
                                href="https://semver.org/lang/de/"
                                className="text-emerald-700"
                              >
                                semantic versioning?
                              </a>
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isConventional"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Using Conventional Commits</FormLabel>
                            <FormDescription>
                              If this changelog is using{' '}
                              <a
                                href="https://www.conventionalcommits.org/en/v1.0.0/"
                                className="text-emerald-700"
                              >
                                conventional commits
                              </a>
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-end justify-end gap-5">
              <Button
                type="button"
                variant={'ghost'}
                onClick={() => navigate({ to: '/changelog' })}
              >
                Cancel
              </Button>

              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </div>
    </PageWrapper>
  )
}

export const Route = createLazyFileRoute('/changelog/create')({
  component: Component,
})
