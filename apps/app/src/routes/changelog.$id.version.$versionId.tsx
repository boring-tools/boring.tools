import { VersionUpdateInput } from '@boring.tools/schema'
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
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from '@boring.tools/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ListsToggle,
  MDXEditor,
  type MDXEditorMethods,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import {
  useChangelogCommitList,
  useChangelogVersionById,
  useChangelogVersionUpdate,
} from '../hooks/useChangelog'
import '@mdxeditor/editor/style.css'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ChangelogVersionDelete } from '../components/Changelog/VersionDelete'
import { VersionStatus } from '../components/Changelog/VersionStatus'

const Component = () => {
  const { id, versionId } = Route.useParams()
  const mdxEditorRef = useRef<MDXEditorMethods>(null)
  const navigate = useNavigate({ from: `/changelog/${id}/versionCreate` })
  const versionUpdate = useChangelogVersionUpdate()
  const { data, error, isPending, refetch } = useChangelogVersionById({
    id: versionId,
  })
  const commitResult = useChangelogCommitList({ id })

  const form = useForm<z.infer<typeof VersionUpdateInput>>({
    resolver: zodResolver(VersionUpdateInput),
    defaultValues: data,
  })

  const onSubmit = (values: z.infer<typeof VersionUpdateInput>) => {
    versionUpdate.mutate(
      { id: versionId, payload: values },
      {
        onSuccess() {
          navigate({ to: '/changelog/$id', params: { id } })
        },
      },
    )
  }

  useEffect(() => {
    if (data) {
      mdxEditorRef.current?.setMarkdown(data.markdown)
      form.reset({
        ...data,
        commitIds: data.commits?.map((commit) => commit.id),
      })
    }
  }, [data, form])

  if (error) {
    return (
      <div className="flex items-center justify-center mt-32 flex-col">
        <h1 className="text-3xl">Changelogs</h1>
        <p>Please try again later</p>

        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Separator />
      {!isPending && data && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex gap-4 w-full"
          >
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input placeholder="v1.0.1" {...field} />
                      </FormControl>{' '}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="markdown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <MDXEditor
                          className="dark-theme"
                          contentEditableClassName="prose dark:prose-invert max-w-none"
                          markdown={''}
                          ref={mdxEditorRef}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
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
                        />
                      </FormControl>{' '}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-5 items-center">
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

                <div className="flex gap-5">
                  <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() =>
                      navigate({ to: '/changelog/$id', params: { id } })
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>

                <ChangelogVersionDelete id={id} versionId={versionId} />
              </CardContent>
            </Card>

            <div className="w-full">
              <Card className="w-full max-w-screen-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Commits ({data.commits?.length})</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="assigned" className="w-full">
                    <TabsList>
                      <TabsTrigger value="assigned">Assigend</TabsTrigger>
                      <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
                    </TabsList>
                    <TabsContent value="assigned">
                      <ScrollArea className="w-full h-[350px]">
                        <div className="flex flex-col gap-2">
                          {data?.commits?.map((commit) => {
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
                                          value={commit.id}
                                          checked={field.value?.includes(
                                            commit.id,
                                          )}
                                          onCheckedChange={() => {
                                            const exist = field.value?.includes(
                                              commit.id,
                                            )
                                            if (exist) {
                                              return field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== commit.id,
                                                ),
                                              )
                                            }
                                            return field.onChange([
                                              ...(field.value as string[]),
                                              commit.id,
                                            ])
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none w-full">
                                        <FormLabel className="flex gap-2 w-full">
                                          <span className="text-muted-foreground font-mono">
                                            {commit.commit}{' '}
                                          </span>
                                          <span className="w-full">
                                            {commit.subject}
                                          </span>
                                          <span>
                                            {format(
                                              new Date(commit.commiter.date),
                                              'dd.MM.',
                                            )}
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="unassigned">
                      <ScrollArea className="w-full h-[350px]">
                        <div className="flex flex-col gap-2">
                          {commitResult.data?.map((commit) => {
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
                                          value={commit.id}
                                          checked={field.value?.includes(
                                            commit.id,
                                          )}
                                          onCheckedChange={() => {
                                            const exist = field.value?.includes(
                                              commit.id,
                                            )
                                            if (exist) {
                                              return field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== commit.id,
                                                ),
                                              )
                                            }
                                            return field.onChange([
                                              ...(field.value as string[]),
                                              commit.id,
                                            ])
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none w-full">
                                        <FormLabel className="flex gap-2 w-full">
                                          <span className="text-muted-foreground font-mono">
                                            {commit.commit}
                                          </span>
                                          <span className="w-full">
                                            {commit.subject}
                                          </span>
                                          <span>
                                            {format(
                                              new Date(commit.commiter.date),
                                              'dd.MM.',
                                            )}
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export const Route = createFileRoute('/changelog/$id/version/$versionId')({
  component: Component,
})
