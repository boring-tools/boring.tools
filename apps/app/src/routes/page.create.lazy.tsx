import { PageCreateInput } from '@boring.tools/schema'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  cn,
} from '@boring.tools/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { PageWrapper } from '../components/PageWrapper'
import { useChangelogList } from '../hooks/useChangelog'
import { usePageCreate } from '../hooks/usePage'

const Component = () => {
  const navigate = useNavigate({ from: '/page/create' })
  const changelogList = useChangelogList()
  const pageCreate = usePageCreate()
  const form = useForm<z.infer<typeof PageCreateInput>>({
    resolver: zodResolver(PageCreateInput),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      changelogIds: [],
    },
  })

  const onSubmit = (values: z.infer<typeof PageCreateInput>) => {
    pageCreate.mutate(values, {
      onSuccess(data) {
        navigate({ to: '/page/$id', params: { id: data.id } })
      },
    })
  }

  return (
    <PageWrapper
      breadcrumbs={[
        {
          name: 'Page',
          to: '/page',
        },
        { name: 'New', to: '/page/create' },
      ]}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl">New page</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10 w-full max-w-screen-lg"
          >
            <div className="flex gap-10 w-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My page" {...field} autoFocus />
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
                            placeholder="Some details about the page..."
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>{' '}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Options</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="changelogIds"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Changelogs</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'w-[200px] justify-between',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value.length === 1 &&
                                  changelogList.data?.find((changelog) =>
                                    field.value?.includes(changelog.id),
                                  )?.title}
                                {field.value.length <= 0 &&
                                  'No changelog selected'}
                                {field.value.length > 1 &&
                                  `${field.value.length} selected`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search changelogs..." />
                              <CommandList>
                                <CommandEmpty>No changelog found.</CommandEmpty>
                                <CommandGroup>
                                  {changelogList.data?.map((changelog) => (
                                    <CommandItem
                                      value={changelog.title}
                                      key={changelog.id}
                                      onSelect={() => {
                                        const getIds = () => {
                                          if (
                                            field.value.includes(changelog.id)
                                          ) {
                                            const asd = field.value.filter(
                                              (id) => id !== changelog.id,
                                            )
                                            return asd
                                          }

                                          return [...field.value, changelog.id]
                                        }
                                        form.setValue('changelogIds', getIds())
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value.includes(changelog.id)
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {changelog.title}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          This changelogs are shown on this page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex items-end justify-end gap-5">
              <Button
                type="button"
                variant={'ghost'}
                onClick={() => navigate({ to: '/page' })}
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

export const Route = createLazyFileRoute('/page/create')({
  component: Component,
})
