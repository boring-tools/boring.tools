import { VersionCreateInput } from '@boring.tools/schema'
import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@boring.tools/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import {
  useChangelogCommitList,
  useChangelogVersionCreate,
} from '../hooks/useChangelog'
import '@mdxeditor/editor/style.css'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { VersionStatus } from '../components/Changelog/VersionStatus'

const Component = () => {
  const { id } = Route.useParams()
  const navigate = useNavigate({ from: `/changelog/${id}/versionCreate` })
  const changelogCommit = useChangelogCommitList({ id })
  const versionCreate = useChangelogVersionCreate()
  const { data } = useChangelogCommitList({ id })
  const form = useForm<z.infer<typeof VersionCreateInput>>({
    resolver: zodResolver(VersionCreateInput),
    defaultValues: {
      changelogId: id,
      version: '',
      markdown: '',
      status: 'draft',
      commitIds: [],
    },
  })

  const selectAllCommits = () => {
    const commitIds = data?.map((commit) => commit.id)
    if (!commitIds) {
      return form.setValue('commitIds', [])
    }
    form.setValue('commitIds', commitIds)
  }

  const onSubmit = (values: z.infer<typeof VersionCreateInput>) => {
    versionCreate.mutate(values, {
      onSuccess(data) {
        navigate({ to: '/changelog/$id', params: { id: data.changelogId } })
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <h1 className="text-2xl">New version</h1>
        <div className="grid md:grid-cols-6 gap-5 w-full md:max-w-screen-xl grid-flow-row grid-cols-1">
          <Card className="md:col-span-4 col-span-1">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0.1" {...field} autoFocus />
                    </FormControl>{' '}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-5 md:items-center flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your version status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex gap-2 items-center">
                              <VersionStatus status={'draft'} />
                              <span>Draft</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="review">
                            <div className="flex gap-2 items-center">
                              <VersionStatus status={'review'} />
                              <span>Review</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="published">
                            <div className="flex gap-2 items-center">
                              <VersionStatus status={'published'} />
                              <span>Published</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releasedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Released at</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              size={'lg'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={(date) => field.onChange(date)}
                            weekStartsOn={1}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="markdown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Changes</FormLabel>
                    <FormControl>
                      <MDXEditor
                        className="dark-theme h-56"
                        contentEditableClassName="prose dark:prose-invert max-w-none"
                        markdown={field.value}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          thematicBreakPlugin(),
                          quotePlugin(),
                          toolbarPlugin({
                            toolbarContents: () => (
                              <>
                                <BlockTypeSelect />
                                <BoldItalicUnderlineToggles />
                                <ListsToggle />
                                <UndoRedo />
                              </>
                            ),
                          }),
                        ]}
                        {...field}
                      />
                    </FormControl>{' '}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Associated commits</CardTitle>

                <Button
                  variant={'ghost'}
                  size={'sm'}
                  onClick={selectAllCommits}
                >
                  Add all commits
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full h-[350px]">
                <div className="flex flex-col gap-2">
                  {changelogCommit.data?.map((commit) => {
                    return (
                      <FormField
                        key={commit.id}
                        control={form.control}
                        name={'commitIds'}
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                              <FormControl>
                                <Checkbox
                                  // checked={field.value}
                                  value={commit.id}
                                  checked={field.value?.includes(commit.id)}
                                  onCheckedChange={() => {
                                    const exist = field.value.includes(
                                      commit.id,
                                    )
                                    if (exist) {
                                      return field.onChange(
                                        field.value.filter(
                                          (value) => value !== commit.id,
                                        ),
                                      )
                                    }
                                    return field.onChange([
                                      ...field.value,
                                      commit.id,
                                    ])
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{commit.subject}</FormLabel>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="flex gap-5 mt-5 w-full justify-end items-end md:col-span-6">
            <Button
              type="button"
              variant={'ghost'}
              onClick={() => navigate({ to: '/changelog/$id', params: { id } })}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export const Route = createLazyFileRoute('/changelog/$id/versionCreate')({
  component: Component,
})
