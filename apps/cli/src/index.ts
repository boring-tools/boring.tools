#! /usr/bin/env bun
import { parseArgs } from 'node:util'
import semver from 'semver'
import { z } from 'zod'
import { git_log } from './utils/git_log'
//import { pushCommits } from './pushCommits'

const ENV_VERSION = Bun.env.CHANGELOG_VERSION
const ENV_ID = Bun.env.CHANGELOG_ID
const ENV_TOKEN = Bun.env.CHANGELOG_TOKEN

const schema = z.object({
  title: z.string().optional(),
  version: z.string().optional(),
  token: z.string(),
  changelogId: z.string(),
})
export type Arguments = z.infer<typeof schema>

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    title: {
      type: 'string',
    },
    version: {
      type: 'string',
    },
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
  version: values.version || ENV_VERSION,
  token: values.token || ENV_TOKEN,
  changelogId: values.changelogId || ENV_ID,
}

const args = schema.safeParse(mappedArguments)

/*if  (!args.success) {
  console.error(
    `@changelog/cli: Missing arguemnts: ${args.error.errors
      .map((error) => error.path[0])
      .join(', ')}`,
  )
  process.exit(1)
} */

// const version = semver.coerce(result.data.version);

// // Check for correct semver
// if (!version) {
//   console.error(
//     "@changelog/cli: Invalid version. Please provide a valid semver version."
//   );
//   process.exit(1);
// }

//pushCommits(args.data)

git_log('')
