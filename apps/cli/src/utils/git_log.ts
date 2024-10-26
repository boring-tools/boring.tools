const GITFORMAT =
  '--pretty=format:{"commit": "%h", "parent": "%p", "refs": "%D", "subject": "%s", "author": { "name": "%aN", "email": "%aE", "date": "%ad" }, "commiter": { "name": "%cN", "email": "%cE", "date": "%cd" }},'
export const git_log = async (
  from: string | undefined,
  to = 'HEAD',
): Promise<Array<Record<string, unknown>>> => {
  // https://git-scm.com/docs/pretty-formats
  const process = Bun.spawn([
    'git',
    'log',
    `${from ? `${from}...` : ''}${to}`,
    GITFORMAT,
    '--date=iso',
  ])

  const output = await new Response(process.stdout).text()
  const jsonString = `[${output.slice(0, -1)}]`
  return JSON.parse(jsonString)
}
