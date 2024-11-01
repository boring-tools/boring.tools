import type { CommitOutput } from '@boring.tools/schema'
import type { z } from '@hono/zod-openapi'

export interface GitCommitAuthor {
  name: string
  email: string
}

export interface GitCommit {
  description: string
  type: string
  scope: string
  authors: GitCommitAuthor[]
  isBreaking: boolean
}

type Commit = z.infer<typeof CommitOutput>

export function parseCommits(commits: Commit[]): GitCommit[] {
  return commits.map((commit) => parseGitCommit(commit)).filter(Boolean)
}

// https://www.conventionalcommits.org/en/v1.0.0/
// https://regex101.com/r/FSfNvA/1
const ConventionalCommitRegex =
  /(?<emoji>:.+:|(\uD83C[\uDF00-\uDFFF])|(\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF])|[\u2600-\u2B55])?( *)?(?<type>[a-z]+)(\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i
const CoAuthoredByRegex = /co-authored-by:\s*(?<name>.+)(<(?<email>.+)>)/gim

export function parseGitCommit(commit: Commit): GitCommit | null {
  const match = commit.subject.match(ConventionalCommitRegex)
  if (!match) {
    return {
      ...commit,
      authors: [],
      description: '',
      type: 'none',
      scope: 'none',
      isBreaking: false,
    }
  }

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const type = match.groups?.['type'] ?? ''

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const scope = match.groups?.['scope'] ?? ''

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const isBreaking = Boolean(match.groups?.['breaking'])
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const description = match.groups?.['description'] ?? ''

  // Find all authors
  const authors: GitCommitAuthor[] = [commit.author]
  if (commit?.body) {
    for (const match of commit.body.matchAll(CoAuthoredByRegex)) {
      authors.push({
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        name: (match.groups?.['name'] ?? '').trim(),
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        email: (match.groups?.['email'] ?? '').trim(),
      })
    }
  }

  return {
    authors,
    description,
    type,
    scope,
    isBreaking,
  }
}
