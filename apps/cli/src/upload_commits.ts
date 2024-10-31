import type { Arguments } from './utils/arguments'
import { fetchAPI } from './utils/fetch_api'
import { git_log } from './utils/git_log'

const getLastCommitHash = async (args: Arguments) => {
  const result = await fetchAPI(
    `/v1/changelog/commit?changelogId=${args.changelogId}&limit=1`,
    {},
    args.accessToken,
  )

  if (!result) {
    return ''
  }

  if (Array.isArray(result)) {
    if (result.length === 0) {
      return ''
    }
    return result[0].commit
  }

  return ''
}

export const upload_commits = async (arguemnts: Arguments) => {
  const hash = await getLastCommitHash(arguemnts)
  const commits = await git_log(hash)

  if (commits.length === 0) {
    console.info('No new commits found')
    return
  }

  console.info(`Pushing ${commits.length} commits`)
  const mappedCommits = commits.map((commit) => ({
    ...commit,
    changelogId: arguemnts.changelogId,
  }))

  await fetchAPI(
    '/v1/changelog/commit',
    {
      method: 'POST',
      body: JSON.stringify(mappedCommits),
    },
    arguemnts.accessToken,
  )
}
