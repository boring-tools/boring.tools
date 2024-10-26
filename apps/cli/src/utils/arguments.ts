import { parseArgs } from 'node:util'
import { z } from 'zod'

const ENV_ID = Bun.env.CHANGELOG_ID
const ENV_TOKEN = Bun.env.AUTH_TOKEN

const schema = z.object({
  token: z.string(),
  changelogId: z.string(),
})
export type Arguments = z.infer<typeof schema>

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    token: {
      type: 'string',
    },
    changelogId: {
      type: 'string',
    },
  },
  strict: true,
  allowPositionals: true,
})

const mappedArguments = {
  ...values,
  token: values.token || ENV_TOKEN,
  changelogId: values.changelogId || ENV_ID,
}

export const args = schema.safeParse(mappedArguments)

if (!args.success) {
  console.error(
    `@changelog/cli: Missing arguemnts: ${args.error.errors
      .map((error) => error.path[0])
      .join(', ')}`,
  )
  process.exit(1)
}
