import type { CommitOutput } from '@boring.tools/schema'
import type { z } from '@hono/zod-openapi'
import { convert } from 'convert-gitmoji'
import { type GitCommit, parseCommits } from './parseCommit'

export const config = {
  types: {
    feat: { title: '🚀 Enhancements', semver: 'minor' },
    perf: { title: '🔥 Performance', semver: 'patch' },
    fix: { title: '🩹 Fixes', semver: 'patch' },
    refactor: { title: '💅 Refactors', semver: 'patch' },
    docs: { title: '📖 Documentation', semver: 'patch' },
    build: { title: '📦 Build', semver: 'patch' },
    types: { title: '🌊 Types', semver: 'patch' },
    chore: { title: '🏡 Chore' },
    examples: { title: '🏀 Examples' },
    test: { title: '✅ Tests' },
    style: { title: '🎨 Styles' },
    ci: { title: '🤖 CI' },
  },
}

type Commit = z.infer<typeof CommitOutput>
export const commitsToMarkdown = async (commits: Commit[]) => {
  const parsedCommits = await parseCommits(commits)

  const typeGroups: Record<string, GitCommit[]> = groupBy(parsedCommits, 'type')

  const markdown: string[] = []
  const breakingChanges = []

  for (const type in config.types) {
    const group = typeGroups[type]
    if (!group || group.length === 0) {
      continue
    }

    if (type in config.types) {
      markdown.push(
        '',
        `### ${config.types[type as keyof typeof config.types].title}`,
        '',
      )
      for (const commit of group.reverse()) {
        const line = formatCommit(commit)
        markdown.push(line)
        if (commit.isBreaking) {
          breakingChanges.push(line)
        }
      }
    }
  }

  if (breakingChanges.length > 0) {
    markdown.push('', '#### ⚠️ Breaking Changes', '', ...breakingChanges)
  }

  const _authors = new Map<string, { email: Set<string>; github?: string }>()
  for (const commit of commits) {
    if (!commit.author) {
      continue
    }
    const name = formatName(commit.author.name)
    if (!name || name.includes('[bot]')) {
      continue
    }
    if (_authors.has(name)) {
      const entry = _authors.get(name)
      entry?.email.add(commit.author.email)
    } else {
      _authors.set(name, { email: new Set([commit.author.email]) })
    }
  }

  const authors = [..._authors.entries()].map((e) => ({ name: e[0], ...e[1] }))

  if (authors.length > 0) {
    markdown.push(
      '',
      '### ' + '❤️ Contributors',
      '',
      ...authors.map((i) => {
        return `- ${i.name} ${[...i.email]}`
      }),
    )
  }

  return convert(markdown.join('\n').trim(), true)
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function groupBy(items: any[], key: string): Record<string, any[]> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const groups: Record<string, any[]> = {}
  for (const item of items) {
    groups[item[key]] = groups[item[key]] || []
    groups[item[key]].push(item)
  }
  return groups
}

function formatCommit(commit: GitCommit) {
  return `- ${commit.scope ? `**${commit.scope.trim()}:** ` : ''}${
    commit.isBreaking ? '⚠️  ' : ''
  }${commit.description}`
}

function formatName(name = '') {
  return name
    .split(' ')
    .map((p) => p.trim())
    .join(' ')
}
