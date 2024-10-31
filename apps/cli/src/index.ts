#! /usr/bin/env bun
import { upload_commits } from './upload_commits'
import { args } from './utils/arguments'

if (args.success) {
  upload_commits(args.data)
}
