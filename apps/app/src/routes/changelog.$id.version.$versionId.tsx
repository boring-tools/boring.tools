import { VersionUpdateInput } from '@boring.tools/schema'
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
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
    }
  }, [data])

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
        <div>
          <h1 className="text-xl mb-2">Version: {data.version}</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-screen-md"
            >
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
            </form>
          </Form>

          <ChangelogVersionDelete id={id} versionId={versionId} />
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/changelog/$id/version/$versionId')({
  component: Component,
})
