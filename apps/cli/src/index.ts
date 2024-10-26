#! /usr/bin/env bun
import { parseArgs } from 'node:util'
import semver from 'semver'
import { z } from 'zod'
import { upload_commits } from './upload_commits'
//import { pushCommits } from './pushCommits'
import { args } from './utils/arguments'
import { git_log } from './utils/git_log'

if (args.success) {
  upload_commits(args.data)
}
