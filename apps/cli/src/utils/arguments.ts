import { z } from 'zod'

const schema = z.object({
  accessToken: z.string().startsWith('bt_'),
  changelogId: z.string(),
})

export type Arguments = z.infer<typeof schema>
