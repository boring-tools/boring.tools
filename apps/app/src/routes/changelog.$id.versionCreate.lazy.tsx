import { VersionCreateInput } from '@boring.tools/schema'
import {
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
import { useChangelogVersionCreate } from '../hooks/useChangelog'
import '@mdxeditor/editor/style.css'

const Component = () => {
  const { id } = Route.useParams()
  const navigate = useNavigate({ from: `/changelog/${id}/versionCreate` })
  const versionCreate = useChangelogVersionCreate()
  const form = useForm<z.infer<typeof VersionCreateInput>>({
    resolver: zodResolver(VersionCreateInput),
    defaultValues: {
      changelogId: id,
      version: '',
      markdown: '',
    },
  })

  const onSubmit = (values: z.infer<typeof VersionCreateInput>) => {
    versionCreate.mutate(values, {
      onSuccess(data) {
        navigate({ to: '/changelog/$id', params: { id: data.changelogId } })
      },
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl">New version</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-screen-md"
        >
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

          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  )
}

export const Route = createLazyFileRoute('/changelog/$id/versionCreate')({
  component: Component,
})
