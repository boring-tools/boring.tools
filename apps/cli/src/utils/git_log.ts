const GITFORMAT = `--pretty=format:{%n "commit": "%h",%n "parent": "%p",%n "refs": "%D",%n "subject": "%s",%n "notes": "%N",%n "body": "%b",%n "author": { "name": "%aN", "email": "%aE", "date": "%ad" },%n "commiter": { "name": "%cN", "email": "%cE", "date": "%cd" }%n},`
export const git_log = async (
  from: string | undefined,
  to = 'HEAD',
): Promise<boolean> => {
  // https://git-scm.com/docs/pretty-formats
  const r = await Bun.spawn([
    'git',
    '--no-pager',
    'log',
    `${from ? `${from}...` : ''}${to}`,
    GITFORMAT,
    //'--name-status',
    '--date=iso',
  ])
  const text = await new Response(r.stdout).text()
  // console.log(JSON.parse('[' + text.slice(0, -1) + ']'))
  // const str = JSON.stringify(`[${text.slice(0, -1)}]`)
  // console.log(JSON.parse(str))
  return false
}
