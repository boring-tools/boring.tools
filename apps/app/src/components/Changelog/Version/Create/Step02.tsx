import { VersionCreateAutoInput } from '@boring.tools/schema'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@boring.tools/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { useChangelogVersionCreateAuto } from '../../../../hooks/useChangelog'

export const ChangelogVersionCreateStep02 = () => {
  const { id } = useParams({ from: '/changelog/$id' })
  const navigate = useNavigate({ from: `/changelog/${id}` })
  const autoVersion = useChangelogVersionCreateAuto()

  const form = useForm<z.infer<typeof VersionCreateAutoInput>>({
    resolver: zodResolver(VersionCreateAutoInput),
    defaultValues: {
      changelogId: id,
      version: null,
    },
  })

  const onSubmit = (values: z.infer<typeof VersionCreateAutoInput>) => {
    autoVersion.mutate(values, {
      onSuccess(data) {
        navigate({
          to: '/changelog/$id/version/$versionId',
          params: { id, versionId: data.id },
        })
      },
    })
  }

  return (
    <div className="flex gap-10 mt-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
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
                <FormDescription>
                  Leave blank for auto generating.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-5 mt-5 w-full justify-end items-end md:col-span-6">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
