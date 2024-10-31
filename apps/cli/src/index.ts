#! /usr/bin/env bun
import { program } from '@commander-js/extra-typings'
import { upload_commits } from './upload_commits'
import type { Arguments } from './utils/arguments'

const ENV_CHANGELOG_ID = Bun.env.BT_CHANGELOG_ID
const ENV_ACCESS_TOKEN = Bun.env.BT_ACCESS_TOKEN

program.name('bt-cli').description('boring.tools CLI').version('0.8.0')

const commit = program.command('commit').description('Commits')
commit
  .command('upload')
  .description('Upload commit messages')
  .requiredOption('--changelogId', 'Changelog Id', ENV_CHANGELOG_ID)
  .requiredOption('--accessToken', 'Access Token', ENV_ACCESS_TOKEN)
  .action((data) => {
    upload_commits(data as Arguments)
  })

program.parse()
